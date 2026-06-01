// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { SchemaType, type Tool, type FunctionCallPart, type GenerateContentResponse } from '@google/generative-ai'
import { getGeminiModel } from '@/lib/gemini'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SAVE_LEAD_TOOL: Tool = {
  functionDeclarations: [{
    name: 'save_lead',
    description: 'Save a potential client contact details when they have provided name, phone, and email.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name:    { type: SchemaType.STRING, description: 'Full name of the potential client' },
        phone:   { type: SchemaType.STRING, description: 'Phone number of the potential client' },
        email:   { type: SchemaType.STRING, description: 'Email address of the potential client' },
        message: { type: SchemaType.STRING, description: 'Brief summary of what the client is interested in' },
      },
      required: ['name', 'phone', 'email', 'message'],
    },
  }],
}

type ChatMessage   = { role: 'user' | 'assistant'; content: string }
type GeminiMessage = { role: 'user' | 'model'; parts: { text: string }[] }

// ─── Error classifiers ────────────────────────────────────────────────────────
function isRateLimitError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    return (
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('resource_exhausted') ||
      msg.includes('too many requests')
    )
  }
  return false
}

function isTransientError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase()
    return (
      msg.includes('503') ||
      msg.includes('502') ||
      msg.includes('504') ||
      msg.includes('econnreset') ||
      msg.includes('fetch failed') ||
      msg.includes('network')
    )
  }
  return false
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Single retry only for transient network/infrastructure errors.
// 429s are NOT retried server-side — they go straight back to the client.
// Retrying a 429 server-side consumes another quota slot immediately.
async function withTransientRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (err: unknown) {
    if (isTransientError(err)) {
      console.warn('[chat] Transient error — retrying once after 1s')
      await sleep(1000)
      return fn()
    }
    throw err
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    const realMessages = messages.filter(m => m.content?.trim())
    const lastMessage  = realMessages[realMessages.length - 1]

    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
    }

    // Build Gemini history — must start with a 'user' turn
    const historyMessages = realMessages.slice(0, -1)
    const firstUserIdx    = historyMessages.findIndex(m => m.role === 'user')
    const trimmedHistory  = firstUserIdx === -1 ? [] : historyMessages.slice(firstUserIdx)

    const geminiHistory: GeminiMessage[] = trimmedHistory.map(m => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // ── Call Gemini ────────────────────────────────────────────────────────
    let response: GenerateContentResponse

    try {
      const result = await withTransientRetry(async () => {
        const model = getGeminiModel()
        const chat  = model.startChat({ history: geminiHistory, tools: [SAVE_LEAD_TOOL] })
        return chat.sendMessage(lastMessage.content)
      })
      response = result.response
    } catch (err: unknown) {
      if (isRateLimitError(err)) {
        console.warn('[chat] Gemini quota hit — returning 429 to client')
        return NextResponse.json(
          { error: 'RATE_LIMITED', retryAfter: 15 },
          { status: 429 }
        )
      }
      throw err
    }

    // ── Tool call: save_lead ───────────────────────────────────────────────
    const functionCall = response.candidates?.[0]?.content?.parts?.find(
      (p): p is FunctionCallPart => 'functionCall' in p && p.functionCall !== undefined
    )

    if (functionCall?.functionCall?.name === 'save_lead') {
      const args = functionCall.functionCall.args as {
        name: string; phone: string; email: string; message: string
      }

      let saveError: string | null = null
      try {
        const { error } = await adminClient
          .from('leads')
          .insert([{ name: args.name, phone: args.phone, email: args.email, message: args.message }])
        if (error) {
          saveError = error.message
          console.error('[chat] Lead save error:', error.message)
        } else {
          console.log(`[chat] Lead saved — ${args.name} (${args.email})`)
        }
      } catch (err) {
        saveError = 'Database error'
        console.error('[chat] Lead save exception:', err)
      }

      let toolResponseText: string
      try {
        const toolResult = await withTransientRetry(async () => {
          const model = getGeminiModel()
          const chat  = model.startChat({
            history: [
              ...geminiHistory,
              { role: 'user',  parts: [{ text: lastMessage.content }] },
              { role: 'model', parts: response.candidates![0].content.parts },
            ],
            tools: [SAVE_LEAD_TOOL],
          })
          return chat.sendMessage([{
            functionResponse: {
              name: 'save_lead',
              response: {
                success: !saveError,
                message: saveError
                  ? 'Failed to save. Ask user to visit /get-quote directly.'
                  : 'Saved successfully. Confirm and guide them to /get-quote for their AI proposal.',
              },
            },
          }])
        })
        toolResponseText = toolResult.response.text()
      } catch (err) {
        if (isRateLimitError(err)) {
          return NextResponse.json({ error: 'RATE_LIMITED', retryAfter: 15 }, { status: 429 })
        }
        throw err
      }

        return streamText(toolResponseText)
    }

      return streamText(responseToText(response))

  } catch (error) {
    console.error('[chat] Unhandled error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or reach us on WhatsApp: +254 700 000 000.' },
      { status: 500 }
    )
  }
}

// ─── Word-by-word streaming helper ───────────────────────────────────────────
function streamText(text: string): Response {
  const encoder = new TextEncoder()
  const stream  = new ReadableStream({
    start(controller) {
      const words = text.split(' ')
      let i = 0
      const interval = setInterval(() => {
        if (i < words.length) {
          controller.enqueue(encoder.encode((i === 0 ? '' : ' ') + words[i]))
          i++
        } else {
          clearInterval(interval)
          controller.close()
        }
      }, 18)
    },
  })
  return new Response(stream, {
    headers: {
      'Content-Type':      'text/plain; charset=utf-8',
      'Cache-Control':     'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}

function responseToText(resp: GenerateContentResponse): string {
  const parts = resp.candidates?.[0]?.content?.parts ?? []
  return parts.map((p: any) => p.text ?? '').join('')
}
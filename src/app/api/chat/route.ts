// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { SchemaType, type Tool, type FunctionCallPart } from '@google/generative-ai'
import { getGeminiModel } from '@/lib/gemini'
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SAVE_LEAD_TOOL: Tool = {
  functionDeclarations: [{
    name: 'save_lead',
    description: 'Save a potential client contact details to the database when they have provided their name, phone number, and email address during the conversation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: 'Full name of the potential client' },
        phone: { type: SchemaType.STRING, description: 'Phone number of the potential client' },
        email: { type: SchemaType.STRING, description: 'Email address of the potential client' },
        message: { type: SchemaType.STRING, description: 'A brief summary of what the client is interested in' },
      },
      required: ['name', 'phone', 'email', 'message'],
    },
  }],
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type GeminiMessage = { role: 'user' | 'model'; parts: { text: string }[] }

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 })
    }

    // ✅ FIX: Strip the welcome message and any leading 'assistant' messages.
    // Gemini requires history to start with role 'user'.
    // The welcome message is UI-only — it must never enter the API history.
    const realMessages = messages.filter(m => m.content?.trim())

    // Separate last user message from history
    const lastMessage = realMessages[realMessages.length - 1]

    if (!lastMessage || lastMessage.role !== 'user') {
      return NextResponse.json({ error: 'Last message must be from user' }, { status: 400 })
    }

    // Build history — everything except the last message
    // Drop any leading assistant/model messages so history always starts with 'user'
    const historyMessages = realMessages.slice(0, -1)

    // Find the first user message index to trim any leading model turns
    const firstUserIdx = historyMessages.findIndex(m => m.role === 'user')

    const trimmedHistory = firstUserIdx === -1
      ? [] // no prior user messages — empty history
      : historyMessages.slice(firstUserIdx)

    // Convert to Gemini format
    const geminiHistory: GeminiMessage[] = trimmedHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const model = getGeminiModel()
    const chat = model.startChat({
      history: geminiHistory,
      tools: [SAVE_LEAD_TOOL],
    })

    const result = await chat.sendMessage(lastMessage.content)
    const response = await result.response

    // Check for tool call
    const functionCall = response.candidates?.[0]?.content?.parts?.find(
      (p): p is FunctionCallPart => 'functionCall' in p && p.functionCall !== undefined
    )

    if (functionCall?.functionCall?.name === 'save_lead') {
      const args = functionCall.functionCall.args as {
        name: string
        phone: string
        email: string
        message: string
      }

      let saveError: string | null = null
      try {
        const { error } = await adminClient
          .from('leads')
          .insert([{
            name: args.name,
            phone: args.phone,
            email: args.email,
            message: args.message,
          }])

        if (error) {
          saveError = error.message
          console.error('[chat/POST] Lead save error:', error.message)
        } else {
          console.log(`[chat/POST] Lead saved — ${args.name} (${args.email})`)
        }
      } catch (err) {
        saveError = 'Database error'
        console.error('[chat/POST] Lead save exception:', err)
      }

      const toolResult = await chat.sendMessage([{
        functionResponse: {
          name: 'save_lead',
          response: {
            success: !saveError,
            message: saveError
              ? 'Failed to save. Ask user to visit /get-quote directly.'
              : 'Saved successfully. Confirm details are saved and guide them to /get-quote for their AI proposal.',
          },
        },
      }])

      return streamText(toolResult.response.text())
    }

    return streamText(response.text())

  } catch (error) {
    console.error('[chat/POST] Unhandled error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

function streamText(text: string): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
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
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
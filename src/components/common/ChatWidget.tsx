// src/components/common/ChatWidget.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────
type MessageRole = 'user' | 'assistant'
type ChatState   = 'closed' | 'open' | 'minimised'

interface Message {
  id:        string
  role:      MessageRole
  content:   string
  timestamp: Date
  isError?:  boolean
  isQueued?: boolean   // shows a queued indicator instead of typing
}

interface ApiMessage {
  role:    MessageRole
  content: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const WELCOME_MESSAGE: Message = {
  id:        'welcome',
  role:      'assistant',
  content:   "Hi! I'm Kali 👋 I'm Tuinuane Digitals' AI assistant. I can help you with our products, pricing, and getting a free proposal. What brings you here today?",
  timestamp: new Date(),
}

const QUICK_PROMPTS = [
  'What products do you offer?',
  'How much does a website cost?',
  'I need an e-commerce shop',
  'Get me a free proposal',
]

// How long to wait before retrying after a 429.
// Server sends the exact value; this is the client-side fallback.
const DEFAULT_RETRY_WAIT_MS = 15_000

// Maximum number of automatic retries per message before giving up
const MAX_AUTO_RETRIES = 1

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [chatState, setChatState] = useState<ChatState>('closed')
  const [messages,  setMessages]  = useState<Message[]>([WELCOME_MESSAGE])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [unread,    setUnread]    = useState(0)
  const [hasOpened, setHasOpened] = useState(false)

  // Rate-limit state — shown in the UI, does NOT drive auto-retry logic
  const [rateLimited,   setRateLimited]   = useState(false)
  const [cooldownSecs,  setCooldownSecs]  = useState(0)

  const bottomRef      = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)
  const abortRef       = useRef<AbortController | null>(null)
  // Timer ref for the visual countdown — cleared on unmount / close
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  // Tracks retries per assistant message id to prevent infinite loops
  const retryCountRef  = useRef<Record<string, number>>({})

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (countdownTimer.current) clearInterval(countdownTimer.current)
    }
  }, [])

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Focus on open ────────────────────────────────────────────────────────
  useEffect(() => {
    if (chatState === 'open') {
      setTimeout(() => inputRef.current?.focus(), 120)
      setUnread(0)
    }
  }, [chatState])

  // ── Attention badge after 45s ────────────────────────────────────────────
  useEffect(() => {
    if (hasOpened) return
    const t = setTimeout(() => setUnread(1), 45_000)
    return () => clearTimeout(t)
  }, [hasOpened])

  // ── Helpers ──────────────────────────────────────────────────────────────
  const open     = () => { setChatState('open');      setHasOpened(true); setUnread(0) }
  const close    = () => { setChatState('closed');    abortRef.current?.abort(); stopCooldown() }
  const collapse = () => { setChatState('minimised'); }

  const stopCooldown = () => {
    if (countdownTimer.current) clearInterval(countdownTimer.current)
    setRateLimited(false)
    setCooldownSecs(0)
  }

  const mkId = (role: MessageRole) => `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

  const updateMessage = (id: string, patch: Partial<Message>) =>
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))

  // Build history safe to send to the API:
  // - exclude the static welcome message
  // - exclude error/queued placeholder messages
  // - exclude empty content
  const buildApiHistory = (currentMessages: Message[], extraUserText?: string): ApiMessage[] => {
    const history: ApiMessage[] = currentMessages
      .filter(m =>
        m.id !== 'welcome' &&
        !m.isError &&
        !m.isQueued &&
        m.content.trim().length > 0
      )
      .map(m => ({ role: m.role, content: m.content }))

    if (extraUserText) {
      history.push({ role: 'user', content: extraUserText })
    }
    return history
  }

  // ── Start visual cooldown countdown ─────────────────────────────────────
  // This is purely UI feedback. It does NOT trigger auto-retry.
  // After the countdown the user can manually send again — no invisible retries.
  const startCooldown = useCallback((waitMs: number) => {
    if (countdownTimer.current) clearInterval(countdownTimer.current)

    const waitSecs = Math.ceil(waitMs / 1000)
    setCooldownSecs(waitSecs)
    setRateLimited(true)

    countdownTimer.current = setInterval(() => {
      setCooldownSecs(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer.current!)
          setRateLimited(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ── Core request function ────────────────────────────────────────────────
  // assistantId: the message bubble to stream into (already added before calling)
  // apiHistory:  full history including the new user message
  // retryKey:    unique key to track retry attempts (same as assistantId on first try)
  const fireRequest = useCallback(async (
    assistantId: string,
    apiHistory:  ApiMessage[],
    retryKey:    string,
  ) => {
    setLoading(true)
    updateMessage(assistantId, { content: '', isQueued: false })

    try {
      abortRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: apiHistory }),
        signal:  abortRef.current.signal,
      })

      // ── 429: Rate limited ──────────────────────────────────────────────
      if (res.status === 429) {
        const body    = await res.json().catch(() => ({}))
        const waitMs  = ((body.retryAfter as number) ?? 15) * 1000
        const attempt = (retryCountRef.current[retryKey] ?? 0) + 1

        // Only auto-retry once — after that the user must manually resend
        if (attempt <= MAX_AUTO_RETRIES) {
          retryCountRef.current[retryKey] = attempt

          // Show a one-time queued indicator in the message bubble
          updateMessage(assistantId, {
            content:  '',
            isQueued: true,
          })
          setLoading(false)
          startCooldown(waitMs)

          // Schedule a single silent retry after the cooldown window
          const retryTimeout = setTimeout(() => {
            setRateLimited(false)
            setCooldownSecs(0)
            fireRequest(assistantId, apiHistory, retryKey)
          }, waitMs)

          // Store cleanup ref on abort
          abortRef.current.signal.addEventListener('abort', () => clearTimeout(retryTimeout))
          return
        }

        // Max retries reached — show a human message and let user decide
        updateMessage(assistantId, {
          content:  "I'm still quite busy right now. Please wait a moment and hit send again, or reach us directly on WhatsApp: +254 725 723 131.",
          isError:  true,
          isQueued: false,
        })
        setLoading(false)
        startCooldown(waitMs)
        return
      }

      // ── Other HTTP errors ──────────────────────────────────────────────
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${res.status})`)
      }

      // ── Stream the response ────────────────────────────────────────────
      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   full    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        updateMessage(assistantId, { content: full, isQueued: false })
      }

      // Clean up retry tracking for this message
      delete retryCountRef.current[retryKey]

      if (chatState !== 'open') setUnread(u => u + 1)

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return

      updateMessage(assistantId, {
        content: "Something went wrong on my end. Please try again or reach us on WhatsApp: +254 725 723 131.",
        isError: true,
      })
    } finally {
      setLoading(false)
    }
  }, [chatState, startCooldown])

  // ── Public send ──────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()

    // Guard: no empty messages, no sending while loading or in cooldown
    if (!trimmed || loading || rateLimited) return

    setInput('')

    // Add the user message to the UI immediately
    const userMsg: Message = {
      id:        mkId('user'),
      role:      'user',
      content:   trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])

    // Add an empty assistant placeholder for streaming
    const assistantId = mkId('assistant')
    setMessages(prev => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
    ])

    // Build history from current state + new user message
    // Use a functional snapshot via the setter to avoid stale closure
    setMessages(prev => {
      const apiHistory = buildApiHistory(prev.filter(m => m.id !== assistantId), trimmed)
      // Fire async — don't await inside the setState callback
      setTimeout(() => fireRequest(assistantId, apiHistory, assistantId), 0)
      return prev
    })
  }, [loading, rateLimited, fireRequest])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  // ── Input state ──────────────────────────────────────────────────────────
  const inputDisabled   = loading || rateLimited
  const inputPlaceholder = rateLimited
    ? `Ready again in ${cooldownSecs}s…`
    : loading
      ? 'Kali is typing…'
      : 'Type a message…'

  // ── Panel sizing ─────────────────────────────────────────────────────────
  const panelClasses = cn(
    'fixed inset-0 z-[60] flex flex-col',
    'sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[560px]',
    'lg:w-[420px] lg:h-[600px]',
    'xl:w-[440px] xl:h-[640px]',
  )

  return (
    <>
      {/* ── CHAT PANEL ──────────────────────────────────────────────────── */}
      {chatState === 'open' && (
        <div className={panelClasses}>
          <div className="flex flex-col flex-1 rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900 min-h-0">

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-blue-600 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-blue-600" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Kali
                  </p>
                  <p className="text-blue-100 text-[11px] leading-tight">
                    {rateLimited
                      ? `Ready in ${cooldownSecs}s…`
                      : 'Tuinuane AI · usually instant'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={collapse}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Minimise chat"
                  title="Minimise"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={close}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Close chat"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 bg-slate-50 dark:bg-slate-900 min-h-0">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  <div className={cn('max-w-[78%] flex flex-col gap-1', msg.role === 'user' && 'items-end')}>
                    <div
                      className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm font-medium'
                          : cn(
                              'bg-white dark:bg-slate-800 rounded-bl-sm border',
                              msg.isError
                                ? 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                : 'text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                            )
                      )}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {/* Typing indicator */}
                      {msg.role === 'assistant' && !msg.content && !msg.isQueued && (
                        <span className="flex items-center gap-2 text-slate-400">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span className="text-xs">Kali is typing…</span>
                        </span>
                      )}
                      {/* Queued indicator — shown during rate-limit wait */}
                      {msg.isQueued && (
                        <span className="flex items-center gap-2 text-slate-400">
                          <span className="flex gap-0.5">
                            {[0, 1, 2].map(i => (
                              <span
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                                style={{ animationDelay: `${i * 150}ms` }}
                              />
                            ))}
                          </span>
                          <span className="text-xs text-slate-400">
                            Queued — retrying in {cooldownSecs}s
                          </span>
                        </span>
                      )}
                      {/* Actual content */}
                      {msg.content && (
                        <span className="whitespace-pre-wrap">{msg.content}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts — only before first user message */}
            {messages.length <= 1 && (
              <div className="px-3 sm:px-4 pb-3 pt-2 flex flex-wrap gap-2 shrink-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition-colors active:scale-95"
                    style={{ fontFamily: 'Manrope, sans-serif' }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="px-3 sm:px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={inputPlaceholder}
                disabled={inputDisabled}
                className={cn(
                  'flex-1 text-sm rounded-full px-4 py-2.5 border border-transparent outline-none',
                  'focus:ring-2 focus:ring-blue-400/40 placeholder:text-slate-400 transition-all',
                  'text-slate-800 dark:text-slate-100',
                  rateLimited
                    ? 'bg-amber-50 dark:bg-amber-950/30 opacity-75'
                    : 'bg-slate-100 dark:bg-slate-800',
                  inputDisabled && 'cursor-not-allowed'
                )}
                style={{ fontFamily: 'Manrope, sans-serif' }}
                aria-label="Chat message"
              />

              {/* Collapse */}
              <button
                onClick={collapse}
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-90 transition-all"
                aria-label="Minimise chat"
                title="Minimise"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Send */}
              <button
                onClick={() => send(input)}
                disabled={inputDisabled || !input.trim()}
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                aria-label="Send"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Footer */}
            <div className="text-center py-1.5 text-[10px] text-slate-400 bg-white dark:bg-slate-900 shrink-0 border-t border-slate-100 dark:border-slate-800">
              Powered by Tuinuane AI · Your data is private
            </div>
          </div>
        </div>
      )}

      {/* ── MINIMISED BAR ───────────────────────────────────────────────── */}
      {chatState === 'minimised' && (
        <div className="fixed bottom-24 right-6 z-[60] flex items-center gap-2 shadow-xl">
          <button
            onClick={open}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-all duration-200"
            aria-label="Expand Kali chat"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              Chat with Kali
            </span>
            {unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[10px] font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center active:scale-90 transition-all shadow"
            aria-label="Close chat"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── TRIGGER BUTTON ──────────────────────────────────────────────── */}
      {chatState === 'closed' && (
        <button
          onClick={open}
          className="fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Open chat with Kali"
        >
          <MessageCircle className="w-6 h-6" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
              {unread}
            </span>
          )}
        </button>
      )}
    </>
  )
}
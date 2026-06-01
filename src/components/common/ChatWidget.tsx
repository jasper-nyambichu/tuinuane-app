// src/components/common/ChatWidget.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageCircle, X, Send, Loader2, Sparkles, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type ChatState = 'closed' | 'open' | 'minimised'

// Welcome message is UI-only — NEVER sent to the API as history
const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm Kali 👋 I'm Tuinuane Digitals' AI assistant. I can help you with our products, pricing, and getting a free proposal. What brings you here today?",
  timestamp: new Date(),
}

const QUICK_PROMPTS = [
  'What products do you offer?',
  'How much does a website cost?',
  'I need an e-commerce shop',
  'Get me a free proposal',
]

export default function ChatWidget() {
  const [state, setState]       = useState<ChatState>('closed')
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [unread, setUnread]     = useState(0)
  const [hasOpened, setHasOpened] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (state === 'open') {
      setTimeout(() => inputRef.current?.focus(), 120)
      setUnread(0)
    }
  }, [state])

  // Show unread badge after 45s if never opened
  useEffect(() => {
    if (hasOpened) return
    const t = setTimeout(() => setUnread(1), 45_000)
    return () => clearTimeout(t)
  }, [hasOpened])

  const open = () => {
    setState('open')
    setHasOpened(true)
    setUnread(0)
  }

  const close = () => {
    setState('closed')
    abortRef.current?.abort()
  }

  const collapse = () => setState('minimised')

  const addMessage = useCallback((msg: Omit<Message, 'id' | 'timestamp'>) => {
    const full: Message = { ...msg, id: `${msg.role}-${Date.now()}`, timestamp: new Date() }
    setMessages(prev => [...prev, full])
    return full.id
  }, [])

  // ── Rate-limit countdown state ───────────────────────────────────────────
  const [retryCountdown, setRetryCountdown] = useState<number>(0)
  const retryTimerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingRetryRef = useRef<{ text: string; apiHistory: { role: string; content: string }[] } | null>(null)

  const startCountdown = useCallback((seconds: number, text: string, apiHistory: { role: string; content: string }[]) => {
    pendingRetryRef.current = { text, apiHistory }
    setRetryCountdown(seconds)
    retryTimerRef.current = setInterval(() => {
      setRetryCountdown(prev => {
        if (prev <= 1) {
          clearInterval(retryTimerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // Auto-fire the retry when countdown reaches 0 and there's a pending message
  useEffect(() => {
    if (retryCountdown === 0 && pendingRetryRef.current) {
      const { text, apiHistory } = pendingRetryRef.current
      pendingRetryRef.current = null
      fireRequest(text, apiHistory)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCountdown])

  // Core fetch — separated so it can be called both fresh and on retry
  const fireRequest = useCallback(async (
    trimmed: string,
    apiHistory: { role: string; content: string }[],
    isRetry = false
  ) => {
    const assistantId = isRetry
      ? `assistant-retry-${Date.now()}`
      : `assistant-${Date.now()}`

    if (!isRetry) {
      setMessages(prev => [
        ...prev,
        { id: assistantId, role: 'assistant' as const, content: '', timestamp: new Date() },
      ])
    } else {
      // On retry, update the placeholder that was left with the countdown message
      setMessages(prev =>
        prev.map(m =>
          m.role === 'assistant' && m.content.startsWith('⏳')
            ? { ...m, id: assistantId, content: '' }
            : m
        )
      )
    }

    setLoading(true)

    try {
      abortRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: apiHistory }),
        signal:  abortRef.current.signal,
      })

      // ── Handle 429 rate limit ──────────────────────────────────────────
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}))
        const wait = (body.retryAfter as number) ?? 15

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: `⏳ I'm handling a few chats right now. Auto-retrying in ${wait}s…` }
              : m
          )
        )
        setLoading(false)
        startCountdown(wait, trimmed, apiHistory)
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Error ${res.status}`)
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: full } : m)
        )
      }

      if (state !== 'open') setUnread(u => u + 1)

    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? { ...m, content: `Sorry, something went wrong. You can also reach us on WhatsApp: +254 725 723 131.\n\n_${msg}_` }
            : m
        )
      )
    } finally {
      setLoading(false)
    }
  }, [state, startCountdown])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading || retryCountdown > 0) return

    setInput('')
    setLoading(true)
    addMessage({ role: 'user', content: trimmed })

    // Build API history — exclude static welcome message
    const apiHistory = messages
      .filter(m => m.id !== 'welcome' && m.content.trim() && !m.content.startsWith('⏳'))
      .map(m => ({ role: m.role, content: m.content }))
    apiHistory.push({ role: 'user', content: trimmed })

    setLoading(false) // fireRequest will set it back to true
    await fireRequest(trimmed, apiHistory)
  }, [loading, retryCountdown, messages, addMessage, fireRequest])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  // ─── Responsive panel sizing ────────────────────────────────────────────
  // Mobile  (<640px)  : full-screen overlay (inset-0 with padding)
  // Tablet  (sm–md)   : bottom-right anchored, 380px wide, 560px tall
  // Desktop (lg+)     : bottom-right anchored, 420px wide, 600px tall
  // XL+               : 440px wide, 640px tall
  const panelClasses = cn(
    // Base: full-screen on mobile
    'fixed inset-0 z-[60] flex flex-col',
    // sm: anchored bottom-right, fixed size — right-6 matches WhatsApp + trigger button
    'sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[560px]',
    // lg: slightly larger
    'lg:w-[420px] lg:h-[600px]',
    // xl: maximum comfortable size
    'xl:w-[440px] xl:h-[640px]',
  )

  return (
    <>
      {/* ── CHAT PANEL ────────────────────────────────────────────────────── */}
      {state === 'open' && (
        <div className={panelClasses}>
          <div className="flex flex-col flex-1 rounded-none sm:rounded-2xl overflow-hidden border-0 sm:border border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900 min-h-0">

            {/* ── Header ── */}
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
                    Tuinuane AI · usually instant
                  </p>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-1">
                {/* Collapse — visible on all sizes */}
                <button
                  onClick={collapse}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
                  aria-label="Minimise chat"
                  title="Minimise"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Close — visible on all sizes */}
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

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 bg-slate-50 dark:bg-slate-900 min-h-0">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
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
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700'
                      )}
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {msg.content || (
                        msg.role === 'assistant' && (
                          <span className="flex items-center gap-2 text-slate-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Kali is typing…</span>
                          </span>
                        )
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 px-1">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* ── Quick prompts — only before any user message ── */}
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

            {/* ── Input bar ── */}
            <div className="px-3 sm:px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={retryCountdown > 0 ? `Auto-retrying in ${retryCountdown}s…` : 'Type a message…'}
                disabled={loading || retryCountdown > 0}
                className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2.5 border border-transparent outline-none focus:ring-2 focus:ring-blue-400/40 placeholder:text-slate-400 disabled:opacity-50 transition-all text-slate-800 dark:text-slate-100"
                style={{ fontFamily: 'Manrope, sans-serif' }}
                aria-label="Chat message"
              />

              {/* ── Collapse button — sits beside send, always visible ── */}
              <button
                onClick={collapse}
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-90 transition-all"
                aria-label="Minimise chat"
                title="Minimise"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* ── Send button ── */}
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim() || retryCountdown > 0}
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md"
                aria-label="Send message"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Send className="w-4 h-4" />
                }
              </button>
            </div>

            {/* ── Footer ── */}
            <div className="text-center py-1.5 text-[10px] text-slate-400 bg-white dark:bg-slate-900 shrink-0 border-t border-slate-100 dark:border-slate-800">
              Powered by Tuinuane AI · Your data is private
            </div>
          </div>
        </div>
      )}

      {/* ── MINIMISED BAR ──────────────────────────────────────────────────── */}
      {/* Also sits above WhatsApp button */}
      {state === 'minimised' && (
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
          {/* Close from minimised state — no need to re-open first */}
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

      {/* ── TRIGGER BUTTON ─────────────────────────────────────────────────── */}
      {/* Sits above the WhatsApp button (bottom-6 right-6) — bottom-24 clears it */}
      {state === 'closed' && (
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
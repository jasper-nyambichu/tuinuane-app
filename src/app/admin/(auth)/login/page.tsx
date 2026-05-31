'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { createClient } from '../../../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[45fr_55fr]">
      {/* LEFT BRANDING */}
      <aside
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-center lg:p-16 text-white"
        style={{
          background: 'linear-gradient(135deg, oklch(0.42 0.13 250) 0%, oklch(0.28 0.13 255) 60%, oklch(0.18 0.08 260) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full opacity-70 blob"
          style={{ background: 'radial-gradient(circle at 30% 30%, oklch(0.7 0.14 245), transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[28rem] w-[28rem] rounded-full opacity-60 blob"
          style={{ background: 'radial-gradient(circle at 50% 50%, oklch(0.6 0.16 250), transparent 65%)', animationDelay: '1.5s' }} />
        <div className="relative max-w-md">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Tuinuane Admin
          </div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">
            Welcome<br />
            <span className="text-white/80">back.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/70">
            Manage leads, proposals, and conversations from one elegant dashboard built for the modern Tuinuane team.
          </p>
        </div>
      </aside>

      {/* RIGHT AUTH PANEL */}
      <section className="flex items-center justify-center bg-background px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <FieldWithIcon icon={Mail}>
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full bg-transparent pl-11 pr-4 text-sm outline-none"
              />
            </FieldWithIcon>

            <FieldWithIcon icon={Lock}>
              <input
                type={show ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full bg-transparent pl-11 pr-12 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </FieldWithIcon>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-foreground text-sm font-semibold text-background shadow-elegant transition-all hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

function FieldWithIcon({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <div className="relative rounded-xl border border-border bg-card transition-all focus-within:border-foreground/40">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {children}
    </div>
  )
}
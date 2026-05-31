'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Users, FileText, MessagesSquare,
  Settings, LogOut, Menu, X, Bell, Mail,
  Search, ChevronRight
} from 'lucide-react'
import { createClient } from '../../../lib/supabase'
import { ROUTES } from '../../../constants/routes'

const navGroups = [
  {
    label: 'MENU',
    items: [
      { label: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
      { label: 'Leads', href: ROUTES.ADMIN_LEADS, icon: Users, badge: null },
      { label: 'Proposals', href: ROUTES.ADMIN_PROPOSALS, icon: FileText },
      { label: 'Chats', href: ROUTES.ADMIN_CHATS, icon: MessagesSquare },
    ],
  },
  {
    label: 'GENERAL',
    items: [
      { label: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: Settings },
    ],
  },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="flex h-full w-[220px] flex-col bg-white border-r border-gray-100">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500">
          <span className="text-white font-bold text-sm">T</span>
        </div>
        <span className="font-bold text-gray-900 text-base tracking-tight">Tuinuane</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest px-2 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Upgrade Card */}
        <div className="rounded-2xl p-4 text-white mt-4"
          style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #10b981 100%)' }}>
          <div className="text-xs font-semibold mb-1">Enable AI Chatbot</div>
          <p className="text-[11px] leading-relaxed text-white/75 mb-3">
            Get AI-powered chat on your site to capture leads 24/7
          </p>
          <button className="w-full rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-white/90 transition-all">
            Coming Soon
          </button>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-3 py-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
        <div className="px-3 pt-1">
          <Link href="/" className="text-[11px] text-gray-400 hover:text-emerald-600 transition-colors">
            ← Back to Site
          </Link>
        </div>
      </div>
    </aside>
  )
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-100 bg-white px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search task"
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none transition-all focus:border-emerald-300 focus:bg-white placeholder:text-gray-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
            ⌘F
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Mail */}
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50">
          <Mail className="h-4 w-4" />
        </button>

        {/* Bell */}
        <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all hover:bg-gray-50">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-gray-100">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">TD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Tuinuane Admin</p>
            <p className="text-[11px] text-gray-400">hello@tuinuanedigitals.co.ke</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:flex shadow-sm">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-[220px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
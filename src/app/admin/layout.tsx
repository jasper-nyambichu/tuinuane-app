import Link from 'next/link'
import { ROUTES } from '../../constants/routes'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-background border-r border-border flex flex-col">
        <div className="px-6 py-5 border-b border-border">
          <span className="font-display font-bold text-lg">
            Tuinuane <span className="gradient-text">Admin</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {[
            { label: '📊 Dashboard', href: ROUTES.ADMIN_DASHBOARD },
            { label: '📥 Leads', href: ROUTES.ADMIN_LEADS },
            { label: '📄 Proposals', href: ROUTES.ADMIN_PROPOSALS },
            { label: '💬 Chats', href: ROUTES.ADMIN_CHATS },
            { label: '⚙️ Settings', href: ROUTES.ADMIN_SETTINGS },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
// src/components/layout/ConditionalLayout.tsx
'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '../common/WhatsAppButton'
import ChatWidget from '../common/ChatWidget'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') ?? false

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen relative">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </>
  )
}
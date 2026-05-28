import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '../components/layout/Providers'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppButton from '../components/common/WhatsAppButton'

export const metadata: Metadata = {
  title: 'Tuinuane Digitals — Digital Excellence for African Enterprises',
  description: 'Bespoke E-commerce, School Management & Healthcare Ecosystems engineered for growth.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-primary/10 selection:text-primary">
        <Providers>
          <Navbar />
          <main className="min-h-screen relative">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
   )
}

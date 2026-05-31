import type { Metadata } from 'next'
import './globals.css'
import Providers from '../components/layout/Providers'
import ConditionalLayout from '../components/layout/ConditionalLayout'

export const metadata: Metadata = {
  title: 'Tuinuane Digitals — Digital Solutions for Kenya',
  description: 'E-commerce, School Management & Healthcare Systems built for Kenya',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
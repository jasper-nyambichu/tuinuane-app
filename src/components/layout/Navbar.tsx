'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import { ROUTES } from '../../constants/routes'
import logo from '../../assets/logo.png'
import Image from 'next/image'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: ROUTES.SERVICES },
  { label: 'Portfolio', href: ROUTES.PORTFOLIO },
  { label: 'Pricing', href: ROUTES.PRICING },
  { label: 'Contact', href: ROUTES.CONTACT },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-4'
          : 'py-8'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`flex items-center justify-between px-6 h-16 md:h-20 rounded-full transition-all duration-500 ${
            scrolled 
              ? 'glass-premium border border-white/20 shadow-xl' 
              : 'bg-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl">
              <Image
                src={logo}
                alt="Tuinuane Digitals"
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                fill
              />
            </div>
            <span className="font-black text-xl tracking-tighter text-foreground">
              Tuinuane<span className="text-primary">Digitals</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[13px] font-bold uppercase tracking-widest transition-all duration-300 relative group
                  ${pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 h-12 bg-primary text-black hover:bg-primary/90 font-bold tracking-tight shadow-lg shadow-primary/10 transition-all active:scale-95"
            >
              <Link href={ROUTES.CONTACT} className="flex items-center gap-2">
                Let's Talk
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full glass-premium text-foreground active:scale-90 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-4 glass-premium rounded-[2rem] border border-white/20 shadow-2xl p-8 animate-fade-in overflow-hidden">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-6 border-t border-border/50">
              <Button asChild className="w-full rounded-full h-14 text-lg font-bold">
                <Link href={ROUTES.GET_QUOTE}>Get a Quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar

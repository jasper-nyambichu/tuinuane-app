'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={logo}
              alt="Tuinuane Digitals"
              className="h-9 w-9 object-contain"
              width={36}
              height={36}
            />
            <span className="font-display font-extrabold text-xl text-foreground">
              Tuinuane<span className="gradient-text">Digitals</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 relative
                  after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5
                  after:bg-primary after:scale-x-0 after:origin-right
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100 hover:after:origin-left
                  ${pathname === link.href
                    ? 'text-foreground after:scale-x-100'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              asChild
              size="sm"
              className="rounded-none px-6 h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
            >
              <Link href={ROUTES.CONTACT}>Contact</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground active:scale-95 transition-transform"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-medium text-foreground py-2"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="rounded-full mt-2 active:scale-95 transition-transform">
              <Link href={ROUTES.GET_QUOTE}>Get a Quote</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
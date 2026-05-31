'use client'

import { useState } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import SectionHeading from '../../components/common/SectionHeading'
import ScrollReveal from '../../components/common/ScrollReveal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Sparkles, ArrowRight, ShoppingCart, GraduationCap, Stethoscope, Globe, Wrench, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../lib/utils'

const PRODUCTS = [
  {
    value: 'ShopHub — E-commerce Website',
    label: 'ShopHub',
    tagline: 'E-commerce Website',
    description: 'Sell online with payments, inventory & delivery tracking.',
    icon: ShoppingCart,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    activeBorder: 'border-orange-500',
  },
  {
    value: 'EduManage — School Management',
    label: 'EduManage',
    tagline: 'School Management',
    description: 'Students, fees, exams & staff — all in one platform.',
    icon: GraduationCap,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    activeBorder: 'border-blue-500',
  },
  {
    value: 'ClinicCare — Medical Booking',
    label: 'ClinicCare',
    tagline: 'Medical Booking',
    description: 'Appointments, patient records & billing for clinics.',
    icon: Stethoscope,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    activeBorder: 'border-green-500',
  },
  {
    value: 'BizSite — Business Website',
    label: 'BizSite',
    tagline: 'Business Website',
    description: 'Professional website to showcase your brand & get leads.',
    icon: Globe,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    activeBorder: 'border-purple-500',
  },
  {
    value: 'Custom Solution',
    label: 'Custom Solution',
    tagline: 'Built for You',
    description: 'Have a unique idea? We build exactly what you need.',
    icon: Wrench,
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    activeBorder: 'border-rose-500',
  },
]

const GetQuote = () => {
  const [productInterest, setProductInterest] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!productInterest) {
      toast.error('Please select a product', { description: 'Choose the solution that best fits your business.' })
      return
    }

    setLoading(true)
    const form = e.target as HTMLFormElement
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      businessName: (form.elements.namedItem('businessName') as HTMLInputElement).value,
      productInterest,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      // ✅ FIX 3: Read the actual error message from the response
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `Server error ${res.status}`)
      }

      toast.success('Proposal request received!', {
        description: 'Check your email — we will be in touch within 24 hours.',
      })
      form.reset()
      setProductInterest('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[GetQuote] submit error:', message)
      toast.error('Submission failed', {
        description: message || 'Please try again or contact us directly.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="pt-32 pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <ScrollReveal>
            <SectionHeading
              eyebrow="AI-Powered Proposals"
              title="Get your free custom proposal."
              subtitle="Tell us about your business and our AI will generate a tailored proposal with scope, timeline, and pricing."
            />
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-background p-8">
              
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Your Name</label>
                  <Input name="name" placeholder="Full name" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                  <Input name="phone" placeholder="+254 7XX XXX XXX" type="tel" required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <Input name="email" placeholder="you@email.com" type="email" required />
              </div>

              {/* Business Name */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                <Input name="businessName" placeholder="e.g. Sunrise Academy" required />
              </div>

              {/* ✅ Improved Product Selector — Visual Cards */}
              <div>
                <label className="text-sm font-medium mb-3 block">
                  What are you looking for?
                  <span className="ml-1 text-muted-foreground font-normal">(choose one)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRODUCTS.map((product) => {
                    const Icon = product.icon
                    const isSelected = productInterest === product.value
                    return (
                      <button
                        key={product.value}
                        type="button"
                        onClick={() => setProductInterest(product.value)}
                        className={cn(
                          'relative text-left rounded-xl border-2 p-4 transition-all duration-200',
                          'hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          isSelected
                            ? `${product.bg} ${product.activeBorder} shadow-sm`
                            : `bg-background ${product.border} hover:${product.bg}`
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className={cn('absolute top-3 right-3 w-4 h-4', product.color)} />
                        )}
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', product.bg)}>
                          <Icon className={cn('w-4 h-4', product.color)} />
                        </div>
                        <p className="font-semibold text-sm leading-tight">{product.label}</p>
                        <p className={cn('text-xs font-medium mb-1', product.color)}>{product.tagline}</p>
                        <p className="text-xs text-muted-foreground leading-snug">{product.description}</p>
                      </button>
                    )
                  })}
                </div>
                {!productInterest && (
                  <p className="text-xs text-muted-foreground mt-2 ml-0.5">Select a product above to continue.</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Describe Your Project</label>
                <Textarea
                  name="description"
                  placeholder="Tell us what you need — the more detail, the better our AI proposal will be…"
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full active:scale-[0.97]"
                disabled={loading || !productInterest}
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 w-4 h-4 animate-pulse" />
                    Generating Proposal…
                  </>
                ) : (
                  <>
                    Generate My Proposal
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Free, no-commitment proposal delivered to your email.
              </p>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </PageWrapper>
  )
}

export default GetQuote
'use client'

import { useState } from 'react'
import PageWrapper from '../../components/layout/PageWrapper'
import SectionHeading from '../../components/common/SectionHeading'
import ScrollReveal from '../../components/common/ScrollReveal'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Sparkles, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

const GetQuote = () => {
  const [productInterest, setProductInterest] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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

      if (res.ok) {
        toast.success('Proposal request received!', {
          description: 'Check your email — we will be in touch within 24 hours.',
        })
        form.reset()
        setProductInterest('')
      } else {
        throw new Error('Failed')
      }
    } catch {
      toast.error('Submission failed', {
        description: 'Please try again or contact us directly.',
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
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-background p-8">
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

              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <Input name="email" placeholder="you@email.com" type="email" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                <Input name="businessName" placeholder="e.g. Sunrise Academy" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Product Interest</label>
                <Select required value={productInterest} onValueChange={setProductInterest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ShopHub — E-commerce Website">ShopHub — E-commerce Website</SelectItem>
                    <SelectItem value="EduManage — School Management">EduManage — School Management</SelectItem>
                    <SelectItem value="ClinicCare — Medical Booking">ClinicCare — Medical Booking</SelectItem>
                    <SelectItem value="BizSite — Business Website">BizSite — Business Website</SelectItem>
                    <SelectItem value="Custom Solution">Custom Solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Describe Your Project</label>
                <Textarea
                  name="description"
                  placeholder="Tell us what you need — the more detail, the better our AI proposal will be…"
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-full active:scale-[0.97]" disabled={loading}>
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
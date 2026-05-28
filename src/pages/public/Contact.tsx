'use client';
import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/common/SectionHeading";
import ScrollReveal from "@/components/common/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setLoading(true)
  const form = e.target as HTMLFormElement
  const body = {
    name: (form.elements.namedItem('name') as HTMLInputElement).value,
    phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    email: (form.elements.namedItem('email') as HTMLInputElement).value,
    message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
  }

  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  setLoading(false)
  if (res.ok) {
    toast({ title: 'Message sent!', description: "We'll get back to you within 24 hours." })
    form.reset()
  } else {
    toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' })
  }
}

  return (
    <PageWrapper>
      <section className="pt-32 pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Contact Us"
              title="Let's talk about your project."
              subtitle="Reach out and we'll respond within 24 hours."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <ScrollReveal className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-background p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <Input name="name" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone</label>
                    <Input name="phone" placeholder="+254 7XX XXX XXX" type="tel" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <Input name="email" placeholder="you@email.com" type="email" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <Textarea name="message" placeholder="Tell us about your project…" rows={5} required />
                </div>
                <Button type="submit" className="w-full rounded-full active:scale-[0.97]" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                  <Send className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal className="lg:col-span-2" delay={0.15}>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm mb-1">Where We Work</h4>
                    <p className="text-sm text-muted-foreground">Fully remote — serving clients worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm mb-1">Call Us</h4>
                    <a href="tel:+254700000000" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      +254 700 000 000
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm mb-1">Email Us</h4>
                    <a href="mailto:hello@tuinuanedigitals.co.ke" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      hello@tuinuanedigitals.co.ke
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Contact;

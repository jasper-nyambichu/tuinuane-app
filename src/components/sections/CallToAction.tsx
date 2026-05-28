'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import ScrollReveal from "@/components/common/ScrollReveal";

const CallToAction = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative rounded-[2rem] overflow-hidden px-8 py-20 md:px-16 md:py-28 text-center bg-foreground">
            <div className="absolute inset-0 gradient-mesh opacity-60" />
            <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-[hsl(280_90%_70%/0.25)] blur-3xl" />

            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="heading-display text-3xl md:text-5xl lg:text-6xl text-background leading-tight mb-5"
              >
                Ready to build something <span className="gradient-text">that works?</span>
              </motion.h2>
              <p className="text-background/70 text-base md:text-lg max-w-xl mx-auto mb-10">
                Get a custom proposal in 24 hours. No fluff. No hidden fees.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="rounded-full px-9 h-14 text-base gradient-primary text-primary-foreground shadow-glow">
                  <Link href={ROUTES.GET_QUOTE}>
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-9 h-14 text-base bg-transparent border-background/20 text-background hover:bg-background/10">
                  <Link href={ROUTES.CONTACT}>Book Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CallToAction;

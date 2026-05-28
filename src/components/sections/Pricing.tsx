'use client';
import  Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import { ROUTES } from "@/constants/routes";

const Pricing = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Transparent pricing. No surprises."
            subtitle="One-time setup + affordable monthly maintenance. All prices in Kenyan Shillings."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isFeatured = service.id === "shophub";
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <div
                  className={`relative h-full flex flex-col rounded-3xl p-7 transition-all duration-300 ${
                    isFeatured
                      ? "bg-foreground text-background border border-foreground shadow-premium"
                      : "bg-card border border-border hover:border-primary/30 hover:shadow-elegant"
                  }`}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Most Popular
                    </span>
                  )}

                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 ${isFeatured ? "bg-white/10" : "bg-primary/10"}`}>
                    <Icon className={`w-5 h-5 ${isFeatured ? "text-white" : "text-primary"}`} />
                  </div>
                  <h3 className={`font-display font-bold text-lg mb-0.5 ${isFeatured ? "text-background" : ""}`}>{service.title}</h3>
                  <p className={`text-xs mb-5 ${isFeatured ? "text-background/60" : "text-muted-foreground"}`}>{service.subtitle}</p>

                  <p className={`font-display font-bold text-3xl ${isFeatured ? "text-background" : ""}`}>{service.price}</p>
                  <p className={`text-xs mb-6 ${isFeatured ? "text-background/60" : "text-muted-foreground"}`}>+ {service.mrr} {service.mrrLabel}</p>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {service.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${isFeatured ? "text-background/85" : "text-muted-foreground"}`}>
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isFeatured ? "text-[hsl(var(--primary-glow))]" : "text-primary"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className={`w-full rounded-full font-semibold ${
                      isFeatured
                        ? "gradient-primary text-primary-foreground hover:opacity-95"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    }`}
                  >
                    <Link href={ROUTES.GET_QUOTE}>Get Started</Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

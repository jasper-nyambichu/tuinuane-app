'use client';
import { motion } from "framer-motion";
import  Link from "next/link";
import { ArrowRight } from "lucide-react";
import { marketingServices } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import { ROUTES } from "@/constants/routes";

const MarketingServices = () => {
  return (
    <section className="py-24 md:py-32 relative bg-[hsl(var(--tint-sky))]/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Grow Your Brand"
            title="Marketing & growth services."
            subtitle="Beyond building, we help you get found and chosen — social media, SEO, paid ads and brand identity."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {marketingServices.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-6 flex flex-col h-full hover:glow-primary transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.color.replace("hsl", "hsla").replace(")", " / 0.15)")}` }}
                >
                  <Icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{s.description}</p>
                <p className="text-sm font-semibold gradient-text mb-3">{s.price}</p>
                <Link
                  href={ROUTES.GET_QUOTE}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketingServices;

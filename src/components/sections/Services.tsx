'use client";'
import  Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { services } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import { ROUTES } from "@/constants/routes";

const Services = () => {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="What We Build"
            title="Productized software for every industry."
            subtitle="From clinics to classrooms to commerce — tailored digital systems built the way modern businesses actually operate."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5 max-w-6xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isLarge = i === 0;
            const span = isLarge ? "md:col-span-4" : "md:col-span-2";

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={span}
              >
                <div className="group relative bg-card border border-border rounded-3xl overflow-hidden h-full transition-all duration-500 hover:shadow-premium hover:-translate-y-1 hover:border-primary/30">
                  {/* glow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(600px circle at var(--mx,50%) var(--my,50%), hsl(var(--primary) / 0.08), transparent 40%)" }} />

                  <div className={`relative overflow-hidden ${isLarge ? "h-64 md:h-80" : "h-44"}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-semibold text-foreground">
                      {service.price}
                    </div>
                  </div>

                  <div className="p-6 md:p-7 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg leading-tight">{service.title}</h3>
                          <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {isLarge && (
                      <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Link
                      href={ROUTES.GET_QUOTE}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-3 transition-all"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

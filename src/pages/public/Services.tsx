'use client';
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/common/SectionHeading";
import ScrollReveal from "@/components/common/ScrollReveal";
import { services } from "@/constants/services";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

const ServicesPage = () => {
  return (
    <PageWrapper>
      <section className="pt-32 pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Our Products"
              title="Productized software solutions for every industry."
              subtitle="We build ready-to-deploy systems that solve real business problems — no fluff, just results."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.id} delay={i * 0.08}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40">
                    <div className="h-48 sm:h-56 overflow-hidden relative">
                      <img
                        src={service.image}
                        alt={`${service.title} - ${service.subtitle}`}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                        style={{ background: `${service.color.replace("hsl", "hsla").replace(")", " / 0.15)")}` }}
                      >
                        <Icon className="w-7 h-7" style={{ color: service.color }} />
                      </div>
                      <h3 className="font-display font-bold text-2xl mb-1">{service.title}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{service.subtitle}</p>
                      <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                      <ul className="space-y-2.5 mb-8 flex-1">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-display font-bold text-lg gradient-text">{service.price}</span>
                          <span className="text-xs text-muted-foreground ml-1">({service.priceLabel})</span>
                          <span className="block text-xs text-muted-foreground">+ {service.mrr} {service.mrrLabel}</span>
                        </div>
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link href={ROUTES.GET_QUOTE}>
                            Get Started <ArrowRight className="ml-1 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default ServicesPage;

'use client';
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeading from "@/components/common/SectionHeading";
import ScrollReveal from "@/components/common/ScrollReveal";
import { portfolioItems } from "@/constants/services";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

const PortfolioPage = () => {
  return (
    <PageWrapper>
      <section className="pt-32 pb-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeading
              eyebrow="Portfolio"
              title="Our work speaks for itself."
              subtitle="A selection of projects delivered for businesses in Kisii and across Kenya."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {portfolioItems.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08} className={i === 0 ? "sm:col-span-2" : ""}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/40">
                  <div className={`relative overflow-hidden ${i === 0 ? "h-56 sm:h-72" : "h-44 sm:h-48"}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge variant="secondary" className="mb-3">{item.category}</Badge>
                    <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>
    </PageWrapper>
  );
};

export default PortfolioPage;

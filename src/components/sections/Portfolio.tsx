'use client';
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { portfolioItems } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";

const Portfolio = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Our Work"
            title="Projects we're proud of."
            subtitle="Real solutions built for real businesses worldwide."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item, i) => {
            const isWide = i === 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={isWide ? "lg:col-span-2" : ""}
              >
                <div className="group relative rounded-2xl bg-card border border-border overflow-hidden h-full transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-1">
                  <div className={`relative overflow-hidden ${isWide ? "h-56 sm:h-64" : "h-44 sm:h-48"}`}>
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
                    <Badge variant="secondary" className="mb-3 text-xs bg-primary/10 text-primary border-primary/20">
                      {item.category}
                    </Badge>
                    <h3 className="font-display font-bold text-lg mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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

export default Portfolio;

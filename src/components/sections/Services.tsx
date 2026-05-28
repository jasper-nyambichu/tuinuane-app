'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import { ROUTES } from "@/constants/routes";

const Services = () => {
  return (
    <section id="services" className="relative py-32 md:py-48 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-3xl mb-32">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block"
            >
              Our Expertise
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              Productized software for every industry.
            </h2>
            <p className="text-xl text-muted-foreground/70 leading-relaxed">
              From clinics to classrooms to commerce—we build tailored digital systems that mirror how modern businesses actually operate.
            </p>
          </div>
        </ScrollReveal>

        {/* Sticky Stacking Cards Container */}
        <div className="flex flex-col gap-20 max-w-6xl mx-auto">
          {services.map((service, i) => {
            const Icon = service.icon;
            
            return (
              <div 
                key={service.id} 
                className="sticky-card"
                style={{ top: `${100 + i * 40}px` }} // Incremental offset for stacking effect
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="relative glass-premium rounded-[3rem] overflow-hidden border border-white/30 shadow-2xl transition-all duration-700 group-hover:shadow-primary/5">
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
                      {/* Image Section */}
                      <div className="md:col-span-5 relative overflow-hidden h-[300px] md:h-auto">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:to-transparent" />
                        <div className="absolute top-8 left-8 glass-premium px-4 py-2 rounded-full text-xs font-black tracking-tight z-20">
                          {service.price}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="md:col-span-7 p-8 md:p-16 bg-white/40 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                              <Icon className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-1">{service.title}</h3>
                              <span className="text-[11px] uppercase tracking-widest font-bold text-primary/60">{service.subtitle}</span>
                            </div>
                          </div>
                          <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                            <ArrowUpRight className="w-6 h-6 group-hover:text-white" />
                          </div>
                        </div>

                        <p className="text-lg text-muted-foreground/80 leading-relaxed mb-10">
                          {service.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-12 pt-8 border-t border-primary/10">
                          {service.features.map((f) => (
                            <div key={f} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-primary" />
                              </div>
                              {f}
                            </div>
                          ))}
                        </div>

                        <Link
                          href={ROUTES.GET_QUOTE}
                          className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-primary group-hover:gap-5 transition-all duration-300"
                        >
                          Explore Solution
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

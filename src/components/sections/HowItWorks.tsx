'use client';
import { motion } from "framer-motion";
import { processSteps } from "@/constants/services";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";

const HowItWorks = () => {
  return (
    <section id="about" className="py-24 md:py-32 relative bg-gradient-to-b from-background to-[hsl(214_100%_98%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow="How It Works"
            title="A clear, calm process from idea to launch."
            subtitle="We've streamlined delivery so you can focus on your business while we handle the engineering."
          />
        </ScrollReveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          <motion.div
            className="hidden md:block absolute top-8 left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 rounded-2xl bg-primary/15 blur-xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-border shadow-elegant flex items-center justify-center">
                  <span className="font-display font-bold text-xl gradient-text">0{step.step}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

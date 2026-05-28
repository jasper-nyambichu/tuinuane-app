'use client'
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import heroWoman from "@/assets/hero-woman.png";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden pt-32 pb-20">
      {/* Mesh background */}
      <div className="absolute inset-0 -z-10 gradient-mesh" />
      <div className="absolute inset-0 -z-10 grid-pattern opacity-[0.35]" />
      <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl blob -z-10" />
      <div className="absolute -bottom-32 -right-20 w-[480px] h-[480px] rounded-full bg-[hsl(280_90%_70%/0.08)] blur-3xl blob -z-10" style={{ animationDelay: "4s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-foreground/80 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Modern software solutions for African businesses
            </motion.div>

            <h1 className="heading-display text-[2.5rem] sm:text-5xl lg:text-[4.25rem] xl:text-[5rem] leading-[1.02]">
              {["Software", "that", "moves", "your"].map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-[0.22em]"
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="inline-block gradient-text"
              >
                business forward.
              </motion.span>
            </h1>

            <motion.p
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Tuinuane Digitals builds clinic & school systems, e-commerce platforms, custom
              software and growth marketing for ambitious teams across Africa.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Button asChild size="lg" className="rounded-full px-7 h-12 gradient-primary text-primary-foreground font-semibold shadow-premium hover:shadow-glow transition-all">
                
                <Link href={ROUTES.CONTACT}>
                  Book a Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12 border-foreground/15 bg-white/60 backdrop-blur hover:bg-white font-semibold">
                <Link href={ROUTES.PORTFOLIO}>View Projects</Link>
              </Button>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.9/5</span>
                <span>client rating</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div><span className="font-semibold text-foreground">120+</span> projects shipped</div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="hidden sm:block"><span className="font-semibold text-foreground">24h</span> proposal turnaround</div>
            </motion.div>
          </div>

          {/* Visual */}
          <motion.div
            className="order-1 lg:order-2 lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <div className="relative w-full max-w-[520px] mx-auto">
              <div className="absolute inset-0 rounded-[2.5rem] gradient-primary opacity-20 blur-3xl scale-95" />
              <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white to-[hsl(214_100%_98%)] border border-white shadow-premium">
                <Image
                  src={heroWoman}
                  alt="Tuinuane Digitals — modern software solutions"
                  className="w-full h-auto object-contain relative z-10"
                  loading="eager"
                  width={1024}
                  height={1024}
                />
              </div>

              {/* Floating stat card top-left */}
              <motion.div
                initial={{ opacity: 0, y: -10, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
                className="absolute top-6 -left-4 sm:-left-8 z-20 glass rounded-2xl px-4 py-3 flex items-center gap-3 floaty"
              >
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm leading-tight">+38%</p>
                  <p className="text-[11px] text-muted-foreground">avg. ROI uplift</p>
                </div>
              </motion.div>

              {/* Floating card bottom-right */}
              <motion.div
                initial={{ opacity: 0, y: 10, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                className="absolute bottom-8 -right-3 sm:-right-6 z-20 glass rounded-2xl px-4 py-3 floaty"
                style={{ animationDelay: "1.5s" }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <p className="text-[11px] text-muted-foreground">Live</p>
                </div>
                <p className="font-display font-bold text-sm leading-tight">120+ clients</p>
                <p className="text-[11px] text-muted-foreground">trust our work</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

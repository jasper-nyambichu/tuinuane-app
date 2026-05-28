'use client';
import PageWrapper from "@/components/layout/PageWrapper";
import Hero from "@/components/sections/Hero";
import TrustMarquee from "@/components/sections/TrustMarquee";
import Services from "@/components/sections/Services";
import MarketingServices from "@/components/sections/MarketingServices";
import HowItWorks from "@/components/sections/HowItWorks";
import Portfolio from "@/components/sections/Portfolio";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import CallToAction from "@/components/sections/CallToAction";

const Home = () => {
  return (
    <PageWrapper>
      <Hero />
      <TrustMarquee />
      <Services />
      <MarketingServices />
      <HowItWorks />
      <Portfolio />
      <Pricing />
      <Testimonials />
      <CallToAction />
    </PageWrapper>
  );
};

export default Home;

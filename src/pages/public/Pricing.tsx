'use client';
import PageWrapper from "@/components/layout/PageWrapper";
import PricingSection from "@/components/sections/Pricing";

const PricingPage = () => {
  return (
    <PageWrapper>
      <div className="pt-16">
        <PricingSection />
      </div>
    </PageWrapper>
  );
};

export default PricingPage;

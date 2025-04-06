import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

// Create a wrapper component for sections with the same animation delay
const AnimatedSection = ({ children }: { children: React.ReactNode }) => (
  <AnimateOnScroll delay={0.1}>
    {children}
  </AnimateOnScroll>
);

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 mx-auto">
        <AnimateOnScroll>
          <Hero />
        </AnimateOnScroll>
        <AnimatedSection>
          <Features />
        </AnimatedSection>
        <AnimatedSection>
          <HowItWorks />
        </AnimatedSection>
        <AnimatedSection>
          <Pricing />
        </AnimatedSection>
        <AnimatedSection>
          <Faq />
        </AnimatedSection>
        <AnimatedSection>
          <Cta />
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Faq from "@/components/landing/Faq";
import Cta from "@/components/landing/Cta";
import Footer from "@/components/landing/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 mx-auto">
        <AnimateOnScroll>
          <Hero />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <Features />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <HowItWorks />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <Pricing />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <Faq />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.1}>
          <Cta />
        </AnimateOnScroll>
      </main>
      <Footer />
    </div>
  );
}

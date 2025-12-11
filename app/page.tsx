"use client";
import Apply from "@/components/landing/Apply";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import RevolutionizeSection from "@/components/landing/RevolutionizeSection";
import AboutUs from "@/components/landing/AboutUs";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Page() {
  return (
    <>
      <Header />

      <main className="flex flex-col items-center space-y-6 no-scrollbar">
        <Hero />
        <AboutUs />
        <RevolutionizeSection />
        <Features />
        <Apply />
      </main>

      <Footer />
    </>
  );
}

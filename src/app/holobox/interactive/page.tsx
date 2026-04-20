"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, useMotionValue } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollDrivenHolobox from "./components/ScrollDrivenHolobox";
import WhatIsSection from "./sections/WhatIsSection";
import UseCasesSection from "./sections/UseCasesSection";
import HowItWorksSection from "./sections/HowItWorksSection";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ==========================================
// HERO SECTION
// ==========================================
function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Content */}
      <div className="text-center z-10 px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: PREMIUM_EASE }}
          className="text-xs uppercase tracking-[0.3em] mb-6"
          style={{ color: "#f96501" }}
        >
          Revolutionary Technology
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
          style={{ color: "#ffffff", letterSpacing: "-0.03em" }}
        >
          HOLOBOX
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
          className="text-lg md:text-xl"
          style={{ color: "#888", maxWidth: "400px", margin: "0 auto" }}
        >
          Life-size holographic presence
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: "#666" }}
          >
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8"
            style={{ background: "#f96501" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ==========================================
// SCROLL EXPERIENCE SECTION
// ==========================================
function ScrollExperienceSection({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section (0 to 1)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress for buttery animations
  const smoothProgress = useSpring(sectionProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Stage labels based on scroll progress
  const [currentStage, setCurrentStage] = useState("Idle");
  const [progressDebug, setProgressDebug] = useState(0);

  useEffect(() => {
    const unsubscribe = sectionProgress.on("change", (latest: number) => {
      setProgressDebug(latest);
      if (latest < 0.2) setCurrentStage("Idle");
      else if (latest < 0.4) setCurrentStage("Activation");
      else if (latest < 0.6) setCurrentStage("Energy Build");
      else if (latest < 0.8) setCurrentStage("Emergence");
      else setCurrentStage("Presence");
    });
    return () => unsubscribe();
  }, [sectionProgress]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "800vh", background: "#000000" }}
    >
      {/* Sticky container for the holobox */}
      <div className="sticky top-0 h-screen flex items-center justify-center w-full">
        {/* Stage indicator */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="px-4 py-2 rounded-full text-xs uppercase tracking-wider"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#888",
            }}
          >
            {currentStage} • {(Math.min(progressDebug, 1) * 100).toFixed(0)}%
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-48 w-px hidden md:block">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          />
          <motion.div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              background: "#f96501",
              height: "100%",
              scaleY: smoothProgress,
            }}
          />
        </div>

        {/* The Holobox */}
        <div className="w-full h-full flex items-center justify-center px-4">
          <ScrollDrivenHolobox
            scrollProgress={smoothProgress}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </div>

        {/* Stage labels on the side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6">
          {[
            { label: "Idle", range: "0-20%" },
            { label: "Activation", range: "20-40%" },
            { label: "Energy", range: "40-60%" },
            { label: "Emergence", range: "60-80%" },
            { label: "Presence", range: "80-100%" },
          ].map((stage, index) => {
            const isActive = stage.label === currentStage ||
              (currentStage === "Energy Build" && stage.label === "Energy") ||
              (currentStage === "Post-Presence" && stage.label === "Presence");
            return (
              <motion.div
                key={stage.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isActive ? 1 : 0.5, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={{
                    background: isActive ? "#f96501" : "rgba(255,255,255,0.3)",
                    scale: isActive ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                <span className={`text-xs ${isActive ? "text-white" : "text-white/50"}`}>
                  {stage.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CTA SECTION
// ==========================================
function CTASection() {
  return (
    <section className="py-24 relative" style={{ background: "#f96501", zIndex: 1 }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: "#ffffff" }}
          >
            Ready to Experience the Future?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: PREMIUM_EASE }}
            className="text-lg mb-8"
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
          >
            Schedule a private demonstration and see the Holobox in action.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
          >
            <a
              href="#contact"
              className="inline-block px-8 py-4 rounded-full text-sm uppercase tracking-wider font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: "#ffffff",
                color: "#f96501",
              }}
            >
              Book a Demo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function InteractiveHoloboxPage() {
  // Global mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Global scroll is managed by individual section scroll tracking

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -0.5 to 0.5 range (centered)
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <main style={{ background: "#000000" }}>
      <Navbar />

      {/* Hero - Introduction */}
      <HeroSection />

      {/* Scroll-driven experience - The core interaction */}
      <ScrollExperienceSection mouseX={mouseX} mouseY={mouseY} />

      {/* Information sections */}
      <WhatIsSection />
      <UseCasesSection />
      <HowItWorksSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

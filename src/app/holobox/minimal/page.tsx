"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// ==========================================
// HERO SECTION - Full screen, centered holobox
// ==========================================
function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden py-20"
      style={{ background: "#000000" }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />

      {/* Cinematic top gradient overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #000000 0%, transparent 100%)",
        }}
      />

      {/* Cinematic bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: "linear-gradient(0deg, #000000 0%, transparent 100%)",
        }}
      />

      {/* Subtle radial depth behind holobox */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249, 101, 1, 0.03) 0%, transparent 70%)",
        }}
      />

      {/* Holobox visual - centerpiece product */}
      <motion.div
        className="relative z-10 w-[320px] md:w-[440px] lg:w-[520px] aspect-[9/16] my-16"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: PREMIUM_EASE }}
      >
        {/* Frame */}
        <div className="absolute inset-0 rounded-lg border border-[rgba(249,101,1,0.25)] bg-[rgba(10,10,10,0.9)]">
          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-[rgba(249,101,1,0.35)]" />
          <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-[rgba(249,101,1,0.35)]" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-[rgba(249,101,1,0.35)]" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-[rgba(249,101,1,0.35)]" />

          {/* Video container */}
          <div className="absolute inset-3 rounded overflow-hidden flex items-center justify-center">
            <video
              src="/videos/presence.mp4"
              muted
              playsInline
              autoPlay
              loop
              className="w-full h-full object-contain opacity-90"
              style={{
                filter: "saturate(0.85) contrast(1.12) brightness(1.05)",
              }}
            />

            {/* Subtle bottom glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/4 pointer-events-none"
              style={{
                background: `linear-gradient(0deg, rgba(249, 101, 1, 0) 0%, rgba(249, 101, 1, 0.12) 100%)`,
              }}
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Very subtle idle breathing */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.004, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Text content */}
      <div className="relative z-10 text-center px-6">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: PREMIUM_EASE }}
          className="text-5xl md:text-6xl lg:text-8xl font-bold mb-4"
          style={{ color: "#ffffff", letterSpacing: "-0.03em" }}
        >
          HOLOBOX
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: PREMIUM_EASE }}
          className="text-lg md:text-xl tracking-wide"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          Real presence, anywhere.
        </motion.p>
      </div>
    </section>
  );
}

// ==========================================
// WHAT IS HOLOBOX - Centered text block
// ==========================================
function WhatIsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-40 md:py-56 flex items-center justify-center"
      style={{ background: "#000000" }}
    >
      <div className="max-w-2xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: PREMIUM_EASE }}
        >
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}
          >
            The first holographic communication system that feels like being in the same room.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// PRODUCT HIGHLIGHTS - Clean grid
// ==========================================
const highlights = [
  { label: "Size", value: "Life-size", desc: "True 1:1 holographic scale", featured: true },
  { label: "Latency", value: "<50ms", desc: "Real-time transmission", featured: false },
  { label: "Resolution", value: "4K HDR", desc: "Ultra-clear hologram", featured: false },
  { label: "Setup", value: "Instant", desc: "Ready in minutes", featured: false },
];

function HighlightsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-32 md:py-40"
      style={{ background: "#050505" }}
    >
      <div className="max-w-5xl mx-auto px-8">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: PREMIUM_EASE }}
          className="text-xs uppercase tracking-[0.2em] mb-12 text-center"
          style={{ color: "#f96501" }}
        >
          Specifications
        </motion.p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {highlights.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: PREMIUM_EASE,
              }}
              className={`text-center ${item.featured ? 'md:scale-110' : ''}`}
            >
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item.label}
              </p>
              <p
                className={`font-semibold mb-2 ${item.featured ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'}`}
                style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
              >
                {item.value}
              </p>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// USE CASES - Minimal cards
// ==========================================
const useCases = [
  {
    title: "Executive Meetings",
    desc: "Board rooms that feel present",
  },
  {
    title: "Remote Teams",
    desc: "Daily standups with real connection",
  },
  {
    title: "Client Presentations",
    desc: "Make an unforgettable impression",
  },
  {
    title: "Training & Events",
    desc: "Scale expertise across locations",
  },
];

function UseCasesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-32 md:py-40"
      style={{ background: "#000000" }}
    >
      <div className="max-w-5xl mx-auto px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: PREMIUM_EASE }}
          className="text-center mb-16"
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: "#f96501" }}
          >
            Use Cases
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold"
            style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
          >
            Built for business
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useCases.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: PREMIUM_EASE,
              }}
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-lg border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] cursor-pointer transition-all duration-300 hover:border-[rgba(255,255,255,0.15)]"
            >
              <h3
                className="text-lg font-medium mb-1"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// HOW IT WORKS - Simple vertical timeline
// ==========================================
const steps = [
  { number: "01", title: "Setup", desc: "Place the Holobox in your space" },
  { number: "02", title: "Connect", desc: "Link to your network" },
  { number: "03", title: "Invite", desc: "Send holographic meeting invites" },
  { number: "04", title: "Present", desc: "Experience life-size presence" },
];

function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-32 md:py-40"
      style={{ background: "#050505" }}
    >
      <div className="max-w-3xl mx-auto px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: PREMIUM_EASE }}
          className="text-center mb-16"
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ color: "#f96501" }}
          >
            How It Works
          </p>
          <h2
            className="text-3xl md:text-4xl font-semibold"
            style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
          >
            Simple setup, instant presence
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: PREMIUM_EASE,
              }}
              className="flex items-start gap-6"
            >
              {/* Number */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                style={{
                  background: "rgba(249, 101, 1, 0.1)",
                  color: "#f96501",
                  border: "1px solid rgba(249, 101, 1, 0.3)",
                }}
              >
                {step.number}
              </div>

              {/* Content */}
              <div className="pt-2">
                <h3
                  className="text-lg font-medium mb-1"
                  style={{ color: "#ffffff" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// CTA SECTION - Clean, minimal
// ==========================================
function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-32 md:py-40"
      style={{ background: "#000000" }}
    >
      <div className="max-w-2xl mx-auto px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: PREMIUM_EASE }}
        >
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4"
            style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
          >
            Experience what&apos;s next.
          </h2>
          <p
            className="text-base mb-10"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Join organizations redefining how teams connect.
          </p>

          <button
            className="px-10 py-4 rounded font-medium transition-all duration-300 hover:scale-105"
            style={{
              background: "#f96501",
              color: "#000000",
            }}
          >
            Request Access
          </button>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function MinimalHoloboxPage() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <HighlightsSection />
      <UseCasesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
}

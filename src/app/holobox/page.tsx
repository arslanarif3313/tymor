"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from "@/components/Footer";

// Premium easing - same as landing page
const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Video configuration
const VIDEOS = [
  { id: "entry", title: "Entry", description: "The journey begins" },
  { id: "activation", title: "Activation", description: "System powers up" },
  { id: "manifest", title: "Manifest", description: "Form takes shape" },
  { id: "presence", title: "Presence", description: "Life emerges" },
  { id: "stabilization", title: "Stabilization", description: "Connection locked" },
];

// ==========================================
// VIDEO STACK COMPONENT
// ==========================================
function VideoStack({ autoPlay = true, className = "" }: { autoPlay?: boolean; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleVideoEnded = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      currentVideo.play().catch(() => {});
    }
  }, [currentIndex, autoPlay]);

  return (
    <motion.div
      className={`position-relative w-100 h-100 ${className}`}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.98 }}
      transition={{ duration: 0.8, ease: PREMIUM_EASE }}
      style={{ willChange: "opacity, transform" }}
    >
      {VIDEOS.map((video, index) => {
        const isActive = index === currentIndex;
        const isPrevious = index === (currentIndex - 1 + VIDEOS.length) % VIDEOS.length;

        return (
          <video
            key={video.id}
            ref={(el) => { videoRefs.current[index] = el; }}
            src={`/videos/${video.id}.mp4`}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnded}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              objectFit: "cover",
              opacity: isActive ? 1 : isPrevious ? 0 : 0,
              transition: "opacity 500ms cubic-bezier(0.23, 1, 0.32, 1)",
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
          />
        );
      })}
    </motion.div>
  );
}

// ==========================================
// HOLOBOX FRAME COMPONENT
// ==========================================
function HoloboxFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="position-relative" style={{ aspectRatio: "9/16", maxWidth: "400px", width: "100%" }}>
      {/* Frame border only - no corner accents */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 0 8px #0a0a0a",
          zIndex: 10,
          borderRadius: "4px",
        }}
      />
      {children}
    </div>
  );
}

// ==========================================
// HERO SECTION
// ==========================================
function HeroSection() {
  return (
    <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center position-relative overflow-hidden" style={{ background: "#000000", paddingTop: "100px" }}>

      {/* Content */}
      <div className="container position-relative z-1">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: PREMIUM_EASE }}
              className="text-uppercase mb-3"
              style={{ fontSize: 12, letterSpacing: 4, color: "#f96501" }}
            >
              Revolutionary Technology
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
              className="display-3 fw-bold mb-4"
              style={{ color: "#ffffff", letterSpacing: -1 }}
            >
              The Holobox
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
              className="mx-auto"
              style={{ maxWidth: 500, fontSize: 18, color: "#aaaaaa", lineHeight: 1.6 }}
            >
              Life-size holographic presence. Real-time connection. Anywhere on Earth.
            </motion.p>
          </div>
        </div>

        {/* Holobox Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: PREMIUM_EASE }}
          className="d-flex justify-content-center"
        >
          <HoloboxFrame>
            <div className="w-100 h-100" style={{ background: "#000" }}>
              <VideoStack />
            </div>
          </HoloboxFrame>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="position-absolute bottom-0 start-50 translate-middle-x mb-4"
        >
          <div className="d-flex flex-column align-items-center gap-2">
            <span style={{ fontSize: 11, letterSpacing: 2, color: "#666", textTransform: "uppercase" }}>
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 1, height: 30, background: "#f96501" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ==========================================
// WHAT IS HOLOBOX SECTION
// ==========================================
function WhatIsSection() {
  return (
    <section className="py-5" style={{ background: "#ffffff" }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: PREMIUM_EASE }}
            >
              <span
                className="text-uppercase d-block mb-3"
                style={{ fontSize: 12, letterSpacing: 3, color: "#f96501" }}
              >
                What is Holobox
              </span>
              <h2 className="display-5 fw-bold mb-4" style={{ color: "#0f0f0f" }}>
                Presence Without Distance
              </h2>
              <p className="mb-4" style={{ fontSize: 18, color: "#555", lineHeight: 1.7 }}>
                The Holobox creates a life-size holographic window between two points in space. 
                Unlike video calls, you see the full person—gestures, posture, presence—exactly 
                as if they were standing on the other side of glass.
              </p>
              <p style={{ fontSize: 16, color: "#777", lineHeight: 1.6 }}>
                No headsets. No screens to hold. Just natural, human connection across any distance.
              </p>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: PREMIUM_EASE }}
              className="d-flex justify-content-center"
            >
              <div style={{ maxWidth: 280, width: "100%" }}>
                <HoloboxFrame>
                  <div className="w-100 h-100" style={{ background: "#000" }}>
                    <VideoStack />
                  </div>
                </HoloboxFrame>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// HOW IT WORKS SECTION
// ==========================================
function HowItWorksSection() {
  return (
    <section className="py-5" style={{ background: "#f8f8f8" }}>
      <div className="container">
        <div className="text-center mb-5">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="text-uppercase d-block mb-3"
            style={{ fontSize: 12, letterSpacing: 3, color: "#f96501" }}
          >
            The Experience
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: PREMIUM_EASE }}
            className="display-5 fw-bold"
            style={{ color: "#0f0f0f" }}
          >
            How It Works
          </motion.h2>
        </div>

        <div className="row g-4">
          {VIDEOS.map((video, index) => (
            <div key={video.id} className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: PREMIUM_EASE }}
                className="h-100"
              >
                <div
                  className="p-4 h-100"
                  style={{
                    background: "#ffffff",
                    borderRadius: 12,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Step number */}
                  <div
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "#f96501",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Mini video preview */}
                  <div className="mb-3" style={{ aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "#000" }}>
                    <video
                      src={`/videos/${video.id}.mp4`}
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <h5 className="fw-bold mb-2" style={{ color: "#0f0f0f" }}>
                    {video.title}
                  </h5>
                  <p className="mb-0" style={{ fontSize: 14, color: "#666" }}>
                    {video.description}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// USE CASES SECTION
// ==========================================
function UseCasesSection() {
  const useCases = [
    { title: "Executive Meetings", desc: "Board members present from different continents with true presence." },
    { title: "Healthcare Consultations", desc: "Doctors connect with patients as if in the same room." },
    { title: "Family Connections", desc: "Grandparents see grandchildren life-size, not on a small screen." },
    { title: "Performances & Events", desc: "Artists perform in multiple venues simultaneously." },
  ];

  return (
    <section className="py-5" style={{ background: "#0f0f0f" }}>
      <div className="container">
        <div className="text-center mb-5">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="text-uppercase d-block mb-3"
            style={{ fontSize: 12, letterSpacing: 3, color: "#f96501" }}
          >
            Applications
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: PREMIUM_EASE }}
            className="display-5 fw-bold"
            style={{ color: "#ffffff" }}
          >
            Use Cases
          </motion.h2>
        </div>

        <div className="row g-4">
          {useCases.map((useCase, index) => (
            <div key={useCase.title} className="col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: PREMIUM_EASE }}
                className="p-4 h-100"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h5 className="fw-bold mb-2" style={{ color: "#ffffff" }}>
                  {useCase.title}
                </h5>
                <p className="mb-0" style={{ fontSize: 15, color: "#aaa" }}>
                  {useCase.desc}
                </p>
              </motion.div>
            </div>
          ))}
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
    <section className="py-5" style={{ background: "#f96501" }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: PREMIUM_EASE }}
              className="display-5 fw-bold mb-4"
              style={{ color: "#ffffff" }}
            >
              Ready to Experience the Future?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: PREMIUM_EASE }}
              className="mb-4"
              style={{ fontSize: 18, color: "rgba(255,255,255,0.9)" }}
            >
              Schedule a private demonstration and see the Holobox in action.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
            >
              <Link
                href="#contact"
                className="nav-cta d-inline-block"
                style={{
                  background: "#ffffff",
                  color: "#f96501 !important",
                  padding: "14px 32px",
                  borderRadius: 50,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: 15,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Book a Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// FOOTER
// ==========================================
function SimpleFooter() {
  return (
    <footer className="py-4" style={{ background: "#0a0a0a" }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <Link href="/" className="text-decoration-none">
            <span className="fw-bold" style={{ color: "#fff", fontSize: 20, letterSpacing: 1 }}>
              TY<span style={{ color: "#f96501" }}>MOR</span>
            </span>
          </Link>
          <p className="mb-0" style={{ fontSize: 14, color: "#666" }}>
            2026 Tymor. All rights reserved.
          </p>
          <div className="d-flex gap-4">
            {["About", "Solutions", "Contact"].map((link) => (
              <Link
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-decoration-none"
                style={{ fontSize: 14, color: "#888", transition: "color 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f96501")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function HoloboxPage() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <HowItWorksSection />
      <UseCasesSection />
      <CTASection />
      {/* <SimpleFooter /> */}
      <Footer />
    </main>
  );
}

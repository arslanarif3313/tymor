"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CINEMATIC_EASE: [number, number, number, number] = [0.6, 0.01, 0.15, 0.99];

// ==========================================
// ENTRY SEQUENCE
// ==========================================
function EntrySequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => onComplete(), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "#000000" }}>
      {/* Phase 0: Pure darkness */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: CINEMATIC_EASE }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(249,101,1,0.8) 0%, transparent 70%)",
              filter: "blur(2px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Phase 2: Light expands */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 50, opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: CINEMATIC_EASE }}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(249,101,1,0.4) 0%, transparent 50%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// ATMOSPHERIC BACKGROUND
// ==========================================
function AtmosphericBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Deep gradient with ambient pulse */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 70%, rgba(249,101,1,0.04) 0%, transparent 50%)",
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Ambient glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(249,101,1,0.03) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

// ==========================================
// DISCOVERED HOLOBOX
// ==========================================
function DiscoveredHolobox() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 40, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-12, 12]), { stiffness: 40, damping: 30 });
  const glowIntensity = useSpring(useTransform(mouseY, [0, 1], [0.2, 0.6]), { stiffness: 30, damping: 20 });

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, rotateX: 45, z: -200 }}
      animate={{ opacity: 1, rotateX: 0, z: 0 }}
      transition={{ duration: 3, delay: 0.5, ease: CINEMATIC_EASE }}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="relative w-[340px] md:w-[420px] lg:w-[480px] aspect-[9/16] max-h-[70vh]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Outer glow - responds to mouse */}
        <motion.div
          className="absolute -inset-8 rounded-2xl pointer-events-none"
          style={{
            background: useTransform(
              glowIntensity,
              (v) => `radial-gradient(circle, rgba(249,101,1,${v * 0.3}) 0%, transparent 70%)`
            ),
            filter: "blur(40px)",
          }}
        />

        {/* Grounding shadow beneath holobox */}
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Frame with depth */}
        <div
          className="absolute inset-0 rounded-xl border bg-black/80 backdrop-blur-sm"
          style={{
            borderColor: "rgba(249,101,1,0.2)",
            boxShadow: "inset 0 0 60px rgba(249,101,1,0.1), 0 20px 60px rgba(0,0,0,0.8)",
          }}
        >
          {/* Inner chamber */}
          <div className="absolute inset-3 rounded-lg overflow-hidden">
            {/* Deep internal glow */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 pointer-events-none"
              style={{
                background: useTransform(
                  glowIntensity,
                  (v) => `radial-gradient(ellipse at 50% 100%, rgba(249,101,1,${v}) 0%, transparent 60%)`
                ),
              }}
            />

            {/* Video - hologram content */}
            <video
              src="/videos/presence.mp4"
              muted
              playsInline
              autoPlay
              loop
              className="w-full h-full object-contain"
              style={{
                filter: "saturate(0.8) contrast(0.95) brightness(0.9)",
              }}
            />
          </div>

          {/* Corner markers */}
          <div className="absolute top-5 left-5 w-4 h-4 border-l-2 border-t-2 border-orange-500/40" />
          <div className="absolute top-5 right-5 w-4 h-4 border-r-2 border-t-2 border-orange-500/40" />
          <div className="absolute bottom-5 left-5 w-4 h-4 border-l-2 border-b-2 border-orange-500/40" />
          <div className="absolute bottom-5 right-5 w-4 h-4 border-r-2 border-b-2 border-orange-500/40" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// FLOATING TEXT ELEMENTS
// ==========================================
const floatingTexts = [
  { text: "Presence", x: "8%", y: "30%", delay: 2.5 },
  { text: "Without distance", x: "72%", y: "35%", delay: 3 },
  { text: "Real size", x: "12%", y: "60%", delay: 3.5 },
  { text: "Real time", x: "78%", y: "65%", delay: 4 },
];

function FloatingText({ text, x, y, delay }: { text: string; x: string; y: string; delay: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      className="absolute pointer-events-none"
      style={{ left: x, top: y, opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay, ease: CINEMATIC_EASE }}
    >
      <motion.p
        className="text-lg md:text-xl font-light tracking-[0.2em] uppercase"
        style={{ color: "rgba(255,255,255,0.6)", y: yOffset }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}

// ==========================================
// SCROLL REVEAL CONTENT
// ==========================================
function ScrollRevealContent() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const holoboxY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const holoboxScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);
  const holoboxOpacity = useTransform(scrollYProgress, [0.2, 0.4], [1, 0.3]);

  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[180vh]">
      {/* Sticky holobox */}
      <div className="sticky top-0 h-screen flex items-center justify-center pt-20">
        <motion.div style={{ y: holoboxY, scale: holoboxScale, opacity: holoboxOpacity }}>
          <DiscoveredHolobox />
        </motion.div>

        {/* Floating texts */}
        {floatingTexts.map((item) => (
          <FloatingText key={item.text} {...item} />
        ))}
      </div>

      {/* Revealed content section */}
      <motion.div
        className="relative h-[80vh] flex items-center justify-center px-8"
        style={{ opacity: contentOpacity }}
      >
        {/* Decorative side lines */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />

        <div className="max-w-4xl text-center">
          {/* Eyebrow */}
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-8"
            style={{ color: "rgba(249,101,1,0.7)" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The Future
          </motion.p>

          {/* Main quote */}
          <p
            className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight"
            style={{ color: "rgba(255,255,255,0.95)", letterSpacing: "-0.02em" }}
          >
            The future of human connection isn&apos;t virtual reality.
          </p>

          {/* Divider */}
          <motion.div
            className="my-10 h-px w-24 mx-auto"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />

          {/* Subtext */}
          <motion.p
            className="text-xl md:text-2xl font-light"
            style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}
          >
            It&apos;s real presence, without the distance.
          </motion.p>

          {/* Decorative stat row */}
          <motion.div
            className="mt-16 flex justify-center gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-light" style={{ color: "#ffffff" }}>4K</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Resolution</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-light" style={{ color: "#ffffff" }}>&lt;50ms</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Latency</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-light" style={{ color: "#ffffff" }}>1:1</p>
              <p className="text-xs uppercase tracking-wider mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Scale</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// FINAL MOMENT
// ==========================================
function FinalMoment() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative min-h-[80vh] flex flex-col items-center justify-center px-8 overflow-hidden py-20">
      {/* Background glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249,101,1,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2, ease: CINEMATIC_EASE }}
      />

      <AnimatePresence>
        {isInView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: CINEMATIC_EASE }}
            className="text-center relative z-10"
          >
            {/* Top decorative line */}
            <motion.div
              className="mb-12 h-px mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "60px" }}
              transition={{ duration: 1, delay: 0.2, ease: CINEMATIC_EASE }}
              style={{ background: "rgba(255,255,255,0.2)" }}
            />

            {/* Emotional line */}
            <motion.p
              className="text-lg md:text-xl font-light tracking-[0.4em] uppercase mb-6"
              style={{ color: "rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: CINEMATIC_EASE }}
            >
              Presence is here
            </motion.p>

            {/* Logo */}
            <motion.p
              className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter"
              style={{ color: "#ffffff", letterSpacing: "-0.04em" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.8, delay: 0.9, ease: CINEMATIC_EASE }}
            >
              HOLOBOX
            </motion.p>

            {/* Bottom accent line */}
            <motion.div
              className="mt-10 flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="h-px w-12" style={{ background: "rgba(249,101,1,0.4)" }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(249,101,1,0.6)" }} />
              <div className="h-px w-12" style={{ background: "rgba(249,101,1,0.4)" }} />
            </motion.div>

            {/* Subtle tagline */}
            <motion.p
              className="mt-8 text-sm tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.3)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
            >
              Experience the difference
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function ExperimentalHoloboxPage() {
  const [entryComplete, setEntryComplete] = useState(false);

  return (
    <main className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Entry sequence */}
      {!entryComplete && <EntrySequence onComplete={() => setEntryComplete(true)} />}

      {/* Atmospheric background */}
      <AtmosphericBackground />

      {/* Navbar */}
      <Navbar />

      {/* Experience content */}
      <AnimatePresence>
        {entryComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <ScrollRevealContent />
            <FinalMoment />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </main>
  );
}

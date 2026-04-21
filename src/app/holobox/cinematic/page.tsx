"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CINEMATIC_EASE: [number, number, number, number] = [0.6, 0.01, 0.15, 0.99];

// Pre-calculated particle positions (avoid Math.random in render)
const PARTICLE_POSITIONS = [
  { left: 35, top: 75 },
  { left: 62, top: 82 },
  { left: 28, top: 68 },
  { left: 71, top: 79 },
  { left: 45, top: 85 },
  { left: 58, top: 72 },
  { left: 22, top: 77 },
  { left: 78, top: 83 },
];

function ParticleField() {
  return (
    <>
      {PARTICLE_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-orange-500/40"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.8, 0], y: -30 }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: 1,
          }}
        />
      ))}
    </>
  );
}

// ==========================================
// CINEMATIC SEQUENCE — THE REVEAL
// ==========================================
export default function CinematicHoloboxPage() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progress = useRef(0);
  const showReplay = phase >= 5;

  const phases = [
    { id: 0, name: "Entry", duration: 3000 },
    { id: 1, name: "Activation", duration: 5000 },
    { id: 2, name: "Formation", duration: 7000 },
    { id: 3, name: "Presence", duration: 7000 },
    { id: 4, name: "Resolution", duration: 8000 },
  ];

  useEffect(() => {
    if (!isPlaying || phase >= phases.length) {
      return;
    }

    const timer = setTimeout(() => {
      setPhase((p) => p + 1);
      progress.current = ((phase + 1) / phases.length) * 100;
    }, phases[phase].duration);

    return () => clearTimeout(timer);
  }, [phase, isPlaying, phases]);

  const handleReplay = () => {
    setPhase(0);
    setIsPlaying(true);
    progress.current = 0;
  };

  const handlePause = () => setIsPlaying(!isPlaying);

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {/* Cinematic Stage */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background:
                phase === 0
                  ? "radial-gradient(circle at 50% 50%, rgba(249,101,1,0.02) 0%, transparent 50%)"
                  : phase === 1
                  ? "radial-gradient(circle at 50% 50%, rgba(249,101,1,0.08) 0%, transparent 60%)"
                  : phase === 2
                  ? "radial-gradient(circle at 50% 50%, rgba(249,101,1,0.12) 0%, transparent 70%)"
                  : "radial-gradient(circle at 50% 50%, rgba(249,101,1,0.15) 0%, transparent 80%)",
            }}
            transition={{ duration: 2, ease: CINEMATIC_EASE }}
          />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* The Holobox Experience */}
        <div className="relative z-10" style={{ perspective: "1200px" }}>
          <AnimatePresence mode="wait">
            {/* PHASE 0: ENTRY — Absolute darkness, breathing glow */}
            {phase === 0 && (
              <motion.div
                key="entry"
                className="w-[300px] h-[300px] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "rgba(249,101,1,0.3)" }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            )}

            {/* PHASE 1: ACTIVATION — Frame materializes */}
            {phase === 1 && (
              <motion.div
                key="activation"
                className="relative w-[360px] md:w-[420px] aspect-[9/16]"
                initial={{ opacity: 0, rotateX: 25 }}
                animate={{ opacity: 1, rotateX: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: CINEMATIC_EASE }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Frame */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: "rgba(249,101,1,0.2)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                {/* Inner glow */}
                <motion.div
                  className="absolute inset-3 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(249,101,1,0.05) 0%, transparent 50%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.2, 0.4, 0.3] }}
                  transition={{ duration: 4, times: [0, 0.3, 0.5, 0.7, 1] }}
                />

                {/* Corner accents */}
                {[
                  "top-0 left-0 border-l-2 border-t-2",
                  "top-0 right-0 border-r-2 border-t-2",
                  "bottom-0 left-0 border-l-2 border-b-2",
                  "bottom-0 right-0 border-r-2 border-b-2",
                ].map((classes, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-6 h-6 ${classes}`}
                    style={{ borderColor: "rgba(249,101,1,0.4)" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
                  />
                ))}
              </motion.div>
            )}

            {/* PHASE 2: FORMATION — Hologram emerges */}
            {phase === 2 && (
              <motion.div
                key="formation"
                className="relative w-[360px] md:w-[420px] aspect-[9/16]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Frame */}
                <div
                  className="absolute inset-0 rounded-xl border-2"
                  style={{ borderColor: "rgba(249,101,1,0.3)" }}
                />

                {/* Inner chamber */}
                <div
                  className="absolute inset-3 rounded-lg overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.8)" }}
                >
                  {/* Emergence glow */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-3/4"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 100%, rgba(249,101,1,0.3) 0%, transparent 60%)",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0.4, 0.7, 0.5] }}
                    transition={{ duration: 5, times: [0, 0.2, 0.4, 0.7, 1] }}
                  />

                  {/* Hologram (blurred, emerging) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                    animate={{ opacity: 0.6, filter: "blur(8px)", scale: 0.95 }}
                    transition={{ duration: 4, ease: CINEMATIC_EASE }}
                  >
                    <video
                      src="/videos/presence.mp4"
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                      style={{
                        filter: "saturate(0.7) brightness(0.7)",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Particle hints */}
                <ParticleField />
              </motion.div>
            )}

            {/* PHASE 3: PRESENCE — Full clarity, eye contact moment */}
            {phase === 3 && (
              <motion.div
                key="presence"
                className="relative w-[360px] md:w-[420px] aspect-[9/16]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Frame with glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: "2px solid rgba(249,101,1,0.4)",
                    boxShadow: "0 0 40px rgba(249,101,1,0.15)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 40px rgba(249,101,1,0.15)",
                      "0 0 60px rgba(249,101,1,0.25)", // Eye contact brightness bump
                      "0 0 40px rgba(249,101,1,0.15)",
                    ],
                  }}
                  transition={{ duration: 4, times: [0, 0.5, 1] }}
                />

                {/* Inner chamber */}
                <div
                  className="absolute inset-3 rounded-lg overflow-hidden"
                  style={{ background: "rgba(0,0,0,0.9)" }}
                >
                  {/* Sustained glow */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-2/3 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 100%, rgba(249,101,1,0.25) 0%, transparent 60%)",
                    }}
                  />

                  {/* Clear hologram */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 2, ease: CINEMATIC_EASE }}
                  >
                    <video
                      src="/videos/presence.mp4"
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                      style={{
                        filter: "saturate(0.8) brightness(0.85)",
                      }}
                    />
                  </motion.div>
                </div>

                {/* Corner accents — brighter */}
                {[
                  "top-0 left-0 border-l-2 border-t-2",
                  "top-0 right-0 border-r-2 border-t-2",
                  "bottom-0 left-0 border-l-2 border-b-2",
                  "bottom-0 right-0 border-r-2 border-b-2",
                ].map((classes, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-6 h-6 ${classes}`}
                    style={{ borderColor: "rgba(249,101,1,0.6)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}

                {/* Eye contact indicator — subtle flash */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-xl"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.1) 0%, transparent 40%)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, delay: 2.5 }}
                />
              </motion.div>
            )}

            {/* PHASE 4: RESOLUTION — Text appears, everything settles */}
            {phase === 4 && (
              <motion.div
                key="resolution"
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                {/* Final Holobox state — dimmed */}
                <motion.div
                  className="relative w-[320px] md:w-[380px] aspect-[9/16] mx-auto mb-12 opacity-60"
                  initial={{ scale: 1 }}
                  animate={{ scale: 0.95 }}
                  transition={{ duration: 3, ease: CINEMATIC_EASE }}
                >
                  <div
                    className="absolute inset-0 rounded-xl border"
                    style={{ borderColor: "rgba(249,101,1,0.2)" }}
                  />
                  <div
                    className="absolute inset-3 rounded-lg overflow-hidden"
                    style={{ background: "rgba(0,0,0,0.9)" }}
                  >
                    <video
                      src="/videos/presence.mp4"
                      muted
                      playsInline
                      autoPlay
                      loop
                      className="w-full h-full object-contain opacity-50"
                      style={{ filter: "saturate(0.6) brightness(0.6)" }}
                    />
                  </div>
                </motion.div>

                {/* The Line */}
                <motion.p
                  className="text-2xl md:text-4xl font-light tracking-tight mb-6"
                  style={{ color: "rgba(255,255,255,0.9)" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: CINEMATIC_EASE }}
                >
                  Real presence, without the distance.
                </motion.p>

                {/* Brand */}
                <motion.p
                  className="text-lg tracking-[0.3em] uppercase"
                  style={{ color: "rgba(249,101,1,0.7)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                >
                  HOLOBOX
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phase indicator — subtle */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {phases.map((p, i) => (
            <motion.div
              key={p.id}
              className="h-0.5 rounded-full"
              style={{
                width: phase === i ? 24 : 8,
                background:
                  phase >= i ? "rgba(249,101,1,0.5)" : "rgba(255,255,255,0.1)",
              }}
              animate={{ width: phase === i ? 24 : 8 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Playback controls */}
        <div className="absolute bottom-8 right-8 flex items-center gap-4">
          <button
            onClick={handlePause}
            className="text-xs uppercase tracking-wider px-3 py-1 rounded border border-white/20 text-white/50 hover:text-white/80 hover:border-white/40 transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Replay overlay */}
        <AnimatePresence>
          {showReplay && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={handleReplay}
                className="text-white/80 hover:text-white text-lg tracking-wider uppercase px-8 py-4 border border-white/30 rounded-lg hover:border-white/60 transition-all"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                Watch Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}

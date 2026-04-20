"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";

// ==========================================
// TYPES
// ==========================================
type ScrollDrivenHoloboxProps = {
  scrollProgress: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Maps scroll progress to stage progress (0-1 for each stage)
 */
function useStageProgress(
  scrollProgress: MotionValue<number>,
  start: number,
  end: number
): MotionValue<number> {
  return useTransform(scrollProgress, [start, end], [0, 1], {
    clamp: true,
  });
}

// ==========================================
// POST-PRESENCE LIGHT RAYS
// ==========================================
function PostPresenceRays({ progress }: { progress: MotionValue<number> }) {
  const rayCount = 6;
  const rays = Array.from({ length: rayCount }, (_, i) => ({
    id: i,
    angle: (i * 360) / rayCount,
    delay: i * 0.1,
  }));

  const opacity = useTransform(progress, [0, 0.5], [0, 0.6]);
  const scale = useTransform(progress, [0, 1], [0.5, 1.2]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity, scale }}
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-1/2 left-1/2 w-px h-32 origin-top"
          style={{
            background: `linear-gradient(180deg,
              rgba(249, 101, 1, 0.8) 0%,
              rgba(249, 101, 1, 0) 100%)`,
            transform: `rotate(${ray.angle}deg) translateX(-50%)`,
            transformOrigin: "top center",
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleY: [1, 1.3, 1],
          }}
          transition={{
            duration: 2 + ray.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: ray.delay,
          }}
        />
      ))}
    </motion.div>
  );
}

// ==========================================
// HOLOGRAM COMPONENT with IMAGES
// ==========================================
function Hologram({
  emergenceProgress,
  presenceProgress,
  postPresenceProgress,
}: {
  emergenceProgress: MotionValue<number>;
  presenceProgress: MotionValue<number>;
  postPresenceProgress: MotionValue<number>;
}) {
  // Spring for overall hologram appearance
  const springOpacity = useSpring(
    useTransform(emergenceProgress, [0, 0.3], [0, 1]),
    { stiffness: 40, damping: 20 }
  );

  const springScale = useSpring(
    useTransform(emergenceProgress, [0, 0.5], [0.9, 1]),
    { stiffness: 60, damping: 20 }
  );

  // Post-presence: float upward based on scroll
  const floatY = useTransform(postPresenceProgress, [0, 1], [0, -30]);

  // Image crossfade: HoloboxBlur (emergence) → MyPic (presence)
  // emergence 0-1 = blur image fades in
  // presence 0-1 = blur fades out, MyPic fades in
  const blurImageOpacity = useTransform(
    emergenceProgress,
    [0, 0.5, 0.8, 1],
    [0, 1, 1, 0]
  );

  const myPicOpacity = useTransform(
    presenceProgress,
    [0, 0.3, 0.6],
    [0, 0, 1]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: springOpacity,
        scale: springScale,
        y: floatY,
      }}
    >
      {/* Image container */}
      <div className="relative w-[70%] h-[75%]">
        {/* HoloboxBlur image - shown during emergence, fades out during presence */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: blurImageOpacity,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/interactive/HoloboxBlur.png"
              alt="Emerging hologram"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 30px rgba(249, 101, 1, 0.5))",
              }}
            />
            {/* Glow overlay for blur image */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(249, 101, 1, 0.2) 0%, transparent 70%)",
                mixBlendMode: "screen",
              }}
            />
          </div>
        </motion.div>

        {/* MyPic image - shown during presence */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: myPicOpacity,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/interactive/MyPic.png"
              alt="Hologram presence"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 40px rgba(249, 101, 1, 0.6))",
              }}
            />
            {/* Hologram scanline effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(249, 101, 1, 0.1) 2px,
                  rgba(249, 101, 1, 0.1) 4px
                )`,
                mixBlendMode: "overlay",
              }}
              animate={{
                backgroundPosition: ["0px 0px", "0px 10px"],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Glow pulse */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(249, 101, 1, 0.3) 0%, transparent 60%)",
                mixBlendMode: "screen",
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Scanline effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(249, 101, 1, 0.05) 3px,
              rgba(249, 101, 1, 0.05) 6px
            )`,
          }}
        />

        {/* Subtle flicker at emergence start */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0, 0.2, 0],
          }}
          transition={{
            duration: 0.5,
            delay: 0,
            repeat: 0,
          }}
          style={{
            background: "rgba(249, 101, 1, 0.3)",
          }}
        />
      </div>
    </motion.div>
  );
}

// ==========================================
// ENERGY PARTICLES
// ==========================================
function EnergyParticles({
  energyProgress,
}: {
  energyProgress: MotionValue<number>;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: 20 + ((i * 37) % 60), // Deterministic pseudo-random
        delay: ((i * 13) % 5) * 0.1, // 0.0 to 0.4
        duration: 2 + ((i * 7) % 20) * 0.1, // 2.0 to 3.9
      })),
    []
  );

  const opacity = useTransform(energyProgress, [0, 0.3, 0.8, 1], [0, 0.6, 0.8, 0]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-0.5 h-10 rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: "-40px",
            background: `linear-gradient(180deg,
              transparent 0%,
              rgba(249, 101, 1, 0.8) 50%,
              transparent 100%)`,
            filter: "blur(1px)",
          }}
          animate={{
            y: [-200, -400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  );
}

// ==========================================
// HOLOBOX FRAME
// ==========================================
function HoloboxFrame({
  idleProgress,
  activationProgress,
  energyProgress,
  emergenceProgress,
  presenceProgress,
  postPresenceProgress,
  mouseRotateX,
  mouseRotateY,
}: {
  idleProgress: MotionValue<number>;
  activationProgress: MotionValue<number>;
  energyProgress: MotionValue<number>;
  emergenceProgress: MotionValue<number>;
  presenceProgress: MotionValue<number>;
  postPresenceProgress: MotionValue<number>;
  mouseRotateX: MotionValue<number>;
  mouseRotateY: MotionValue<number>;
}) {
  // Compose all animation values
  const breathingScale = useTransform(
    idleProgress,
    [0, 1],
    [1, 1.005]
  );

  // ENERGY: Strong frame glow + inner chamber glow
  const energyFrameGlow = useTransform(
    energyProgress,
    [0, 1],
    [
      "0 0 20px rgba(249, 101, 1, 0.3)",
      "0 0 60px rgba(249, 101, 1, 0.8), inset 0 0 40px rgba(249, 101, 1, 0.3)",
    ]
  ) as MotionValue<string>;

  const energyInnerGlow = useTransform(
    energyProgress,
    [0, 1],
    [
      "0 0 0 rgba(249, 101, 1, 0)",
      "0 0 60px rgba(249, 101, 1, 0.4)",
    ]
  ) as MotionValue<string>;

  const energyBottomGlow = useTransform(
    energyProgress,
    [0, 1],
    [0.3, 0.9]
  );

  // Spring-smoothed mouse rotation
  const springRotateX = useSpring(mouseRotateX, { stiffness: 80, damping: 20 });
  const springRotateY = useSpring(mouseRotateY, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      className="relative w-full h-full"
      style={{
        scale: breathingScale,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Outer frame - ACTIVATION: subtle border pulse, ENERGY: strong glow */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: energyFrameGlow as unknown as string,
          border: "2px solid rgba(249, 101, 1, 0.4)",
          background: "rgba(10, 10, 10, 0.8)",
          backdropFilter: "blur(10px)",
          borderColor: useTransform(
            activationProgress,
            [0, 0.5, 1],
            [
              "rgba(249, 101, 1, 0.2)",
              "rgba(249, 101, 1, 0.5)",
              "rgba(249, 101, 1, 0.6)"
            ]
          ),
        }}
      />

      {/* Inner dark chamber - ENERGY: strong inner glow */}
      <div
        className="absolute inset-2 rounded overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
          boxShadow: energyInnerGlow as unknown as string,
        }}
      >
        {/* ACTIVATION: Subtle pulsing bottom glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: `linear-gradient(0deg,
              rgba(249, 101, 1, 0) 0%,
              rgba(249, 101, 1, 0.25) 100%)`,
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ENERGY: Intense bottom glow */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{
            background: `linear-gradient(0deg,
              rgba(249, 101, 1, 0) 0%,
              rgba(249, 101, 1, 0.3) 100%)`,
            opacity: energyBottomGlow,
          }}
        />

        {/* Energy particles */}
        <EnergyParticles energyProgress={energyProgress} />

        {/* Hologram */}
        <Hologram emergenceProgress={emergenceProgress} presenceProgress={presenceProgress} postPresenceProgress={postPresenceProgress} />

        {/* Post-presence light rays */}
        <PostPresenceRays progress={postPresenceProgress} />

        {/* Glass reflection overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg,
              rgba(255, 255, 255, 0.03) 0%,
              transparent 40%,
              transparent 60%,
              rgba(255, 255, 255, 0.02) 100%)`,
          }}
        />
      </div>

      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[rgba(249,101,1,0.5)]" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[rgba(249,101,1,0.5)]" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[rgba(249,101,1,0.5)]" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[rgba(249,101,1,0.5)]" />
    </motion.div>
  );
}

// ==========================================
// SCROLL DEBUG BAR
// ==========================================
function ScrollDebugBar({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const width = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);
  return (
    <div className="absolute bottom-1 left-2 right-2 h-1 bg-gray-800 rounded overflow-hidden z-50">
      <motion.div
        className="h-full bg-orange-500"
        style={{ width }}
      />
    </div>
  );
}

// ==========================================
// SCROLL DEBUG TEXT
// ==========================================
function ScrollDebugText({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollProgress.on("change", (latest: number) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollProgress]);

  return (
    <div className="absolute top-2 left-2 right-2 text-center z-50">
      <span className="text-[10px] text-orange-500 font-mono">
        {(progress * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ScrollDrivenHolobox({
  scrollProgress,
  mouseX,
  mouseY,
}: ScrollDrivenHoloboxProps) {
  // Stage progress values based on scroll (0-1 = main phases)
  const idleProgress = useStageProgress(scrollProgress, 0, 0.2);
  const activationProgress = useStageProgress(scrollProgress, 0.2, 0.4);
  const energyProgress = useStageProgress(scrollProgress, 0.4, 0.6);
  const emergenceProgress = useStageProgress(scrollProgress, 0.6, 0.8);
  const presenceProgress = useStageProgress(scrollProgress, 0.8, 1.0);
  // Post-presence: scroll beyond 1.0 triggers additional effects
  const postPresenceProgress = useStageProgress(scrollProgress, 1.0, 1.5);

  // Convert mouse position to rotation (max 2 degrees)
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center p-8"
      style={{
        aspectRatio: "9/16",
        maxWidth: "400px",
        maxHeight: "700px",
        margin: "0 auto",
      }}
    >
      <HoloboxFrame
        idleProgress={idleProgress}
        activationProgress={activationProgress}
        energyProgress={energyProgress}
        emergenceProgress={emergenceProgress}
        presenceProgress={presenceProgress}
        postPresenceProgress={postPresenceProgress}
        mouseRotateX={mouseRotateX}
        mouseRotateY={mouseRotateY}
      />
      <ScrollDebugBar scrollProgress={scrollProgress} />
      <ScrollDebugText scrollProgress={scrollProgress} />
    </div>
  );
}

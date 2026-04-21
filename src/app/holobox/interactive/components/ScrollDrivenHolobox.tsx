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
// POST-PRESENCE LIGHT RAYS - Energy release
// ==========================================
function PostPresenceRays({ progress }: { progress: MotionValue<number> }) {
  const rayCount = 6;
  const rays = Array.from({ length: rayCount }, (_, i) => ({
    id: i,
    angle: (i * 360) / rayCount,
    delay: i * 0.15,
  }));

  // Rays appear at 90-100% scroll
  const opacity = useSpring(
    useTransform(progress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]),
    { stiffness: 60, damping: 25 }
  );

  const scale = useSpring(
    useTransform(progress, [0, 0.5, 1], [0.8, 1.2, 1.3]),
    { stiffness: 60, damping: 25 }
  );

  const rotation = useSpring(
    useTransform(progress, [0, 1], [-2, 2]),
    { stiffness: 40, damping: 30 }
  );

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        scale,
        rotate: rotation,
        transformOrigin: "center center",
      }}
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          className="absolute top-1/2 left-1/2 w-px h-40 origin-bottom"
          style={{
            background: `linear-gradient(0deg,
              rgba(249, 101, 1, 0.9) 0%,
              rgba(249, 101, 1, 0.4) 50%,
              transparent 100%)`,
            transform: `rotate(${ray.angle}deg) translateY(-50%)`,
            transformOrigin: "bottom center",
            bottom: "50%",
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scaleY: [1, 1.4, 1],
          }}
          transition={{
            duration: 3 + ray.delay,
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
// HOLOGRAM COMPONENT - Materialization effect
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
  // Non-linear opacity curve for natural emergence [0, 0.2, 1]
  const hologramOpacity = useSpring(
    useTransform(emergenceProgress, [0, 0.3, 0.6], [0, 0.2, 1]),
    { stiffness: 60, damping: 25 }
  );

  // Materialization: starts back and deep, moves forward
  const depthZ = useSpring(
    useTransform(emergenceProgress, [0, 0.5], [-50, 0]),
    { stiffness: 60, damping: 25 }
  );

  // Vertical rise from bottom
  const riseY = useSpring(
    useTransform(emergenceProgress, [0, 0.5], [20, 0]),
    { stiffness: 60, damping: 25 }
  );

  // Scale with materialization feel
  const hologramScale = useSpring(
    useTransform(emergenceProgress, [0, 0.5], [0.92, 1]),
    { stiffness: 60, damping: 25 }
  );

  // Blur clears as hologram forms
  const hologramBlur = useSpring(
    useTransform(emergenceProgress, [0, 0.4], [8, 0]),
    { stiffness: 60, damping: 25 }
  );

  // IMPACT MOMENT: at ~65% scroll (emergence 0.25)
  const impactScale = useSpring(
    useTransform(emergenceProgress, [0, 0.25, 0.5], [1, 1.04, 1]),
    { stiffness: 80, damping: 15 }
  );

  const impactBrightness = useSpring(
    useTransform(emergenceProgress, [0, 0.25, 0.5], [1, 1.2, 1]),
    { stiffness: 80, damping: 15 }
  );

  const impactFlash = useSpring(
    useTransform(emergenceProgress, [0, 0.2, 0.35, 0.5], [0, 0.15, 0.08, 0]),
    { stiffness: 100, damping: 20 }
  );

  // Imperfect breathing - organic, non-uniform
  const breathingY = useTransform(postPresenceProgress, [0, 0.25, 0.5, 0.75, 1], [0, -1.5, -0.5, -2, 0]);
  const breathingScale = useTransform(postPresenceProgress, [0, 0.25, 0.5, 0.75, 1], [1, 1.005, 1.01, 1.006, 1]);

  // Image crossfade with refined timing
  const blurImageOpacity = useTransform(
    emergenceProgress,
    [0, 0.4, 0.7, 1],
    [0, 1, 0.8, 0]
  );

  const myPicOpacity = useTransform(
    presenceProgress,
    [0, 0.2, 0.5],
    [0, 0.3, 1]
  );

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        opacity: hologramOpacity,
        scale: hologramScale,
        y: riseY,
        z: depthZ,
        transformPerspective: 1000,
      }}
    >
      {/* Impact flash overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          opacity: impactFlash,
          background: "radial-gradient(circle at center, rgba(249, 101, 1, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Image container with impact scale */}
      <motion.div
        className="relative w-[70%] h-[75%]"
        style={{
          scale: impactScale,
          filter: useTransform(impactBrightness, (v) => `brightness(${v})`),
        }}
      >
        {/* HoloboxBlur - emergence phase with blur clearing */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: blurImageOpacity,
            filter: useTransform(hologramBlur, (v) => `blur(${v}px)`),
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/interactive/HoloboxBlur.png"
              alt="Emerging hologram"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 20px rgba(249, 101, 1, 0.4))",
              }}
            />
          </div>
        </motion.div>

        {/* MyPic - presence phase with imperfect breathing */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: myPicOpacity,
            y: breathingY,
            scale: breathingScale,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="/images/interactive/MyPic.png"
              alt="Hologram presence"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 30px rgba(249, 101, 1, 0.5))",
              }}
            />
            {/* Organic glow pulse - imperfect timing */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(249, 101, 1, 0.25) 0%, transparent 50%)",
              }}
              animate={{
                opacity: [0.3, 0.55, 0.35, 0.6, 0.3],
                scale: [1, 1.03, 1.01, 1.04, 1],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// ENERGY PARTICLES - Converging to center
// ==========================================
function EnergyParticles({
  energyProgress,
  emergenceProgress,
}: {
  energyProgress: MotionValue<number>;
  emergenceProgress: MotionValue<number>;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        // Start from edges, converge to center
        startX: 10 + ((i * 23) % 80), // 10-90% spread
        endX: 50, // converge to center (50%)
        delay: ((i * 13) % 5) * 0.1,
        duration: 2 + ((i * 7) % 20) * 0.1,
      })),
    []
  );

  // Particles peak at ~50%, fade during emergence
  const particleIntensity = useSpring(
    useTransform(energyProgress, [0, 0.5, 0.8, 1], [0, 1, 0.6, 0]),
    { stiffness: 60, damping: 25 }
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: particleIntensity }}
    >
      {particles.map((particle) => (
        <ConvergingParticle
          key={particle.id}
          particle={particle}
          energyProgress={energyProgress}
          emergenceProgress={emergenceProgress}
        />
      ))}
    </motion.div>
  );
}

// Individual particle that converges toward center
function ConvergingParticle({
  particle,
  energyProgress,
  emergenceProgress,
}: {
  particle: { id: number; startX: number; endX: number; delay: number; duration: number };
  energyProgress: MotionValue<number>;
  emergenceProgress: MotionValue<number>;
}) {
  // During 40-60%: particles converge to center and slow down
  const x = useTransform(
    energyProgress,
    [0.5, 1],
    [`${particle.startX}%`, "50%"]
  );

  // Fade out during emergence
  const opacity = useTransform(emergenceProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div
      className="absolute w-0.5 h-12 rounded-full"
      style={{
        x,
        bottom: "-40px",
        opacity,
        background: `linear-gradient(180deg,
          transparent 0%,
          rgba(249, 101, 1, 0.9) 50%,
          transparent 100%)`,
        filter: "blur(1px)",
        transformOrigin: "bottom center",
      }}
      animate={{
        y: [-100, -350],
        opacity: [0, 1, 0.5, 0],
      }}
      transition={{
        duration: particle.duration * 1.5,
        delay: particle.delay,
        repeat: Infinity,
        ease: [0.23, 1, 0.32, 1], // PREMIUM_EASE
      }}
    />
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
  scrollProgress,
  mouseRotateX,
  mouseRotateY,
}: {
  idleProgress: MotionValue<number>;
  activationProgress: MotionValue<number>;
  energyProgress: MotionValue<number>;
  emergenceProgress: MotionValue<number>;
  presenceProgress: MotionValue<number>;
  postPresenceProgress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  mouseRotateX: MotionValue<number>;
  mouseRotateY: MotionValue<number>;
}) {
  // Compose all animation values with spring smoothing
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

  // Brightness hierarchy across stages
  const stageBrightness = useSpring(
    useTransform(
      scrollProgress,
      [0, 0.2, 0.4, 0.6, 0.8, 1],
      [0.9, 1.0, 1.1, 1.2, 1.05, 1.0]
    ),
    { stiffness: 60, damping: 25 }
  );

  // Subtle camera depth based on scroll
  const cameraRotateX = useSpring(
    useTransform(scrollProgress, [0, 1], [1, -1]),
    { stiffness: 40, damping: 30 }
  );
  const cameraRotateY = useSpring(
    useTransform(scrollProgress, [0, 1], [-0.5, 0.5]),
    { stiffness: 40, damping: 30 }
  );

  // Spring-smoothed mouse rotation
  const springRotateX = useSpring(mouseRotateX, { stiffness: 80, damping: 20 });
  const springRotateY = useSpring(mouseRotateY, { stiffness: 80, damping: 20 });

  // Combine camera and mouse rotation
  const totalRotateX = useTransform(
    [cameraRotateX, springRotateX],
    ([cam, mouse]) => (cam as number) + (mouse as number)
  );
  const totalRotateY = useTransform(
    [cameraRotateY, springRotateY],
    ([cam, mouse]) => (cam as number) + (mouse as number)
  );

  // Internal light depth - radial gradient from bottom center
  const internalLightOpacity = useSpring(
    useTransform(energyProgress, [0, 0.5, 1], [0, 0.4, 0.2]),
    { stiffness: 60, damping: 25 }
  );

  return (
    <motion.div
      className="relative w-full h-full"
      style={{
        scale: breathingScale,
        rotateX: totalRotateX,
        rotateY: totalRotateY,
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
      <motion.div
        className="absolute inset-2 rounded overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)",
          boxShadow: energyInnerGlow as unknown as string,
          filter: useTransform(stageBrightness, (v) => `brightness(${v})`),
        }}
      >
        {/* Internal light depth - radial gradient from bottom center */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 100%, rgba(249, 101, 1, 0.5) 0%, transparent 60%)",
            opacity: internalLightOpacity,
          }}
        />

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

        {/* Energy particles - converge toward center */}
        <EnergyParticles energyProgress={energyProgress} emergenceProgress={emergenceProgress} />

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
      </motion.div>

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
        scrollProgress={scrollProgress}
        mouseRotateX={mouseRotateX}
        mouseRotateY={mouseRotateY}
      />
      <ScrollDebugBar scrollProgress={scrollProgress} />
      <ScrollDebugText scrollProgress={scrollProgress} />
    </div>
  );
}

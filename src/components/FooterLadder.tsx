"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionTemplate,
  animate,
} from "framer-motion";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";

const FooterLadderBall3D = dynamic(() => import("./FooterLadderBall3D"), {
  ssr: false,
  loading: () => (
    <div
      className="footer-ladder-ball-3d-fallback"
      style={{
        width: "var(--footer-ladder-ball, 118px)",
      }}
    />
  ),
});

const HoloboxHumanPresence = dynamic(() => import("./HoloboxHumanPresence"), {
  ssr: false,
  loading: () => (
    <div
      className="holobox-human-fallback"
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(250, 100, 0, 0.1)",
        height: "var(--footer-ladder-ball, 118px)",
      }}
      aria-hidden
    />
  ),
});

export type RailGeom = {
  y: number;
  xLeft: number;
  xRight: number;
};

export type PathGeom = {
  w: number;
  ballD: number;
  bringStart: { x: number; y: number };
  bringEnd: { x: number; y: number };
  holoboxStart: { x: number; y: number };
  holoboxEnd: { x: number; y: number };
  holoboxGap?: { x: number; y: number };
  lifeLand: { x: number; y: number };
};

export type CursorAnchor = { x: number; y: number };
type CubicBezier = [number, number, number, number];
type EasingDef = CubicBezier | "linear";
const gravityEase: CubicBezier = [0.33, 1, 0.68, 1];

function useBallLightProbe(
  stageRef: React.RefObject<HTMLElement | null>,
  trackerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const st = stageRef.current;
      const tr = trackerRef.current;
      if (st && tr) {
        const br = tr.getBoundingClientRect();
        const sr = st.getBoundingClientRect();
        const x =
          ((br.left + br.width / 2 - sr.left) / Math.max(sr.width, 1)) * 100;
        const y =
          ((br.top + br.height / 2 - sr.top) / Math.max(sr.height, 1)) * 100;
        st.style.setProperty("--ball-light-x", `${x}%`);
        st.style.setProperty("--ball-light-y", `${y}%`);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [stageRef, trackerRef]);
}

function FooterLadderLineWord({
  text,
  wordRef,
  lifeWordRef,
  emphasizeLastCharPx,
  emphasisCharRef,
  bringGRef,
  emphasizeBringGPx,
  progress,
  revealStops,
  dofStops,
  dofOutputs,
  wordIndex,
  activeWordIdx,
  isImpacted,
  impactThresholds,
}: {
  text: string;
  wordRef: (el: HTMLSpanElement | null) => void;
  lifeWordRef?: React.RefObject<HTMLSpanElement | null>;
  emphasizeLastCharPx?: number;
  emphasisCharRef?: React.RefObject<HTMLSpanElement | null>;
  bringGRef?: React.RefObject<HTMLSpanElement | null>;
  emphasizeBringGPx?: number;
  progress: MotionValue<number>;
  revealStops: [number, number, number, number];
  dofStops: [number, number, number, number];
  dofOutputs?: [string, string, string, string];
  wordIndex: number;
  activeWordIdx: number;
  isImpacted: boolean;
  impactThresholds: { start: number; peak: number; end: number };
}) {
  const reveal = useTransform(progress, revealStops, [0, 0, 1, 1]);
  const dofBlur = useTransform(
    progress,
    dofStops,
    dofOutputs ?? [
      "blur(5px)",
      "blur(4px)",
      "blur(0.5px)",
      "blur(0px)",
    ],
  );
  const filter = useMotionTemplate`${dofBlur}`;

  const isHoloboxGap = false; // Disabled: now renders as HOLOBOX without gap

  const getCharSquish = (charIndex: number, totalChars: number, p: number) => {
    const charProgress = charIndex / Math.max(totalChars - 1, 1);

    if (text === "BRING") {
      if (p >= 0.06 && p <= 0.30) {
        const ballPosOnWord = (p - 0.06) / 0.24;
        const dist = Math.abs(charProgress - ballPosOnWord);
        if (dist < 0.4) return 0.75 + dist * 0.625;
      }
      return 1;
    }

    if (text === "HOLOBOX" || isHoloboxGap) {
      if (p >= 0.35 && p <= 0.74) {
        const ballPosOnWord = (p - 0.35) / 0.39;
        const dist = Math.abs(charProgress - ballPosOnWord);
        if (dist < 0.4) return 0.78 + dist * 0.55;
      }
      return 1;
    }

    if (text === "TO LIFE") {
      if (p >= 0.70 && p <= 0.92) {
        const lifeStart = 3 / 6;
        const dist = Math.abs(charProgress - lifeStart);
        if (dist < 0.5) return 0.68 + dist * 0.64;
      }
      return 1;
    }

    return 1;
  };

  const charCount = isHoloboxGap ? 8 : text.length;
  const splitLife = text === "TO LIFE" && lifeWordRef;
  const splitBringG = text === "BRING" && bringGRef;
  const splitHoloboxGap = isHoloboxGap;
  const emphPx = emphasizeLastCharPx ?? 0;
  const gPx = emphasizeBringGPx ?? 0;
  const splitEmph =
    !splitLife && emphPx > 0 && text.length >= 2
      ? {
          head: text.slice(0, -1),
          last: text.slice(-1),
        }
      : null;

  const renderChars = (wordText: string, isPaint: boolean) => {
    if (splitHoloboxGap) {
      return wordText.split("").map((char, i) => {
        const squish = getCharSquish(i, charCount, progress.get());
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={{
              transform: `scaleY(${squish})`,
              transformOrigin: "center center",
            }}
          >
            {char}
          </motion.span>
        );
      });
    }

    if (splitLife && wordText === "TO LIFE") {
      return (
        <>
          <span className="inline-block">T</span>
          <span className="inline-block">O</span>
          <span className="inline-block">&nbsp;</span>
          {["L", "I", "F", "E"].map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ transformOrigin: "bottom center" }}
              animate={{
                scaleY: progress.get() >= 0.88 && progress.get() <= 0.97
                  ? 0.68 + Math.abs(i / 3 - 0.5) * 0.64
                  : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {char}
            </motion.span>
          ))}
        </>
      );
    }

    if (splitBringG && wordText === "BRING") {
      return ["B", "R", "I", "N"].map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ transformOrigin: "bottom center" }}
        >
          {char}
        </motion.span>
      )).concat(
        <motion.span
          key="G"
          ref={bringGRef}
          className="inline-block"
          style={{
            transformOrigin: "bottom center",
            fontSize: gPx > 0 ? `calc(1em + ${gPx}px)` : undefined
          }}
        >
          G
        </motion.span>
      );
    }

    if (splitEmph) {
      return (
        <>
          {wordText.slice(0, -1).split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ transformOrigin: "bottom center" }}
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            ref={emphasisCharRef}
            className="inline-block"
            style={{
              transformOrigin: "bottom center",
              fontSize: `calc(1em + ${emphPx}px)`
            }}
          >
            {wordText.slice(-1)}
          </motion.span>
        </>
      );
    }

    return wordText.split("").map((char, i) => {
      const squish = getCharSquish(i, charCount, progress.get());
      return (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            transformOrigin: "bottom center",
            scaleY: squish,
            scaleX: 1 + (1 - squish) * 0.3,
          }}
        >
          {char}
        </motion.span>
      );
    });
  };

  const glowOpacity = useTransform(
    progress,
    [impactThresholds.start, impactThresholds.peak, impactThresholds.end],
    [0.3, 1.0, 0.3]
  );

  const isActive = activeWordIdx === wordIndex;

  return (
    <motion.span
      ref={wordRef}
      className="footer-ladder-word footer-ladder-word--natural footer-ladder-word--extruded anton-font relative inline-block"
      style={{
        filter: isActive
          ? `drop-shadow(0 0 30px rgba(250, 100, 0, 1)) drop-shadow(0 0 60px rgba(250, 100, 0, 0.6)) drop-shadow(0 0 100px rgba(250, 100, 0, 0.3)) ${dofBlur.get()}`
          : filter,
        opacity: 1,
      }}
      animate={isImpacted ? { y: [0, 5, 0] } : { y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <span className="sr-only">{text}</span>
      <span className="text-black" aria-hidden>
        {renderChars(text, false)}
      </span>
      <motion.span
        className="footer-ladder-word--paint absolute left-0 top-0 text-[#fa6400]"
        style={{ opacity: 1 }}
        aria-hidden
      >
        {renderChars(text, true)}
      </motion.span>
    </motion.span>
  );
}

function WordWithEffects({
  children,
  wordIndex,
  activeWordIdx,
  isImpacted,
  progress,
  impactThresholds,
}: {
  children: React.ReactNode;
  wordIndex: number;
  activeWordIdx: number;
  isImpacted: boolean;
  progress: MotionValue<number>;
  impactThresholds: { start: number; peak: number; end: number };
}) {
  const glowOpacity = useTransform(
    progress,
    [impactThresholds.start, impactThresholds.peak, impactThresholds.end],
    [0.15, 1, 0.15]
  );

  return (
    <motion.span
      className="inline-block"
      style={{
        opacity: glowOpacity,
        filter: activeWordIdx === wordIndex
          ? "drop-shadow(0 0 20px rgba(250, 100, 0, 0.8)) drop-shadow(0 0 40px rgba(250, 100, 0, 0.4))"
          : "none",
      }}
      animate={isImpacted ? { y: [0, 5, 0] } : {}}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

function LadderRollingBall({
  variant,
  geom,
  ready,
  pathDone,
  onPathComplete,
  backgroundVariant,
  pathDurationSec,
  trackerInnerRef,
  pathProgress,
  isInView,
  onWordChange,
  onImpact,
}: {
  variant: "yellow" | "red";
  geom: PathGeom | null;
  ready: boolean;
  pathDone: boolean;
  onPathComplete: (anchor: CursorAnchor) => void;
  backgroundVariant: "black" | "gradient";
  pathDurationSec: number;
  trackerInnerRef: React.RefObject<HTMLDivElement | null>;
  pathProgress: MotionValue<number>;
  isInView: boolean;
  onWordChange: (idx: number) => void;
  onImpact: (impacting: boolean) => void;
}) {
  const pathCompleteFired = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [animationStarted, setAnimationStarted] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [isImpacting, setIsImpacting] = useState(false);

  useEffect(() => {
    if (isInView && !animationStarted && ready && !pathDone) {
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, animationStarted, ready, pathDone]);

  useEffect(() => {
    if (!animationStarted) return;

    const unsubscribe = pathProgress.on("change", (p) => {
      let newWordIdx = -1;
      if (p >= 0.02 && p <= 0.28) newWordIdx = 0;
      else if (p > 0.28 && p <= 0.58) newWordIdx = 1;
      else if (p > 0.58 && p <= 0.82) newWordIdx = 2;

      if (newWordIdx !== activeWordIdx) {
        setActiveWordIdx(newWordIdx);
        onWordChange(newWordIdx);
      }

      const impactPoints = [0.08, 0.48, 0.82];
      const isAtImpact = impactPoints.some(
        point => Math.abs(p - point) < 0.03
      );

      if (isAtImpact !== isImpacting) {
        setIsImpacting(isAtImpact);
        onImpact(isAtImpact);
      }
    });

    return () => unsubscribe();
  }, [animationStarted, pathProgress, activeWordIdx, isImpacting, onWordChange, onImpact]);

  if (!ready || !geom || !animationStarted) return null;

  const rollR = geom.ballD / 2;
  const bringStartX = geom.bringStart.x - rollR;
  const bringEndX = geom.bringEnd.x - rollR;
  const bringY = geom.bringStart.y - rollR;
  const holoboxGapX = geom.holoboxGap?.x ? geom.holoboxGap.x - rollR : geom.holoboxStart.x + 30 - rollR;
  const holoboxEndX = geom.holoboxEnd.x - rollR;
  const holoboxY = geom.holoboxStart.y - rollR;
  const lifeX = geom.lifeLand.x - rollR;
  const lifeY = geom.lifeLand.y - rollR;

  const arcHeight = 180;
  const bigArcHeight = 280;
  const entryDist = 240;

  // X positions remain the same
  const xSeq = [
    bringStartX - entryDist,
    bringStartX - entryDist * 0.4,
    bringStartX,
    bringEndX,
    bringEndX + (holoboxGapX - bringEndX) * 0.5,
    holoboxGapX,
    holoboxEndX,
    holoboxEndX + (lifeX - holoboxEndX) * 0.5,
    lifeX,
    lifeX,
    lifeX,
  ];

  // Y positions with anticipation dips and final bounce
  const anticipation = 6; // Small dip before jump
  const finalBounce = 10; // Small bounce after final landing
  const ySeq = [
    bringY - 80,
    bringY - 40,
    bringY,
    bringY + anticipation, // Anticipation dip before jump to gap
    bringY - arcHeight,
    holoboxY,
    holoboxY + anticipation * 0.5, // Smaller dip before big jump
    holoboxY - bigArcHeight,
    lifeY,
    lifeY - finalBounce, // Final bounce up
    lifeY, // Settle
  ];

  // Z-axis for depth perception during jumps
  const zSeq = [
    0,
    0,
    0,
    10, // Slight forward during anticipation
    20, // Peak of arc
    0,
    8, // Forward during second anticipation
    18, // Peak of big arc
    0,
    5, // Slight forward during bounce
    0,
  ];

  const times = [
    0,
    0.08,
    0.18,
    0.28,
    0.38,
    0.48,
    0.58,
    0.70,
    0.82,
    0.90,
    1,
  ] as const;

  // Gravity-based easing: slower ease-out upward, faster acceleration downward
  const smoothEase: CubicBezier = [0.23, 1, 0.32, 1];
  const upwardEase: CubicBezier = [0.25, 1, 0.5, 1]; // Slower at peak
  const downwardEase: CubicBezier = [0.55, 0, 0.75, 0.5]; // Faster acceleration
  const settleEase: CubicBezier = [0.33, 1, 0.68, 1]; // Soft landing

  const easePerSegment: EasingDef[] = [
    smoothEase,    // 0: Entry start
    smoothEase,    // 1: Entry end
    downwardEase,  // 2: Anticipation dip (moving down)
    upwardEase,    // 3: Jump up to gap
    downwardEase,  // 4: Landing on gap
    smoothEase,    // 5: Roll across gap
    downwardEase,  // 6: Anticipation before big jump
    upwardEase,    // 7: Big jump up
    downwardEase,  // 8: Landing on LIFE
    settleEase,    // 9: Final bounce up
    settleEase,    // 10: Settle
  ];

  const leftSeq = xSeq.map((v) => v + rollR);
  let cumulativeX = 0;

  // Rotation based on horizontal movement (dx) with tighter connection to motion
  const rotateKf = xSeq.map((_, i) => {
    if (i === 0) return 0;
    
    const dx = leftSeq[i] - leftSeq[i - 1];
    // Rotation proportional to distance traveled (rolling without slipping)
    const rotationIncrement = (dx / (2 * Math.PI * Math.max(rollR, 1))) * 360;
    cumulativeX += rotationIncrement;
    
    // At big jump apex (index 7), maintain rotation from previous
    if (i === 7) {
      return cumulativeX;
    }
    
    return cumulativeX;
  });

  const shadowOp = [
    0.1, 0.55, 0.45, 0.1, 0.55, 0.45, 0.1, 0.55, 0.45, 0.3, 0.45,
  ];

  const shadowSx = [
    0.6, 1.0, 0.9, 0.5, 1.0, 0.9, 0.5, 1.0, 0.9, 0.7, 0.85,
  ];

  const opacityKF = [
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  const borderColorKF = [
    "#fa6400", "#fb6500", "#ff7500", "#ff8600", "#ff5a5a",
    "#ff4a4a", "#ff3a3a", "#ff1a1a", "#ff4a4a", "#fa6400", "#fa6400",
  ];

  const borderColor =
    variant === "red"
      ? "#ff5a6a"
      : backgroundVariant === "gradient"
        ? "#3ec0c0"
        : "#fa6400";

  const shellShadow =
    backgroundVariant === "gradient"
      ? "inset -12px -12px 25px rgba(0, 0, 0, 0.5), inset 6px 6px 15px rgba(255, 255, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(250, 100, 0, 0.4)"
      : "inset -12px -12px 25px rgba(0, 0, 0, 0.5), inset 6px 6px 15px rgba(255, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(250, 100, 0, 0.3)";

  const reducedMotion = prefersReducedMotion === true;
  const pathDur = pathDurationSec;

  return (
    <motion.div
      className="footer-ladder-ball-tracker"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <motion.div
        ref={trackerInnerRef}
        className="footer-ladder-ball-tracker-inner"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          willChange: "transform",
          display: ready ? "block" : "none",
        }}
        initial={{
          x: bringStartX - 200,
          y: bringY - 150 - rollR,
          z: 0,
          opacity: 0,
          borderColor: borderColorKF[0],
        }}
        animate={{
          x: xSeq,
          y: ySeq,
          z: zSeq,
          opacity: pathDone ? 0 : opacityKF,
          scale: pathDone ? 0.8 : 1,
          borderColor: borderColorKF,
        }}
        transition={{
          duration: pathDur,
          times: [...times],
          ease: easePerSegment,
          opacity: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
          scale: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
        }}
        onAnimationComplete={() => {
          if (pathCompleteFired.current) return;
          pathCompleteFired.current = true;
          onPathComplete({ x: lifeX + rollR, y: lifeY + rollR });
        }}
      >
        <div
          className="footer-ladder-ball-light"
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(250, 100, 0, 0.15) 0%, rgba(250, 100, 0, 0.05) 40%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
            filter: "blur(20px)",
          }}
        />
        <div
          className="footer-ladder-ball-roll"
          style={{
            position: "relative",
            width: geom.ballD,
            height: geom.ballD,
            zIndex: 10,
          }}
        >
          <motion.div
            className="footer-ladder-ball-roll-rot"
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "50% 50%",
            }}
            animate={{ rotate: rotateKf }}
            transition={{
              duration: pathDur,
              times: [...times],
              ease: easePerSegment,
            }}
          >
            <motion.div
              className="footer-ladder-ball-shadow"
              animate={{
                opacity: shadowOp,
                scaleX: shadowSx,
              }}
              transition={{
                duration: pathDur,
                times: [...times],
                ease: easePerSegment,
              }}
            />
            <div
              className="footer-ladder-3d-surface footer-roll-sphere"
              style={{
                background: "transparent",
                boxShadow: shellShadow,
                border: "3px solid",
                borderColor,
              }}
            >
              <div className="footer-ladder-3d-canvas-slot" aria-hidden>
                <FooterLadderBall3D
                  diameter={geom.ballD}
                  variant={variant}
                  backgroundVariant={backgroundVariant}
                  reducedMotion={reducedMotion}
                  pathProgress={pathProgress}
                  isImpacting={isImpacting}
                />
              </div>
            </div>
            <Link
              href="/contact"
              className="footer-ladder-3d-cta footer-ladder-3d-cta--rolling"
              aria-label="One Demo Game Over — book a demo"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="footer-cta-round-label"
                style={{
                  color: "#ffffff",
                  textShadow:
                    "0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(255,255,255,0.2)",
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                One Demo
                <br />
                Game Over
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// MAGNETIC CTA BUTTON - Cursor Following (Next to TO LIFE)
// ==========================================
function MagneticCtaButton({
  anchor,
  variant,
  backgroundVariant,
  size,
  containerRef,
}: {
  anchor: CursorAnchor;
  variant: "yellow" | "red";
  backgroundVariant: "black" | "gradient";
  size: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Button starts at anchor position (where ball landed)
  const startX = anchor.x + 20; 
  const startY = anchor.y - 59;
  
  // Track button position (it will follow cursor within container)
  const [buttonPos, setButtonPos] = useState({ x: startX, y: startY });
  const targetPos = useRef({ x: startX, y: startY });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      
      // Check if mouse is within the ladder container
      const isWithinContainer = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;
      
      if (isWithinContainer) {
        // Mouse is within container - follow cursor with offset
        targetPos.current = {
          x: e.clientX - rect.left + 20, // Relative to container
          y: e.clientY - rect.top - 59,
        };
      } else {
        // Mouse outside - return to start position
        targetPos.current = { x: startX, y: startY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Animation loop for smooth following
    let animationId: number;
    const animate = () => {
      setButtonPos(prev => ({
        x: prev.x + (targetPos.current.x - prev.x) * 0.15, // Smooth lerp
        y: prev.y + (targetPos.current.y - prev.y) * 0.15,
      }));
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [containerRef, startX, startY]);

  const borderColor =
    variant === "red"
      ? "#ff5a6a"
      : backgroundVariant === "gradient"
        ? "#3ec0c0"
        : "#fa6400";

  const bgColor = isHovered
    ? variant === "red"
      ? "rgba(196, 42, 56, 0.9)"
      : backgroundVariant === "gradient"
        ? "rgba(42, 158, 158, 0.9)"
        : "rgba(250, 100, 0, 0.9)"
    : "transparent";

  return (
    <div
      style={{
        position: "absolute",
        left: buttonPos.x,
        top: buttonPos.y,
        zIndex: 100,
        pointerEvents: "none",
        willChange: "left, top",
      }}
    >
      <motion.a
        ref={buttonRef}
        href="/contact"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "absolute",
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bgColor,
          border: `3px solid ${borderColor}`,
          boxShadow:
            backgroundVariant === "gradient"
              ? "inset -12px -12px 25px rgba(0, 0, 0, 0.5), inset 6px 6px 15px rgba(255, 255, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(250, 100, 0, 0.4)"
              : "inset -12px -12px 25px rgba(0, 0, 0, 0.5), inset 6px 6px 15px rgba(255, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(250, 100, 0, 0.3)",
          pointerEvents: "auto",
          cursor: "pointer",
          transition: "background 0.3s ease, transform 0.1s ease",
          transform: "translate(-50%, -50%)", // Center the button on the point
        }}
        whileHover={{
          scale: 1.08,
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="footer-ladder-magnetic-cta"
      >
        <span
          className="footer-cta-round-label"
          style={{
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(255,255,255,0.2)",
            textAlign: "center",
            lineHeight: 1.2,
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          One Demo
          <br />
          Game Over
        </span>
      </motion.a>
    </div>
  );
}

function FooterCreativeCtaBase({
  lineAccent,
  variant,
  backgroundVariant,
}: {
  lineAccent: string;
  variant: "yellow" | "red";
  backgroundVariant: "black" | "gradient";
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { once: false, amount: 0.5 });
  const railRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geom, setGeom] = useState<PathGeom | null>(null);
  const [ready, setReady] = useState(false);
  const [stairML, setStairML] = useState<[number, number, number]>([0, 0, 0]);
  const [pathDone, setPathDone] = useState(false);
  const [followAnchor, setFollowAnchor] = useState<CursorAnchor | null>(null);
  const [followVisible, setFollowVisible] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [humanPresenceActive, setHumanPresenceActive] = useState(false);

  const handlePathComplete = useCallback((anchor: CursorAnchor) => {
    setFollowAnchor(anchor);
    setPathDone(true);
    setFollowVisible(true);
    // Activate human presence after ball completes
    setTimeout(() => {
      setHumanPresenceActive(true);
    }, 600);
  }, []);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const w = sr.width;
    if (w < 40) return;

    const stairGap = 10;
    const w0 = wordRefs.current[0]?.getBoundingClientRect().width ?? 0;
    const w1 = wordRefs.current[1]?.getBoundingClientRect().width ?? 0;
    setStairML([0, w0 + stairGap, w0 + w1 + 2 * stairGap]);

    const rowRects: {
      rr: DOMRect;
      lrLine: DOMRect;
      pad: number;
    }[] = [];
    for (let i = 0; i < 3; i++) {
      const railEl = railRefs.current[i];
      const lineEl = lineRefs.current[i];
      if (!railEl || !lineEl) return;
      rowRects.push({
        rr: railEl.getBoundingClientRect(),
        lrLine: lineEl.getBoundingClientRect(),
        pad: Math.min(12, w * 0.028),
      });
    }

    const rollD = Math.max(118, Math.min(168, w * 0.3));
    const rollR = rollD / 2;

    const rails: RailGeom[] = [];
    for (const row of rowRects) {
      const { rr, lrLine, pad } = row;
      const lineTop = lrLine.top - sr.top;
      const yCenter = Math.max(8, lineTop - rollR - 8);
      rails.push({
        y: yCenter,
        xLeft: rr.left - sr.left + pad,
        xRight: rr.right - sr.left - pad,
      });
    }

    const word3 = wordRefs.current[2];
    if (!word3) return;

    const lifeEl = lifeWordRef.current;
    let landX: number;
    let landY: number;
    if (lifeEl) {
      const lb = lifeEl.getBoundingClientRect();
      const gap = Math.min(40, w * 0.06);
      landX = lb.right - sr.left + gap + rollR;
      landY = lb.top - sr.top + lb.height / 2 - Math.min(14, w * 0.018);
    } else {
      const w3b = word3.getBoundingClientRect();
      const w3R = w3b.right - sr.left;
      landX = w3R + rollD / 2 + 12;
      landY = w3b.top - sr.top + w3b.height / 2 - Math.min(14, w * 0.018);
    }

    const holoboxGapX = rails[1].xLeft + (rails[1].xRight - rails[1].xLeft) * 0.15;

    setGeom({
      w,
      ballD: rollD,
      bringStart: { x: rails[0].xLeft + (rails[0].xRight - rails[0].xLeft) * 0.1, y: rails[0].y },
      bringEnd: { x: rails[0].xRight, y: rails[0].y },
      holoboxStart: { x: rails[1].xLeft, y: rails[1].y },
      holoboxEnd: { x: rails[1].xRight, y: rails[1].y },
      holoboxGap: { x: holoboxGapX, y: rails[1].y },
      lifeLand: { x: landX, y: landY },
    });
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const setRailRef = (i: number) => (el: HTMLDivElement | null) => {
    railRefs.current[i] = el;
  };

  const setLineRef = (i: number) => (el: HTMLDivElement | null) => {
    lineRefs.current[i] = el;
  };

  const setWordRef = (i: number) => (el: HTMLSpanElement | null) => {
    wordRefs.current[i] = el;
  };

  const lifeWordRef = useRef<HTMLSpanElement | null>(null);
  const bringGRef = useRef<HTMLSpanElement | null>(null);
  const holoboxXRef = useRef<HTMLSpanElement | null>(null);

  const ballTrackerRef = useRef<HTMLDivElement>(null);
  const pathProgress = useMotionValue(0);

  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [isImpacting, setIsImpacting] = useState(false);

  const reduceMo = useReducedMotion();
  const rollDur = reduceMo ? 3.5 : 12;
  const isStageInView = useInView(stageRef, { once: true, amount: 0.6 });

  useBallLightProbe(stageRef, ballTrackerRef);

  useEffect(() => {
    if (!isStageInView) return;
    if (reduceMo) {
      pathProgress.set(1);
      return;
    }
    pathProgress.set(0);
    setAnimationStarted(false);
    const ctrl = animate(pathProgress, 1, {
      duration: rollDur,
      ease: "linear",
      delay: 0.5,
      onPlay: () => setAnimationStarted(true),
    });
    return () => ctrl.stop();
  }, [isStageInView, reduceMo, rollDur, pathProgress]);

  const ladderStepVariants = {
    hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };
  const ladderFlowVariants = {
    hidden: {},
    visible: {},
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      id="holobox"
      ref={containerRef}
      className={`footer-cta-container position-relative px-2 bg-variant-${backgroundVariant}`}
      style={{ padding: "80px 0" }}
    >
      <div
        ref={stageRef}
        className="footer-ladder-stage w-100 position-relative"
        style={
          geom
            ? ({
                "--footer-ladder-ball": `${geom.ballD}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="footer-ladder-stage-parallax">
          <motion.div
            className="footer-ladder-flow w-100 position-relative"
            variants={ladderFlowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
          >
            <motion.div className="footer-ladder-step" variants={ladderStepVariants}>
              <div
                className="footer-ladder-track footer-ladder-track--0"
                style={{ marginLeft: stairML[0] }}
              >
                <div
                  ref={setRailRef(0)}
                  className="footer-ladder-rail"
                  data-footer-rail
                  aria-hidden
                />
                <div ref={setLineRef(0)} className="footer-ladder-line">
                  <FooterLadderLineWord
                    text="BRING"
                    wordRef={setWordRef(0)}
                    bringGRef={bringGRef}
                    emphasizeBringGPx={18}
                    progress={pathProgress}
                    revealStops={[0, 0, 1, 1]}
                    dofStops={[0, 0.62, 0.8, 1]}
                    dofOutputs={["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]}
                    wordIndex={0}
                    activeWordIdx={activeWordIdx}
                    isImpacted={isImpacting && activeWordIdx === 0}
                    impactThresholds={{ start: 0.02, peak: 0.08, end: 0.20 }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="footer-ladder-step" variants={ladderStepVariants}>
              <div
                className="footer-ladder-track footer-ladder-track--1"
                style={{ marginLeft: stairML[1] }}
              >
                <div
                  ref={setRailRef(1)}
                  className="footer-ladder-rail"
                  data-footer-rail
                  aria-hidden
                />
                <div ref={setLineRef(1)} className="footer-ladder-line">
                  <FooterLadderLineWord
                    text="HOLOBOX"
                    wordRef={setWordRef(1)}
                    emphasizeLastCharPx={14}
                    emphasisCharRef={holoboxXRef}
                    progress={pathProgress}
                    revealStops={[0, 0, 1, 1]}
                    dofStops={[0, 0.45, 0.74, 1]}
                    dofOutputs={["blur(0px)", "blur(0px)", "blur(0px)", "blur(0px)"]}
                    wordIndex={1}
                    activeWordIdx={activeWordIdx}
                    isImpacted={isImpacting && activeWordIdx === 1}
                    impactThresholds={{ start: 0.35, peak: 0.48, end: 0.60 }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="footer-ladder-step" variants={ladderStepVariants}>
              <div
                className="footer-ladder-track footer-ladder-track--2"
                style={{ marginLeft: stairML[2] }}
              >
                <div
                  ref={setRailRef(2)}
                  className="footer-ladder-rail"
                  data-footer-rail
                  aria-hidden
                />
                <div ref={setLineRef(2)} className="footer-ladder-line">
                  <FooterLadderLineWord
                    text="TO LIFE"
                    wordRef={setWordRef(2)}
                    lifeWordRef={lifeWordRef}
                    progress={pathProgress}
                    revealStops={[0, 0, 1, 1]}
                    dofStops={[0, 0.25, 0.55, 1]}
                    dofOutputs={[
                      "blur(0px)",
                      "blur(0px)",
                      "blur(0px)",
                      "blur(0px)",
                    ]}
                    wordIndex={2}
                    activeWordIdx={activeWordIdx}
                    isImpacted={isImpacting && activeWordIdx === 2}
                    impactThresholds={{ start: 0.70, peak: 0.82, end: 0.92 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div
            className={`footer-ladder-light-spill footer-ladder-light-spill--${backgroundVariant}`}
            aria-hidden
          />

          {ready && (
            <LadderRollingBall
              variant={variant}
              geom={geom}
              ready={ready}
              pathDone={pathDone}
              onPathComplete={handlePathComplete}
              backgroundVariant={backgroundVariant}
              pathDurationSec={rollDur}
              trackerInnerRef={ballTrackerRef}
              pathProgress={pathProgress}
              isInView={isInView}
              onWordChange={setActiveWordIdx}
              onImpact={setIsImpacting}
            />
          )}

        </div>
      </div>
      
      {/* Human Presence - Premium holographic experience */}
      <HoloboxHumanPresence
        isActive={humanPresenceActive}
        variant={variant}
        backgroundVariant={backgroundVariant}
        reducedMotion={reduceMo}
        onPresenceComplete={() => {
          // Optional: callback when presence sequence completes
        }}
      />
      
      {/* Magnetic button - follows cursor within container */}
      {followVisible && followAnchor && geom && (
        <MagneticCtaButton
          anchor={followAnchor}
          variant={variant}
          backgroundVariant={backgroundVariant}
          size={geom.ballD}
          containerRef={containerRef}
        />
      )}
    </div>
  );
}

export function FooterCreativeCtaGradient({
  lineAccent,
  variant,
}: {
  lineAccent: string;
  variant: "yellow" | "red";
}) {
  return (
    <FooterCreativeCtaBase
      backgroundVariant="gradient"
      lineAccent={lineAccent}
      variant={variant}
    />
  );
}

export function FooterCreativeCtaBlack({
  lineAccent,
  variant,
}: {
  lineAccent: string;
  variant: "yellow" | "red";
}) {
  return (
    <FooterCreativeCtaBase
      backgroundVariant="black"
      lineAccent={lineAccent}
      variant={variant}
    />
  );
}

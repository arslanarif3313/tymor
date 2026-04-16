"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";

import FooterR3FSmoke from "./FooterR3FSmoke";

const FooterLadderBall3D = dynamic(() => import("./FooterLadderBall3D"), {
  ssr: false,
  loading: () => (
    <div
      className="footer-ladder-ball-3d-fallback"
      style={{
        width: "var(--footer-ladder-ball, 118px)",
        height: "var(--footer-ladder-ball, 118px)",
      }}
      aria-hidden
    />
  ),
});

type RailGeom = {
  y: number;
  xLeft: number;
  xRight: number;
};
type PathGeom = {
  w: number;
  ballD: number;
  rail: [RailGeom, RailGeom, RailGeom];
  land: { x: number; y: number };
  /** Ball left edge when centered on “G” in BRING, then nudged toward HOLOBOX. */
  bringGBallLeft: number;
  bringGNudgeLeft: number;
  /** Smoke/dust over “G” (small jump + roll). */
  bringGSmoke?: { left: number; top: number; width: number; height: number };
  /** Stage-space box for smoke/dust over HOLOBOX “X” when the ball jumps. */
  holoboxXSmoke?: { left: number; top: number; width: number; height: number };
};

type CursorAnchor = { x: number; y: number };

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
}: {
  text: string;
  wordRef: (el: HTMLSpanElement | null) => void;
  /** When set with "TO LIFE", measures landing next to LIFE only (not the whole line). */
  lifeWordRef?: React.RefObject<HTMLSpanElement | null>;
  /** Enlarges the last letter (e.g. HOLOBOX “X”) without affecting layout measure much. */
  emphasizeLastCharPx?: number;
  /** Ref on the emphasized last char (e.g. for smoke anchored on “X”). */
  emphasisCharRef?: React.RefObject<HTMLSpanElement | null>;
  /** Ref on “G” in BRING (jump + smoke). */
  bringGRef?: React.RefObject<HTMLSpanElement | null>;
  /** Extra px on “G” (larger than BRIN). */
  emphasizeBringGPx?: number;
  progress: MotionValue<number>;
  revealStops: [number, number, number, number];
  dofStops: [number, number, number, number];
  dofOutputs?: [string, string, string, string];
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

  // Letter squish effect when ball impacts (18 keyframe indices matching times array)
  // Enhanced impact effects - more pronounced squish on landings and bounces
  const squishScaleY = useTransform(
    progress,
    [0, 0.08, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.80, 0.86, 0.92, 0.96, 0.97, 0.985, 0.995, 1],
    text === "BRING"
      ? // BRING impacts: drop (0.08) - big squish, jump from G (0.26) - lift then settle, shelf landing (0.50) - small squish
        [1, 0.72, 1.02, 1, 0.88, 1, 1, 0.92, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      : text === "HOLOBOX"
        ? // HOLOBOX impacts: shelf landing (0.50) - squish, jump from X (0.74) - big lift anticipation
          [1, 1, 1, 1, 1, 1, 1, 0.78, 1.05, 1, 1.08, 1, 1, 1, 1, 1, 1, 1, 1]
        : text === "TO LIFE"
          ? // TO LIFE impacts: land (0.92) - big squish, bounce up (0.96) - stretch, bounce down (0.97) - squish, mini bounce (0.985) - small squish
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.68, 1.06, 0.82, 1.03, 0.95, 1]
          : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  );

  // Add horizontal shake/impact effect for more realistic bounce impact
  const squishScaleX = useTransform(
    progress,
    [0, 0.08, 0.10, 0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.80, 0.86, 0.92, 0.96, 0.97, 0.985, 0.995, 1],
    text === "BRING"
      ? [1, 1.06, 0.98, 1, 1.04, 1, 1, 1.03, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      : text === "HOLOBOX"
        ? [1, 1, 1, 1, 1, 1, 1, 1.05, 0.96, 1, 1.06, 1, 1, 1, 1, 1, 1, 1, 1]
        : text === "TO LIFE"
          ? [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.08, 0.94, 1.04, 0.98, 1.02, 1]
          : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  );

  const splitLife = text === "TO LIFE" && lifeWordRef;
  const splitBringG = text === "BRING" && bringGRef;
  const emphPx = emphasizeLastCharPx ?? 0;
  const gPx = emphasizeBringGPx ?? 0;
  const splitEmph =
    !splitLife && emphPx > 0 && text.length >= 2
      ? {
          head: text.slice(0, -1),
          last: text.slice(-1),
        }
      : null;

  return (
    <motion.span
      ref={wordRef}
      className="footer-ladder-word footer-ladder-word--natural footer-ladder-word--extruded anton-font relative inline-block"
      style={{ filter, scaleY: squishScaleY, scaleX: squishScaleX, transformOrigin: "bottom center" }}
    >
      <span className="sr-only">{text}</span>
      <span className="text-black" aria-hidden>
        {splitLife ? (
          <>
            TO <span ref={lifeWordRef}>LIFE</span>
          </>
        ) : splitBringG ? (
          <>
            BRIN
            <span
              ref={bringGRef}
              style={
                gPx > 0 ? { fontSize: `calc(1em + ${gPx}px)` } : undefined
              }
            >
              G
            </span>
          </>
        ) : splitEmph ? (
          <>
            {splitEmph.head}
            <span
              ref={emphasisCharRef}
              style={{ fontSize: `calc(1em + ${emphPx}px)` }}
            >
              {splitEmph.last}
            </span>
          </>
        ) : (
          text
        )}
      </span>
      <motion.span
        className="footer-ladder-word--paint absolute left-0 top-0 text-[#fa6400]"
        style={{ opacity: reveal }}
        aria-hidden
      >
        {splitLife ? (
          <>
            TO <span>LIFE</span>
          </>
        ) : splitBringG ? (
          <>
            BRIN
            <span style={gPx > 0 ? { fontSize: `calc(1em + ${gPx}px)` } : undefined}>
              G
            </span>
          </>
        ) : splitEmph ? (
          <>
            {splitEmph.head}
            <span style={{ fontSize: `calc(1em + ${emphPx}px)` }}>
              {splitEmph.last}
            </span>
          </>
        ) : (
          text
        )}
      </motion.span>
    </motion.span>
  );
}

function FooterCursorFollowCta({
  variant,
  anchor,
  backgroundVariant,
}: {
  variant: "yellow" | "red";
  anchor: CursorAnchor;
  backgroundVariant?: "black" | "gradient";
}) {
  const x = useMotionValue(anchor.x);
  const y = useMotionValue(anchor.y);
  const sx = useSpring(x, { stiffness: 240, damping: 28, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 240, damping: 28, mass: 0.45 });

  useEffect(() => {
    x.set(anchor.x);
    y.set(anchor.y);
  }, [anchor.x, anchor.y, x, y]);

  return (
    <motion.div
      className="footer-cursor-follow-wrap"
      style={{
        position: "absolute",
        left: sx,
        top: sy,
        x: "-50%",
        y: "-50%",
        zIndex: 9,
      }}
    >
      <Link
        href="/contact"
        className={`footer-cursor-follow-btn ${backgroundVariant === "gradient" ? "footer-cursor-follow-btn--teal" : `footer-cursor-follow-btn--${variant}`}`}
        aria-label="One Demo Game Over — book a demo"
      >
        One Demo
        <br />
        Game Over
      </Link>
    </motion.div>
  );
}

/** Rolling CTA: shelf roll + projectile drops, then handoff CTA. */
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
}) {
  const pathCompleteFired = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  if (pathDone) return null;
  if (!ready || !geom) return null;

  const [r1, r2] = geom.rail;
  const { land } = geom;
  const rollR = geom.ballD / 2;
  const momentum = Math.max(80, rollR * 1.8);

  const land1X = Math.max(r2.xLeft, r1.xRight + momentum);

  const enterL = r1.xLeft - Math.max(28, Math.min(72, geom.w * 0.08));

  const targetX = geom.land.x;
  const targetY = geom.land.y;

  /** Big arc from end of Holobox shelf to beside LIFE — no long roll on “TO LIFE”. */
  const takeoffLeft = r2.xRight - rollR;
  const landLeft = targetX - rollR;
  const takeoffCenterX = takeoffLeft + rollR;
  const landCenterX = targetX;
  const apexCenterX =
    takeoffCenterX + (landCenterX - takeoffCenterX) * 0.48;
  const apexLeft = apexCenterX - rollR;
  const yGroundR2 = r2.y - rollR;
  const yGroundLife = targetY - rollR;

  const yR1 = r1.y - rollR;
  const yR2 = r2.y - rollR;
  const xR1L = r1.xLeft - rollR;
  const xAtG = geom.bringGBallLeft;
  const xOverG = Math.min(
    land1X - rollR - 6,
    xAtG + rollR + Math.min(64, Math.max(44, geom.w * 0.056)),
  );
  const shelfL = land1X - rollR;
  /** Forward roll on HOLOBOX shelf so horizontal distance (and 2D “roll” rotation) never plateaus. */
  const xShelf = (t: number) => shelfL + (takeoffLeft - shelfL) * t;

  /** 18 keyframes: smooth projectile arcs with intermediate points for parabolic motion */
  const xSeq = [
    enterL - rollR,           // 0: enter from left
    xR1L,                     // 1: land on BRING rail
    xAtG,                     // 2: roll to G
    xAtG + (xOverG-xAtG)*0.3, // 3: jump up (ascending)
    xOverG,                   // 4: apex over G
    xOverG + (xShelf(0)-xOverG)*0.7, // 5: jump down (descending)
    xShelf(0),                // 6: land on HOLOBOX shelf
    xShelf(0.35),             // 7: roll shelf forward
    xShelf(0.7),              // 8: roll shelf forward
    xShelf(1),                // 9: shelf end - continuous into jump
    takeoffLeft + (apexLeft-takeoffLeft)*0.4, // 10: big jump ascending
    apexLeft,                 // 11: apex of big jump
    apexLeft + (landLeft-apexLeft)*0.6, // 12: big jump descending
    landLeft,                 // 13: land in space beside LIFE
    landLeft,                 // 14: bounce up (stay at landing spot)
    landLeft,                 // 15: bounce down (stay at landing spot)
    landLeft,                 // 16: mini bounce (stay at landing spot)
    landLeft,                 // 17: settle - final position in space next to LIFE
  ];

  const bounceA = 95;    // EXTREME first bounce (higher for visibility)
  const bounceB = 45;    // second bounce  
  const bounceC = 22;    // final settle (higher mini bounce)
  const jumpOverG = Math.min(110, 80 + geom.w * 0.016);  // height over G
  const jumpBig = Math.min(260, Math.max(180, geom.w * 0.20));  // massive jump
  const yOverG = yR1 - jumpOverG;
  const yApexBig = yGroundR2 - jumpBig;

  const ySeq = [
    r1.y - 280 - rollR,        // 0: enter VERY high (dramatic drop)
    yR1,                       // 1: drop to rail
    yR1,                       // 2: roll on rail
    yR1 - jumpOverG*0.6,       // 3: ascending over G (visible jump)
    yOverG,                    // 4: apex over G
    yR2 - jumpOverG*0.3,       // 5: descending to shelf
    yR2,                       // 6: land shelf
    yR2,                       // 7: roll
    yR2,                       // 8: roll
    yGroundR2,                 // 9: shelf end (continuous)
    yGroundR2 - jumpBig*0.7,   // 10: ascending big jump
    yApexBig,                  // 11: apex big jump
    yGroundLife - jumpBig*0.4, // 12: descending
    yGroundLife - 45,          // 13: land UP higher beside LIFE (elevated position)
    yGroundLife - 45 - bounceA, // 14: BOUNCE UP from elevated position
    yGroundLife - 45,          // 15: BOUNCE DOWN back to elevated position
    yGroundLife - 45 - bounceC, // 16: mini bounce up
    yGroundLife - 43,          // 17: settle - slightly lower than landing for natural squash
  ];

  // Smoother, more evenly distributed timing for fluid motion
  // Bounce sequence expanded for proper visibility (was too compressed)
  const times = [
    0,      // 0: enter
    0.06,   // 1: drop - slightly faster
    0.12,   // 2: roll to G - smooth approach
    0.20,   // 3: ascending jump - smooth takeoff
    0.28,   // 4: apex over G - hang
    0.36,   // 5: descending - smooth fall
    0.44,   // 6: land shelf - gentle landing
    0.52,   // 7: roll - constant
    0.60,   // 8: roll - constant
    0.68,   // 9: shelf end - continuous
    0.76,   // 10: ascending big jump - smooth
    0.84,   // 11: apex big jump - peak
    0.90,   // 12: descending - smooth gravity
    0.92,   // 13: land LIFE - soft landing
    0.94,   // 14: bounce up (first bounce)
    0.96,   // 15: bounce down
    0.98,   // 16: mini bounce
    1,      // 17: settle
  ] as const;

  type CubicBezier = [number, number, number, number];
  type EasingDef = CubicBezier | "linear";
  // Ultra smooth easeInOut for continuous flow
  const smooth: CubicBezier = [0.4, 0, 0.2, 1];
  // Very smooth sine-like easing
  const sineSmooth: CubicBezier = [0.37, 0, 0.63, 1];
  // Linear for constant velocity
  const linear: CubicBezier = [0.5, 0.5, 0.5, 0.5];
  // Gentle ease out for landings (no bounce)
  const gentleOut: CubicBezier = [0.25, 0.1, 0.25, 1];
  // Smooth ease in for takeoffs
  const smoothIn: CubicBezier = [0.4, 0, 1, 1];
  // Very smooth for arcs (parabolic feel)
  const arcSmooth: CubicBezier = [0.45, 0, 0.55, 1];
  // Bouncy easing for actual bounces (overshoot for pop)
  const bouncy: CubicBezier = [0.34, 1.56, 0.64, 1];
  // Quick ease out for bounce up
  const quickOut: CubicBezier = [0.16, 1, 0.3, 1];
  // Gravity-like ease in for bounce down
  const gravityIn: CubicBezier = [0.55, 0, 1, 0.45];

  const easePerSegment: EasingDef[] = [
    smooth,      // 0: enter - smooth start
    sineSmooth,  // 1: drop to rail - gentle landing
    linear,      // 2: roll to G - constant velocity
    arcSmooth,   // 3: ascending jump - smooth arc
    smooth,      // 4: apex over G - hang time
    arcSmooth,   // 5: descending - smooth gravity
    gentleOut,   // 6: land shelf - soft landing
    linear,      // 7: roll - constant velocity
    linear,      // 8: roll - constant velocity
    smoothIn,    // 9: continuous to big jump - smooth acceleration
    arcSmooth,   // 10: ascending big jump - smooth arc
    smooth,      // 11: apex hang - float
    arcSmooth,   // 12: descending - smooth gravity
    bouncy,      // 13: land LIFE - bouncy landing
    quickOut,    // 14: bounce up - quick recoil
    gravityIn,   // 15: bounce down - gravity fall
    bouncy,      // 16: mini bounce - small pop
    smooth,      // 17: settle - smooth finish
  ];

  const leftSeq = xSeq.map((v) => v + rollR);
  let cumulativeX = 0;
  const rotateKf = xSeq.map((_, i) => {
    if (i > 0) cumulativeX += Math.abs(leftSeq[i] - leftSeq[i - 1]);
    return (cumulativeX / (2 * Math.PI * Math.max(rollR, 1))) * 360;
  });

  const shadowOp = [
    0, 0.2, 0.42, 0.15, 0.12, 0.35, 0.4, 0.42, 0.4, 0.46, 0.08, 0.1, 0.38, 0.4, 0.38, 0.4, 0.35, 0.4,
  ];
  const shadowSx = [
    0.3, 0.8, 0.82, 0.5, 0.36, 0.78, 0.82, 0.8, 0.8, 0.85, 0.36, 0.4, 0.74, 0.78, 0.76, 0.78, 0.76, 0.8,
  ];

  // Ball opacity - stays hidden while flowing over BRING, appears after
  const opacityKF = [
    0,    // 0: hidden (enter high)
    0,    // 1: hidden (drop to rail)
    0,    // 2: hidden (roll to G)
    0,    // 3: hidden (ascending jump over BRING)
    0,    // 4: hidden (apex over G)
    0.3,  // 5: start appearing (descending from G jump)
    0.7,  // 6: fading in (land shelf)
    1,    // 7: fully visible (roll on HOLOBOX)
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // rest fully visible
  ];

  // Smooth color transition following the ball's heat (hidden at start, visible after index 5)
  const borderColorKF = [
    "#fa6400", // 0: enter orange (hidden)
    "#fa6400", // 1: drop (hidden)
    "#fa6400", // 2: roll (hidden)
    "#fb6500", // 3: ascending (hidden)
    "#fc6a00", // 4: apex over G (hidden)
    "#fd6f00", // 5: descending - ball starts appearing
    "#ff7500", // 6: land shelf - getting hot
    "#ff6a3a", // 7: roll - hotter
    "#ff5a5a", // 8: roll - red
    "#ff4a4a", // 9: takeoff - deep red
    "#ff3a3a", // 10: ascending - hottest
    "#ff2a2a", // 11: APEX - MAX HEAT
    "#ff3a3a", // 12: descending - still hot
    "#ff4a4a", // 13: land - red
    "#ff5a5a", // 14: bounce - cooling
    "#ff6a4a", // 15: bounce down
    "#ff7a3a", // 16: mini bounce
    "#fa6400", // 17: settle - back to orange
  ];

  // Takeoff dust from X - appears when jumping FROM X (indices 9-13)
  const dustOp = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0.94, 0.55, 0.35, 0.18, 0, 0, 0, 0, 0,
  ];
  const dustPatchLeft = takeoffLeft + rollR - 42;
  const dustPatchTop = yGroundR2 + geom.ballD * 0.78;

  // Smoke from HOLOBOX X when jumping FROM X (indices 9-13, peak at 11)
  const smokeHoloboxOp = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0.12, 0.55, 0.82, 0.95, 1, 0.72, 0.48, 0.28, 0,
  ];
  // Smoke from G when jumping FROM G (indices 3-6, visible jump over BRING)
  const smokeBringGOp = [
    0, 0, 0, 0.15, 0.55, 0.88, 0.65, 0.25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // No cooling smoke at final position
  const coolingSmokeOp = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  const dustScaleKf = [
    0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 1, 1.08, 0.98, 0.94, 0.65, 0.65, 0.65, 0.65, 0.65,
  ];
  const smokeHoloboxScaleKf = [
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.72, 1, 1.12, 1.05, 0.95, 0.85, 0.7, 0.55, 0.5, 0.5, 0.5, 0.5,
  ];
  const smokeBringGScaleKf = [
    0.5, 0.5, 0.5, 0.5, 0.88, 1.18, 1.05, 0.82, 0.58, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
  ];
  const coolingSmokeScaleKf = [
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.72, 1.05, 1.18, 0.95, 0.68,
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
        zIndex: 9,
        pointerEvents: "none",
      }}
      initial={false}
    >
      <motion.div
        ref={trackerInnerRef}
        className="footer-ladder-ball-tracker-inner"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          willChange: "transform",
        }}
        initial={{
          x: xSeq[0],
          y: ySeq[0],
          opacity: 0,
          borderColor: borderColorKF[0],
        }}
        animate={{
          x: xSeq,
          y: ySeq,
          opacity: opacityKF,
          borderColor: borderColorKF,
        }}
        transition={{
          duration: pathDur,
          times: [...times],
          ease: easePerSegment,
        }}
        onAnimationComplete={() => {
          if (pathCompleteFired.current) return;
          pathCompleteFired.current = true;
          onPathComplete({ x: land.x, y: land.y });
        }}
      >
        <div
          className="footer-ladder-ball-roll"
          style={{
            position: "relative",
            width: geom.ballD,
            height: geom.ballD,
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
                />
              </div>
            </div>
            {/* Rolling text - rotates with the ball */}
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
      <motion.div
        className="footer-ladder-ball-dust footer-ladder-ball-dust--takeoff"
        aria-hidden
        style={{
          position: "absolute",
          left: dustPatchLeft,
          top: dustPatchTop,
          zIndex: 12,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0, scale: 0.65 }}
        animate={{
          opacity: dustOp,
          scale: dustScaleKf,
        }}
        transition={{
          duration: pathDur,
          times: [...times],
          ease: "linear",
        }}
      />
      {geom.bringGSmoke ? (
        <motion.div
          className="footer-ladder-ball-smoke footer-ladder-ball-smoke--g footer-ladder-ball-smoke--r3f"
          aria-hidden
          style={{
            position: "absolute",
            left: geom.bringGSmoke.left,
            top: geom.bringGSmoke.top,
            width: geom.bringGSmoke.width,
            height: geom.bringGSmoke.height,
            zIndex: 14,
            pointerEvents: "none",
            overflow: "hidden",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: smokeBringGOp,
            scale: smokeBringGScaleKf,
          }}
          transition={{
            duration: pathDur,
            times: [...times],
            ease: "linear",
          }}
        >
          {!reducedMotion ? <FooterR3FSmoke /> : null}
        </motion.div>
      ) : null}
      {geom.holoboxXSmoke ? (
        <motion.div
          className="footer-ladder-ball-smoke footer-ladder-ball-smoke--x footer-ladder-ball-smoke--r3f"
          aria-hidden
          style={{
            position: "absolute",
            left: geom.holoboxXSmoke.left,
            top: geom.holoboxXSmoke.top,
            width: geom.holoboxXSmoke.width,
            height: geom.holoboxXSmoke.height,
            zIndex: 14,
            pointerEvents: "none",
            overflow: "hidden",
          }}
          animate={{
            opacity: smokeHoloboxOp,
            scale: smokeHoloboxScaleKf,
          }}
          transition={{
            duration: pathDur,
            times: [...times],
            ease: "linear",
          }}
        >
          {!reducedMotion ? <FooterR3FSmoke /> : null}
        </motion.div>
      ) : null}
      {/* Cooling smoke - hot iron cooling down effect at landing position */}
      <motion.div
        className="footer-ladder-ball-smoke footer-ladder-ball-smoke--cooling footer-ladder-ball-smoke--r3f"
        aria-hidden
        style={{
          position: "absolute",
          left: landLeft - 50,
          top: yGroundLife - 20,
          width: 100,
          height: 80,
          zIndex: 13,
          pointerEvents: "none",
          overflow: "hidden",
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: coolingSmokeOp,
          scale: coolingSmokeScaleKf,
        }}
        transition={{
          duration: pathDur,
          times: [...times],
          ease: "linear",
        }}
      >
        {!reducedMotion ? <FooterR3FSmoke /> : null}
      </motion.div>
    </motion.div>
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
  const railRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geom, setGeom] = useState<PathGeom | null>(null);
  const [ready, setReady] = useState(false);
  const [stairML, setStairML] = useState<[number, number, number]>([0, 0, 0]);
  const [pathDone, setPathDone] = useState(false);
  const [followAnchor, setFollowAnchor] = useState<CursorAnchor | null>(null);
  const [followVisible, setFollowVisible] = useState(false);

  const handlePathComplete = useCallback((anchor: CursorAnchor) => {
    setFollowAnchor(anchor);
    setPathDone(true);
    // Reveal follow CTA immediately to feel like a seamless transformation
    setFollowVisible(true);
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
      // Keep the sphere near each line instead of floating unrealistically high.
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
      const gap = Math.min(80, w * 0.12); // Large gap so ball lands IN SPACE next to LIFE
      // Ball center sits in the space/area to the right of "LIFE", not on the word
      landX = lb.right - sr.left + gap + rollR;
      // Slightly above word center so the ball reads beside “LIFE” without sitting low.
      landY = lb.top - sr.top + lb.height / 2 - Math.min(14, w * 0.018);
    } else {
      const w3b = word3.getBoundingClientRect();
      const w3R = w3b.right - sr.left;
      landX = w3R + rollD / 2 + 12;
      landY = w3b.top - sr.top + w3b.height / 2 - Math.min(14, w * 0.018);
    }

    const r1 = rails[0];
    const gEl = bringGRef.current;
    let bringGBallLeft = (r1.xLeft + r1.xRight) / 2 - rollR;
    let bringGNudgeLeft = Math.min(
      r1.xRight - rollR,
      bringGBallLeft + Math.min(22, w * 0.028),
    );
    let bringGSmoke: PathGeom["bringGSmoke"];
    if (gEl) {
      const gb = gEl.getBoundingClientRect();
      const gcx = gb.left - sr.left + gb.width / 2;
      bringGBallLeft = gcx - rollR;
      bringGNudgeLeft = Math.min(
        r1.xRight - rollR,
        bringGBallLeft + Math.min(22, w * 0.028),
      );
      bringGSmoke = {
        left: gcx - 62,
        top: gb.top - sr.top - 85, // Position above the G letter
        width: 124,
        height: 92,
      };
    }

    let holoboxXSmoke: PathGeom["holoboxXSmoke"];
    const hx = holoboxXRef.current;
    if (hx) {
      const hb = hx.getBoundingClientRect();
      holoboxXSmoke = {
        left: hb.left - sr.left + hb.width / 2 - 68,
        top: hb.top - sr.top - 75, // Position above the X letter
        width: 136,
        height: 92,
      };
    }

    setGeom({
      w,
      ballD: rollD,
      rail: [rails[0], rails[1], rails[2]],
      land: {
        x: landX,
        y: landY,
      },
      bringGBallLeft,
      bringGNudgeLeft,
      bringGSmoke,
      holoboxXSmoke,
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

  const reduceMo = useReducedMotion();
  const rollDur = reduceMo ? 3.5 : 12; // 12s total duration for good pacing
  const isStageInView = useInView(stageRef, { once: true, amount: 0.22 });

  useBallLightProbe(stageRef, ballTrackerRef);

  useEffect(() => {
    if (!isStageInView) return;
    if (reduceMo) {
      pathProgress.set(1);
      return;
    }
    const ctrl = animate(pathProgress, 1, {
      duration: rollDur,
      ease: "linear",
      delay: 2.5, // Delay ball start by 2.5 seconds after text appears
    });
    return () => ctrl.stop();
  }, [isStageInView, reduceMo, rollDur, pathProgress]);
  const ladderStepVariants = {
    hidden: reduceMo
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: reduceMo ? 0 : 0.8, // Faster reveal for clarity
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };
  const ladderFlowVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMo ? 0 : 0.12, // Faster stagger
        delayChildren: reduceMo ? 0 : 0.02, // Almost no initial delay - pops up immediately
      },
    },
  };

  return (
    <div
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
                  emphasizeBringGPx={22}
                  progress={pathProgress}
                  revealStops={[0, 0.04, 0.11, 0.2]}
                  dofStops={[0, 0.62, 0.8, 1]}
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
                  revealStops={[0, 0.28, 0.38, 0.5]}
                  dofStops={[0, 0.45, 0.74, 1]}
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
                  revealStops={[0, 0.48, 0.58, 0.72]}
                  dofStops={[0, 0.25, 0.55, 1]}
                  dofOutputs={[
                    "blur(0px)",
                    "blur(0px)",
                    "blur(0px)",
                    "blur(0px)",
                  ]}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div
          className={`footer-ladder-light-spill footer-ladder-light-spill--${backgroundVariant}`}
          aria-hidden
        />

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
        />
        {pathDone && followVisible && followAnchor ? (
          <FooterCursorFollowCta
            variant={variant}
            anchor={followAnchor}
            backgroundVariant={backgroundVariant}
          />
        ) : null}
        </div>
      </div>
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

function MagneticLink({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 1.5);
    y.set((e.clientY - centerY) * 1.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const scrollToTop = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="footer-area text-white overflow-hidden position-relative">
      <div className="footer-creative-backdrop">
        <div className="footer-mesh-orb mesh-1"></div>
        <div className="footer-mesh-orb mesh-2"></div>
        <div className="footer-mesh-orb mesh-3"></div>
      </div>

      <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
        <motion.div
          className="row gy-4 justify-content-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="col-12 mb-2 text-center"
            variants={itemVariants}
          >
            <Link href="/" className="d-inline-block">
              <Image
                src="/images/logo-tymor.png"
                alt="Tymor AI"
                width={160}
                height={60}
                style={{ height: "auto", width: "160px" }}
              />
            </Link>
          </motion.div>

          <motion.div
            className="col-12 text-start px-2 px-md-3"
            variants={itemVariants}
          >
            <div className="mt-5 pt-5 position-relative">
              {/* <h4 className="text-center mb-4 text-white" style={{ opacity: 0.8, textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold" }}>Black Background Variant</h4> */}
              <FooterCreativeCtaBlack lineAccent="#f74a00" variant="yellow" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="row gy-5 align-items-center mt-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-lg-4 col-md-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">
              Our Newsletter
            </h6>
            <div className="newsletter-box-refined">
              <input type="email" placeholder="Your email address" />
              <button type="submit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div className="col-lg-8" variants={itemVariants}>
            <div className="row gy-4">
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Call us
                </span>
                <MagneticLink>
                  <a href="tel:+2135558573" className="footer-contact-link">
                    +(213) 555-8573
                  </a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Drop us a line
                </span>
                <MagneticLink>
                  <a
                    href="mailto:inquiry@tymor.com"
                    className="footer-contact-link"
                  >
                    inquiry@tymor.com
                  </a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Teams
                </span>
                <MagneticLink>
                  <a href="#" className="footer-contact-link">
                    tymor.team
                  </a>
                </MagneticLink>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="footer-marquee-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="footer-marquee-inner">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>HOLOGRAPHIC
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>AI-DRIVEN
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>FUTURE TECH
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>TYMOR CORE
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>VIRTUAL PRESENCE
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="row gy-5 mt-5 pt-5 border-top border-secondary border-opacity-25"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-lg-4" variants={itemVariants}>
            <p className="opacity-50 small" style={{ maxWidth: "320px" }}>
              Pioneering the future of holographic human interaction. Experience
              the next generation of AI-driven virtual presence.
            </p>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Quick Links</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/">Home</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/blogs">Blogs</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/careers">Careers</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Experience</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/projects">Projects</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/solutions">Solutions</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Locations</h6>
            <ul className="list-unstyled footer-nav-list">
              <li className="footer-location-item">Pennsylvania, US</li>
              <li className="footer-location-item">Dubai, UAE</li>
              <li className="footer-location-item">London, UK</li>
              <li className="footer-location-item">Chandigarh, Punjab</li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Support</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/contact">Contact Us</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/demo">Request Demo</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="row pt-5 mt-5 border-top border-secondary border-opacity-25 align-items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <p className="opacity-50 small mb-0">
              © 2026 Tymor, All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <MagneticLink>
              <a
                href="#"
                onClick={scrollToTop}
                className="footer-back-link small text-uppercase opacity-50"
              >
                Back to top ↑
              </a>
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

"use client";

import React, { useRef, useEffect, useCallback, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import "./Banner.css";

function clamp(lo: number, hi: number, v: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

const PROJECTS = [
  {
    client: "Holobox Discovery Meeting",
    sep: "●",
    title: "Strategic Alignment",
    bg: "linear-gradient(to bottom right, #3EC0C0, #848D72, #A1764E, #CC5A2A, #DD7228, #DB7B27)",
    href: "#",
    mDur: 300,
    desc: "Tymor aligns every dimension of your MetaHuman \u2014 appearance, voice, tone, personality, and knowledge \u2014 with your company\u2019s identity, brand standards, and messaging framework. Built deliberately. All consistent. Owned entirely by your identity.",
  },
  {
    client: "Design Your Meta Human",
    sep: "►",
    title: "Built From Scratch",
    bg: "linear-gradient(to bottom right, #3EC0C0, #848D72, #A1764E, #CC5A2A, #DD7228, #DB7B27)",
    href: "#",
    mDur: 300,
    desc: "Every MetaHuman is built from scratch. We start with you. Your brand brief, your audience, your tone, your world.",
  },
  {
    client: "Voice & Speech Production",
    sep: "৹",
    title: "Voice Engineering",
    bg: "linear-gradient(to bottom right, #3EC0C0, #848D72, #A1764E, #CC5A2A, #DD7228, #DB7B27)",
    href: "#",
    mDur: 300,
    desc: "The voice your MetaHuman delivers through the Holobox is the first impression, the trust signal, and the brand moment \u2014 all in one. Our voice engineers build with that responsibility in every session, across every language, for each deployment.",
  },
  {
    client: "Facial Expressions & Movement",
    sep: "৹",
    title: "Living Expressions",
    bg: "linear-gradient(to bottom right, #3EC0C0, #848D72, #A1764E, #CC5A2A, #DD7228, #DB7B27)",
    href: "#",
    mDur: 300,
    desc: "Your MetaHuman doesn\u2019t just talk. It reacts. Tymor programs all 56 facial action units \u2014 every emotion, every lip sync shape, every gesture \u2014 so every conversation through the Holobox feels genuinely alive.",
  },
  {
    client: "AI Brain & Integration",
    sep: "▲",
    title: "Intelligent Core",
    bg: "linear-gradient(to bottom right, #3EC0C0, #848D72, #A1764E, #CC5A2A, #DD7228, #DB7B27)",
    href: "#",
    mDur: 300,
    desc: "What your MetaHuman knows, how it speaks, when it escalates, and where it draws the line. That is not a configuration setting. That is Tymor\u2019s craft.",
  },
];

const N = PROJECTS.length;
const INTRO_WORDS: React.ReactNode[] = [
  "PROCESS\u25BA",
  <span key="is">
    {"\u25A0 IS"}
    <span style={{ marginLeft: "0.05em", letterSpacing: "-0.02em" }}>
      {"\u25AB\u2198"}
    </span>
  </span>,
  "EVERYTHING"
];
const CARDS_START = 0.15;

function getActiveIndex(p: number): number {
  return clamp(
    0,
    N - 1,
    ((Math.max(CARDS_START, p) - CARDS_START) / (1 - CARDS_START)) * (N - 1),
  );
}

type NumSlot = { left: number; top: number; w: number; h: number; z: number };

type NumSlotSet = {
  center: NumSlot;
  leftTop: NumSlot;
  leftBottom: NumSlot;
  rightTop: NumSlot;
  rightBottom: NumSlot;
  hiddenLeft: NumSlot;
  hiddenRight: NumSlot;
};

function getNumSlotSet(vw: number): NumSlotSet {
  if (vw <= 768) {
    return {
      center:      { left: 11,   top: 25, w: 78, h: 50, z: 10 },
      leftTop:     { left: -2,   top: 17, w: 33, h: 16, z: 5 },
      leftBottom:  { left: 2,    top: 66, w: 30, h: 18, z: 4 },
      rightTop:    { left: 70,   top: 21, w: 30, h: 18, z: 4 },
      rightBottom: { left: 70,   top: 66, w: 22, h: 15, z: 4 },
      hiddenLeft:  { left: -40,  top: 40, w: 33, h: 24, z: 1 },
      hiddenRight: { left: 110,  top: 40, w: 22, h: 20, z: 1 },
    };
  }
  if (vw <= 1200) {
    return {
      center:      { left: 18,   top: 20, w: 62, h: 58, z: 10 },
      leftTop:     { left: 1,    top: 16, w: 27, h: 20, z: 5 },
      leftBottom:  { left: 2,    top: 60, w: 26, h: 22, z: 4 },
      rightTop:    { left: 73,   top: 19, w: 26, h: 22, z: 5 },
      rightBottom: { left: 74,   top: 60, w: 16, h: 18, z: 4 },
      hiddenLeft:  { left: -31,  top: 38, w: 27, h: 31, z: 1 },
      hiddenRight: { left: 106,  top: 38, w: 16, h: 26, z: 1 },
    };
  }
  return {
    center:      { left: 27,   top: 20, w: 48, h: 65, z: 10 },
    leftTop:     { left: 5,    top: 25, w: 16, h: 20, z: 5 },
    leftBottom:  { left: 3,    top: 55, w: 20, h: 22, z: 4 },
    rightTop:    { left: 76,   top: 25, w: 20, h: 22, z: 5 },
    rightBottom: { left: 78,   top: 55, w: 14, h: 20, z: 4 },
    hiddenLeft:  { left: -28,  top: 38, w: 25, h: 38, z: 1 },
    hiddenRight: { left: 105,  top: 38, w: 13, h: 31, z: 1 },
  };
}

function getNumSlot(offset: number, cardIdx: number, s: NumSlotSet): NumSlot {
  if (offset === 0) return s.center;
  if (offset === 1 || offset === 2)
    return cardIdx % 2 === 0 ? s.rightBottom : s.rightTop;
  if (offset === -1 || offset === -2)
    return cardIdx % 2 === 0 ? s.leftTop : s.leftBottom;
  return offset < 0 ? s.hiddenLeft : s.hiddenRight;
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function lerpSlot(a: NumSlot, b: NumSlot, t: number): NumSlot {
  const s = smoothstep(t);
  return {
    left: a.left + (b.left - a.left) * s,
    top:  a.top  + (b.top  - a.top)  * s,
    w:    a.w    + (b.w    - a.w)    * s,
    h:    a.h    + (b.h    - a.h)    * s,
    z:    t < 0.5 ? a.z : b.z,
  };
}

function getInterpolatedSlot(
  rawOffset: number,
  cardIdx: number,
  s: NumSlotSet,
): NumSlot {
  const lo = Math.floor(rawOffset);
  const hi = Math.ceil(rawOffset);
  if (lo === hi) return getNumSlot(lo, cardIdx, s);
  return lerpSlot(
    getNumSlot(lo, cardIdx, s),
    getNumSlot(hi, cardIdx, s),
    rawOffset - lo,
  );
}

function MarqueeStrip({
  client,
  sep,
  duration,
}: {
  client: string;
  sep: string;
  duration: number;
}) {
  const chunk = `${client} ${sep} `;
  const text = Array(20).fill(chunk).join("");
  return (
    <div className="bdr-marquee" aria-hidden="true">
      <div
        className="bdr-marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

export default function Banner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotSetRef = useRef<NumSlotSet>(getNumSlotSet(1600));

  useEffect(() => {
    const sync = () => {
      slotSetRef.current = getNumSlotSet(window.innerWidth);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const apply = useCallback(() => {
    const v = smoothProgress.get();
    const rawActive = getActiveIndex(v);
    const slotSet = slotSetRef.current;

    const baseIdx = Math.floor(rawActive);
    const frac = rawActive - baseIdx;
    const HOLD = 0.15; // Reduced from 0.6 for smoother movement
    const moveFrac = frac <= HOLD ? 0 : (frac - HOLD) / (1 - HOLD);
    const posActive = clamp(0, N - 1, baseIdx + moveFrac);

    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const rawOffset = i - rawActive;
      const abs = Math.abs(rawOffset);

      const posOffset = i - posActive;
      const slot = getInterpolatedSlot(posOffset, i, slotSet);

      const staggerDelay = abs * 0.07;
      const fadeStart = 0.08 + staggerDelay;
      const fadeEnd = 0.16 + staggerDelay;
      const deckFade = v <= fadeStart ? 0 : v >= fadeEnd ? 1 : (v - fadeStart) / (fadeEnd - fadeStart);

      const opacity = deckFade;
      const clipInset = clamp(0, 48, (1 - clamp(0, 1, deckFade)) * 48);

      el.style.left   = `${slot.left}vw`;
      el.style.top    = `${slot.top}vh`;
      el.style.width  = `${slot.w}vw`;
      el.style.height = `${slot.h}vh`;
      el.style.zIndex = String(slot.z);
      el.style.opacity = String(opacity);
      el.style.clipPath = `inset(${clipInset}% 0% ${clipInset}% 0%)`;

      const posAbs = Math.abs(posOffset);
      const isNearCenter = posAbs < 0.4;
      el.classList.toggle("bdr-card--center", isNearCenter);

      const titleEl = titleRefs.current[i];
      if (titleEl) {
        const titleReveal = clamp(0, 1, 1 - (posAbs - 0.45) / 0.5);
        titleEl.style.opacity = String(titleReveal);
        titleEl.style.transform = `translateY(${(1 - titleReveal) * 110}%)`;
      }

      const desc = descRefs.current[i];
      if (desc) {
        desc.style.opacity = String(clamp(0, 1, 1 - posAbs * 2.5));
      }
    }
  }, [scrollYProgress]);

  useMotionValueEvent(smoothProgress, "change", apply);

  useLayoutEffect(() => {
    apply();
  }, [apply]);

  const introOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.15],
    [1, 1, 0],
  );
  const introY = useTransform(smoothProgress, [0, 0.15], [0, -80]);
  const w0Y = useTransform(smoothProgress, [0, 0.12], [0, -120]);
  const w1Y = useTransform(smoothProgress, [0, 0.12], [0, 0]);
  const w2Y = useTransform(smoothProgress, [0, 0.12], [0, 120]);
  const wordYs = [w0Y, w1Y, w2Y];
  const sceneOpacity = useTransform(smoothProgress, [0.08, 0.16], [0, 1]);

  return (
    <section ref={sectionRef} className="bdr-section" id="process">
      <div className="bdr-sticky">
        <motion.div
          className="bdr-intro"
          style={{ opacity: introOpacity, y: introY }}
          aria-hidden="true"
        >
          {INTRO_WORDS.map((word, i) => (
            <motion.div
              key={i}
              className="bdr-intro-word-wrap"
              style={{ y: wordYs[i] }}
            >
              <div
                className="bdr-intro-word"
                style={{ animationDelay: `${0.1 + i * 0.15}s` }}
              >
                {word}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="bdr-scene"
          style={{ opacity: sceneOpacity }}
          aria-hidden="true"
        >
          <div className="bdr-scene-tc">
            <span>PROCESS</span>
            <span>IS</span>
          </div>
          <div className="bdr-scene-bc">
            <span className="bdr-scene-arrow">&rarr;</span>
            <span>EVERYTHING</span>
            <span className="bdr-scene-arrow">&larr;</span>
          </div>
        </motion.div>

        <h2 className="sr-only">Process is everything</h2>

        <div className="bdr-deck">
          {PROJECTS.map((project, i) => (
            <div
              key={project.client}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="bdr-card"
              style={{ opacity: 0 }}
            >
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bdr-card-link"
              >
                <div
                  className="bdr-card-bg"
                  style={{ background: project.bg }}
                />
                <div className="bdr-card-content-layer">
                  {/* Number badge — top left */}
                  <span className="bdr-card-number">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="bdr-card-marquee-layer">
                    <MarqueeStrip
                      client={project.client}
                      sep={project.sep}
                      duration={project.mDur}
                    />
                  </div>
                  <span
                    ref={(el) => { titleRefs.current[i] = el; }}
                    className="bdr-card-title"
                    style={{ opacity: 0, transform: "translateY(110%)" }}
                  >
                    {project.title}
                  </span>
                  <p
                    ref={(el) => { descRefs.current[i] = el; }}
                    className="bdr-card-desc"
                    style={{ opacity: 0 }}
                  >
                    {project.desc}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

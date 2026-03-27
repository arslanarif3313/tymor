"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
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
    bg: "#E91E8C",
    href: "#",
    mDur: 4,
    desc: "Tymor aligns every dimension of your MetaHuman \u2014 appearance, voice, tone, personality, and knowledge \u2014 with your company\u2019s identity, brand standards, and messaging framework. Built deliberately. All consistent. Owned entirely by your identity.",
  },
  {
    client: "Design Your Meta Human",
    sep: "►",
    bg: "#FFD600",
    href: "#",
    mDur: 4,
    desc: "Every MetaHuman is built from scratch. We start with you. Your brand brief, your audience, your tone, your world.",
  },
  {
    client: "Voice & Speech Production",
    sep: "৹",
    bg: "#E91E8C",
    href: "#",
    mDur: 4,
    desc: "The voice your MetaHuman delivers through the Holobox is the first impression, the trust signal, and the brand moment \u2014 all in one. Our voice engineers build with that responsibility in every session, across every language, for each deployment.",
  },
  {
    client: "Facial Expressions & Movement",
    sep: "৹",
    bg: "#FFD600",
    href: "#",
    mDur: 4,
    desc: "Your MetaHuman doesn\u2019t just talk. It reacts. Tymor programs all 56 facial action units \u2014 every emotion, every lip sync shape, every gesture \u2014 so every conversation through the Holobox feels genuinely alive.",
  },
  {
    client: "AI Brain & Integration",
    sep: "▲",
    bg: "#E91E8C",
    href: "#",
    mDur: 4,
    desc: "What your MetaHuman knows, how it speaks, when it escalates, and where it draws the line. That is not a configuration setting. That is Tymor\u2019s craft.",
  },
];

const N = PROJECTS.length;
const INTRO_WORDS = ["PR\u2460CESS\u25BA", "\u2580 IS \u25AB\u2198", "EVERYTHING"];
const CARDS_START = 0.15;

function getActiveIndex(p: number): number {
  return clamp(
    0,
    N - 1,
    ((Math.max(CARDS_START, p) - CARDS_START) / (1 - CARDS_START)) * (N - 1),
  );
}

/*
  Slot positions (all in vw / vh from the sticky container).
  Matches the 3-column grid visually:
    left col (2 stacked) | center (hero) | right col (2 stacked)

  offset  0  → CENTER
  offset -1  → LEFT BOTTOM  (card that just left center)
  offset -2  → LEFT TOP     (card before that)
  offset +1  → RIGHT TOP    (next card to enter center)
  offset +2  → RIGHT BOTTOM (card after that)
  else       → off-screen hidden
*/
type Slot = { left: string; top: string; w: string; h: string; z: number };

const S_CENTER: Slot = { left: "22vw", top: "10vh", w: "56vw", h: "74vh", z: 10 };
const S_LT: Slot = { left: "2.5vw", top: "10vh", w: "17.5vw", h: "35vh", z: 5 };
const S_LB: Slot = { left: "2.5vw", top: "50vh", w: "17.5vw", h: "35vh", z: 4 };
const S_RT: Slot = { left: "80vw", top: "10vh", w: "17.5vw", h: "35vh", z: 5 };
const S_RB: Slot = { left: "80vw", top: "50vh", w: "17.5vw", h: "35vh", z: 4 };
const S_HL: Slot = { left: "-22vw", top: "30vh", w: "17.5vw", h: "35vh", z: 1 };
const S_HR: Slot = { left: "102vw", top: "30vh", w: "17.5vw", h: "35vh", z: 1 };

function getSlot(offset: number, cardIndex: number): Slot {
  if (offset === 0) return S_CENTER;
  if (offset === 1 || offset === 2) {
    return cardIndex % 2 === 0 ? S_RB : S_RT;
  }
  if (offset === -1 || offset === -2) {
    return cardIndex % 2 === 0 ? S_LT : S_LB;
  }
  return offset < 0 ? S_HL : S_HR;
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

function ProjectCard({
  project,
  slot,
  isCenter,
  isVisible,
}: {
  project: (typeof PROJECTS)[number];
  slot: Slot;
  isCenter: boolean;
  isVisible: boolean;
}) {
  const isHidden = slot.z <= 1;
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isCenter && isVisible) {
      timerRef.current = setTimeout(() => {
        el.classList.add("bdr-card--revealed");
      }, 1500);
    } else {
      el.classList.remove("bdr-card--revealed");
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isCenter, isVisible]);

  const cls = `bdr-card ${isCenter ? "bdr-card--active" : "bdr-card--side"}`;

  return (
    <div
      ref={cardRef}
      className={cls}
      style={{
        left: slot.left,
        top: slot.top,
        width: slot.w,
        height: slot.h,
        zIndex: slot.z,
        opacity: isVisible && !isHidden ? 1 : 0,
        clipPath: isVisible
          ? "inset(0% 0% round 16px)"
          : "inset(48% 0% round 999px)",
      }}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="bdr-card-link"
      >
        <div
          className="bdr-card-bg"
          style={{ backgroundColor: project.bg }}
        />
        <div className="bdr-card-content-layer">
          <div className="bdr-card-marquee-layer">
            <MarqueeStrip
              client={project.client}
              sep={project.sep}
              duration={project.mDur}
            />
          </div>
          <p className="bdr-card-desc">{project.desc}</p>
        </div>
      </a>
    </div>
  );
}

export default function Banner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [deckVisible, setDeckVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIdx(Math.round(getActiveIndex(v)));
    setDeckVisible(v > 0.10);
  });

  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15],
    [1, 1, 0],
  );
  const introY = useTransform(scrollYProgress, [0, 0.15], [0, -80]);
  const w0Y = useTransform(scrollYProgress, [0, 0.12], [0, -120]);
  const w1Y = useTransform(scrollYProgress, [0, 0.12], [0, 0]);
  const w2Y = useTransform(scrollYProgress, [0, 0.12], [0, 120]);
  const wordYs = [w0Y, w1Y, w2Y];
  const sceneOpacity = useTransform(scrollYProgress, [0.08, 0.16], [0, 1]);

  return (
    <section ref={ref} className="bdr-section" id="process">
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
          <span className="bdr-scene-tl">PROCESS</span>
          <span className="bdr-scene-tr">IS</span>
          <div className="bdr-scene-bc">
            <span className="bdr-scene-arrow">&rarr;</span>
            <span>EVERYTHING</span>
            <span className="bdr-scene-arrow">&larr;</span>
          </div>
        </motion.div>

        <h2 className="sr-only">COMPLEX MADE COMPELLING</h2>

        <div className="bdr-deck">
          {PROJECTS.map((project, i) => {
            const offset = i - activeIdx;
            return (
              <ProjectCard
                key={project.client}
                project={project}
                slot={getSlot(offset, i)}
                isCenter={offset === 0}
                isVisible={deckVisible}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

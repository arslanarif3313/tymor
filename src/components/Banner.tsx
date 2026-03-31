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
    bg: "#ff4fa3",
    href: "#",
    mDur: 4,
    desc: "Tymor aligns every dimension of your MetaHuman \u2014 appearance, voice, tone, personality, and knowledge \u2014 with your company\u2019s identity, brand standards, and messaging framework. Built deliberately. All consistent. Owned entirely by your identity.",
  },
  {
    client: "Design Your Meta Human",
    sep: "►",
    bg: "#ff4fa3",
    href: "#",
    mDur: 4,
    desc: "Every MetaHuman is built from scratch. We start with you. Your brand brief, your audience, your tone, your world.",
  },
  {
    client: "Voice & Speech Production",
    sep: "৹",
    bg: "#ff4fa3",
    href: "#",
    mDur: 4,
    desc: "The voice your MetaHuman delivers through the Holobox is the first impression, the trust signal, and the brand moment \u2014 all in one. Our voice engineers build with that responsibility in every session, across every language, for each deployment.",
  },
  {
    client: "Facial Expressions & Movement",
    sep: "৹",
    bg: "#ff4fa3",
    href: "#",
    mDur: 4,
    desc: "Your MetaHuman doesn\u2019t just talk. It reacts. Tymor programs all 56 facial action units \u2014 every emotion, every lip sync shape, every gesture \u2014 so every conversation through the Holobox feels genuinely alive.",
  },
  {
    client: "AI Brain & Integration",
    sep: "▲",
    bg: "#ff4fa3",
    href: "#",
    mDur: 4,
    desc: "What your MetaHuman knows, how it speaks, when it escalates, and where it draws the line. That is not a configuration setting. That is Tymor\u2019s craft.",
  },
];

const N = PROJECTS.length;
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

type SlotSet = {
  center: Slot;
  leftTop: Slot;
  leftBottom: Slot;
  rightTop: Slot;
  rightBottom: Slot;
  hiddenLeft: Slot;
  hiddenRight: Slot;
};

function getSlotSet(viewportWidth: number): SlotSet {
  if (viewportWidth <= 768) {
    return {
      center: { left: "11vw", top: "20vh", w: "78vw", h: "50vh", z: 10 },
      leftTop: { left: "-2vw", top: "12vh", w: "33vw", h: "24vh", z: 5 },
      leftBottom: { left: "-2vw", top: "62vh", w: "33vw", h: "24vh", z: 4 },
      rightTop: { left: "76vw", top: "16vh", w: "22vw", h: "20vh", z: 5 },
      rightBottom: { left: "76vw", top: "62vh", w: "22vw", h: "20vh", z: 4 },
      hiddenLeft: { left: "-40vw", top: "35vh", w: "33vw", h: "24vh", z: 1 },
      hiddenRight: { left: "110vw", top: "35vh", w: "22vw", h: "20vh", z: 1 },
    };
  }

  if (viewportWidth <= 1200) {
    return {
      center: { left: "18vw", top: "15vh", w: "62vw", h: "62vh", z: 10 },
      leftTop: { left: "1vw", top: "11vh", w: "27vw", h: "31vh", z: 5 },
      leftBottom: { left: "1vw", top: "55vh", w: "27vw", h: "31vh", z: 4 },
      rightTop: { left: "79vw", top: "14vh", w: "16vw", h: "26vh", z: 5 },
      rightBottom: { left: "79vw", top: "55vh", w: "16vw", h: "26vh", z: 4 },
      hiddenLeft: { left: "-31vw", top: "33vh", w: "27vw", h: "31vh", z: 1 },
      hiddenRight: { left: "106vw", top: "33vh", w: "16vw", h: "26vh", z: 1 },
    };
  }

  return {
    center: { left: "30vw", top: "18vh", w: "46vw", h: "58vh", z: 10 },
    leftTop: { left: "2vw", top: "10vh", w: "25vw", h: "38vh", z: 5 },
    leftBottom: { left: "2vw", top: "52vh", w: "25vw", h: "38vh", z: 4 },
    rightTop: { left: "81vw", top: "13vh", w: "13vw", h: "31vh", z: 5 },
    rightBottom: { left: "81vw", top: "52vh", w: "13vw", h: "31vh", z: 4 },
    hiddenLeft: { left: "-28vw", top: "32vh", w: "25vw", h: "38vh", z: 1 },
    hiddenRight: { left: "105vw", top: "32vh", w: "13vw", h: "31vh", z: 1 },
  };
}

function getSlot(offset: number, cardIndex: number, slotSet: SlotSet): Slot {
  if (offset === 0) return slotSet.center;
  if (offset === 1 || offset === 2) {
    return cardIndex % 2 === 0 ? slotSet.rightBottom : slotSet.rightTop;
  }
  if (offset === -1 || offset === -2) {
    return cardIndex % 2 === 0 ? slotSet.leftTop : slotSet.leftBottom;
  }
  return offset < 0 ? slotSet.hiddenLeft : slotSet.hiddenRight;
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
  const [viewportWidth, setViewportWidth] = useState(1600);

  useEffect(() => {
    const updateViewport = () => setViewportWidth(window.innerWidth);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActiveIdx(Math.round(getActiveIndex(v)));
    setDeckVisible(v > 0.10);
  });

  const sceneOpacity = useTransform(scrollYProgress, [0.16, 0.22], [0, 1]);
  const slotSet = getSlotSet(viewportWidth);

  return (
    <section ref={ref} className="bdr-section" id="process">
      <div className="bdr-sticky">
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
                slot={getSlot(offset, i, slotSet)}
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

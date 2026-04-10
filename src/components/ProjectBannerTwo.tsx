"use client";

import { useRef, useLayoutEffect, useCallback, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useMotionTemplate,
  MotionValue,
} from "framer-motion";
import { GeistSans } from "geist/font/sans";

/**
 * Layout (percentages of container):
 *
 *  ┌─────────────────────┬──────────┬──────────┐
 *  │                     │  IMG-3   │          │
 *  │       IMG-1         │ (inner)  │  IMG-4   │
 *  │    (top-left)       ├──────────┤ (outer,  │
 *  │                     │          │  tall)   │
 *  ├─────────────────────┤  IMG-5   │          │
 *  │       IMG-2         │ (inner)  ├──────────┤
 *  │   (bottom-left)     ├──────────┤  IMG-6   │
 *  │                     │  (gap)   │ (outer)  │
 *  └─────────────────────┴──────────┴──────────┘
 *
 * All images animate FROM their off-screen startX/startY TO (0%, 0%)
 * which is their natural CSS-anchored position.
 */

const GAP = 1.2;

const SOLUTION_IMAGES = [
  {
    id: 1,
    src: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
    alt: "Real Estate",
    label: "REAL ESTATE",
    pos: {
      top: `${GAP}%`,
      left: `${GAP}%`,
      width: `${62 - GAP * 2}%`,
      height: `${64 - GAP}%`,
    },
    startX: 220,
    startY: 100,
  },
  {
    id: 2,
    src: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
    alt: "Hospitality",
    label: "HOSPITALITY",
    pos: {
      bottom: `${GAP}%`,
      left: `${GAP}%`,
      width: `${62 - GAP * 2}%`,
      height: `${35 - GAP}%`,
    },
    startX: 220,
    startY: -80,
  },
  {
    id: 3,
    src: "/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg",
    alt: "Holobox",
    label: "HOLOBOX",
    pos: {
      top: `${GAP}%`,
      left: `${62 + GAP}%`,
      width: `${19 - GAP * 2}%`,
      height: `${48 - GAP}%`,
    },
    startX: -215,
    startY: 100,
  },
  {
    id: 4,
    src: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
    alt: "Healthcare",
    label: "HEALTHCARE",
    pos: {
      top: `${GAP}%`,
      right: `${GAP}%`,
      width: `${19 - GAP * 2}%`,
      height: `${64 - GAP}%`,
    },
    startX: -215,
    startY: -100,
  },
  {
    id: 5,
    src: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg",
    alt: "Marketing",
    label: "MARKETING",
    pos: {
      bottom: `${GAP}%`,
      left: `${62 + GAP}%`,
      width: `${19 - GAP * 2}%`,
      height: `${50 - GAP}%`,
    },
    startX: 0,
    startY: 250,
  },
  {
    id: 6,
    src: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
    alt: "Corporate",
    label: "CORPORATE",
    pos: {
      bottom: `${GAP}%`,
      right: `${GAP}%`,
      width: `${19 - GAP * 2}%`,
      height: `${35 - GAP}%`,
    },
    startX: -215,
    startY: -80,
  },
] as const;

const ANIM_START = 0.15;
const ANIM_END = 0.95;
const ANIM_RANGE = ANIM_END - ANIM_START;
const TEXT_FADE_START = ANIM_END - 0.14;
const TEXT_FADE_END = ANIM_END - 0.02;

function SolutionImagesLayer({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const apply = useCallback(() => {
    const v = scrollProgress.get();
    const t =
      v <= ANIM_START ? 0 : v >= ANIM_END ? 1 : (v - ANIM_START) / ANIM_RANGE;

    for (let i = 0; i < SOLUTION_IMAGES.length; i++) {
      const el = refs.current[i];
      if (!el) continue;
      const cfg = SOLUTION_IMAGES[i];
      // Each image starts at (startX%, startY%) and ends at (0%, 0%) — its natural CSS position
      const dx = 0 - cfg.startX;
      const dy = 0 - cfg.startY;
      el.style.transform = `translate3d(${cfg.startX + t * dx}%, ${cfg.startY + t * dy}%, 0px)`;
    }
  }, [scrollProgress]);

  useMotionValueEvent(scrollProgress, "change", apply);

  useLayoutEffect(() => {
    apply();
  }, [apply]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[min(85vw,56rem)] h-[min(70vh,34rem)]">
        {SOLUTION_IMAGES.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="group absolute overflow-hidden rounded-sm shadow-lg"
            style={{
              ...img.pos,
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "auto"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-3 py-2.5 sm:px-4 sm:py-3">
              <span className="text-[9px] font-bold tracking-[0.12em] text-white drop-shadow-md sm:text-[11px]">
                {img.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileProjectBannerTwo() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="text-center mb-12">
        <h2
          className={`text-3xl font-semibold leading-tight mb-6 tracking-tighter ${GeistSans.className}`}
          style={{ color: "rgb(228, 41, 15)", fontWeight: 600 }}
        >
          YOUR INDUSTRY,
          <br />
          POWERED BY
          <br />
          HOLOBOX
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            type="button"
            className="px-5 py-2 text-xs font-bold text-white shadow-lg rounded-full w-full sm:w-auto max-w-xs"
            style={{ backgroundColor: "#fc0808", border: "none" }}
          >
            Explore Our Holobox Further
          </button>
          <button
            type="button"
            className="px-5 py-2 text-xs font-semibold text-white shadow-lg rounded-full w-full sm:w-auto max-w-xs"
            style={{ backgroundColor: "#fc0808", border: "none" }}
          >
            Get A Demo
          </button>
        </div>
      </div>
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3">
        {SOLUTION_IMAGES.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-[3/4] overflow-hidden rounded-none shadow-md"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">
                {img.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProjectBannerTwo() {
  const isMobile = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(max-width: 1990px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 990px)").matches,
    () => false,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const titleOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.12, TEXT_FADE_START, TEXT_FADE_END],
    [0, 1, 1, 0],
  );

  const titleFontSizePx = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [120, 120, 56, 56],
  );
  const titleLineHeightPx = useTransform(
    scrollYProgress,
    [0, ANIM_START, ANIM_END, 1],
    [132, 132, 62, 62],
  );
  const titleFontSize = useMotionTemplate`${titleFontSizePx}px`;
  const titleLineHeight = useMotionTemplate`${titleLineHeightPx}px`;

  const buttonOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.18, TEXT_FADE_START, TEXT_FADE_END],
    [0, 1, 1, 0],
  );
  const buttonY = useTransform(scrollYProgress, [0.1, 0.18], [30, 0]);

  if (isMobile) {
    return <MobileProjectBannerTwo />;
  }

  return (
    <section style={{ overflow: "clip", width: "100%", zIndex: 1100, position: "relative" }}>
      <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-svh w-full bg-white">
          <div className="relative h-full w-full">
            <motion.div
              style={{ opacity: titleOpacity, willChange: "opacity" }}
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
            >
              <motion.h2
                className={`mb-8 max-w-[min(100%,22ch)] font-semibold normal-case tracking-[-0.12rem] ${GeistSans.className}`}
                style={{
                  fontSize: titleFontSize,
                  lineHeight: titleLineHeight,
                  fontWeight: 600,
                  fontStyle: "normal",
                  color: "rgb(228, 41, 15)",
                  willChange: "font-size, line-height",
                }}
              >
                YOUR INDUSTRY, <br /> POWERED BY <br />
                HOLOBOX
              </motion.h2>
              <div className="flex flex-row flex-wrap items-center justify-center gap-2.5">
                <motion.button
                  type="button"
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: "#fc0808",
                    border: "none",
                    borderRadius: "100px",
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#d60707" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 cursor-pointer px-7 py-2.5 text-md font-bold text-white"
                >
                  Explore Our Holobox Further
                </motion.button>
                <motion.button
                  type="button"
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: "#fc0808",
                    border: "none",
                    borderRadius: "100px",
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#d60707" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 cursor-pointer px-7 py-2.5 text-sm font-semibold text-white shadow-lg"
                >
                  Get A Demo
                </motion.button>
              </div>
            </motion.div>

            <div className="absolute inset-0 z-0">
              <SolutionImagesLayer scrollProgress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

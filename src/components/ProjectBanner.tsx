"use client";

import { useRef, useLayoutEffect, useCallback, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

/** Image scroll paths / collection from Archive — headline & CTAs stay site-specific. */
const SOLUTION_IMAGES = [
  {
    id: 1,
    src: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
    alt: "Real Estate",
    label: "Real Estate",
    positionClass: "top-0 left-0",
    startX: -250,
    startY: -250,
    endX: 220,
    endY: 100,
  },
  {
    id: 2,
    src: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
    alt: "Hospitality",
    label: "Hospitality",
    positionClass: "top-[38%] left-0",
    startX: -250,
    startY: 0,
    endX: 210,
    endY: 0,
  },
  {
    id: 3,
    src: "/Tymore%20Ai%20with%20Holobox/3.3-—-Education.jpg",
    alt: "Education",
    label: "Education",
    positionClass: "bottom-0 left-0",
    startX: -250,
    startY: 250,
    endX: 220,
    endY: -100,
  },
  {
    id: 6,
    src: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg",
    alt: "Retail",
    label: "Retail",
    positionClass: "top-0 right-0",
    startX: 200,
    startY: -300,
    endX: -250,
    endY: 100,
  },
  {
    id: 4,
    src: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
    alt: "Healthcare",
    label: "Healthcare",
    positionClass: "top-0 right-0",
    startX: 0,
    startY: -250,
    endX: -215,
    endY: 100,
  },
  {
    id: 7,
    src: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg",
    alt: "Marketing",
    label: "Marketing",
    positionClass: "bottom-0 right-0",
    startX: 200,
    startY: 300,
    endX: -250,
    endY: -100,
  },
  {
    id: 5,
    src: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
    alt: "Corporate",
    label: "Corporate",
    positionClass: "bottom-0 right-0",
    startX: 0,
    startY: 250,
    endX: -220,
    endY: -100,
  },
] as const;

const ANIM_START = 0.15;
const ANIM_END = 0.95;
const ANIM_RANGE = ANIM_END - ANIM_START;

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
      const dx = cfg.endX - cfg.startX;
      const dy = cfg.endY - cfg.startY;
      el.style.transform = `translate3d(${cfg.startX + t * dx}%, ${cfg.startY + t * dy}%, 0px)`;
    }
  }, [scrollProgress]);

  useMotionValueEvent(scrollProgress, "change", apply);

  useLayoutEffect(() => {
    apply();
  }, [apply]);

  return (
    <>
      {SOLUTION_IMAGES.map((img, i) => (
        <div
          key={img.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`group absolute ${img.positionClass} w-full max-w-62.5 xl:max-w-80 2xl:max-w-96 h-auto overflow-hidden rounded-none shadow-2xl transition-shadow duration-500 hover:shadow-[0_25px_80px_rgba(0,0,0,0.35)]`}
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent px-3 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white drop-shadow-md sm:text-xs">
              {img.label}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}

function MobileProjectBanner() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-neutral-900 leading-tight mb-6 tracking-tighter">
          YOUR INDUSTRY,
          <br />
          POWERED BY
          <br />
          HOLOBOX
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            className="px-8 py-3 text-sm font-bold text-white shadow-lg rounded-full w-full sm:w-auto max-w-xs"
            style={{ backgroundColor: "#c8102e", border: "none" }}
          >
            Explore Our Holobox Further
          </button>
          <button
            type="button"
            className="px-8 py-3 text-sm font-semibold text-white shadow-lg rounded-full w-full sm:w-auto max-w-xs"
            style={{ backgroundColor: "#c8102e", border: "none" }}
          >
            Get A Demo
          </button>
        </div>
      </div>
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-4">
        {SOLUTION_IMAGES.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-3/4 overflow-hidden rounded-none shadow-md"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-3">
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

export default function ProjectBanner() {
  const isMobile = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(max-width: 990px)");
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

  const titleScale = useTransform(scrollYProgress, [0.05, 0.15, 0.39, 0.95], [0.72, 1, 1, 0.88]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);

  const buttonOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.1, 0.18], [30, 0]);

  if (isMobile) {
    return <MobileProjectBanner />;
  }

  return (
    <section style={{ overflow: "clip", width: "100%", zIndex: 1100, position: "relative" }}>
      <div ref={containerRef} className="relative" style={{ height: "500vh" }}>
        <div className="sticky top-0 h-svh w-full bg-white">
          <div className="relative h-full w-full">
            <motion.div
              style={{ opacity: titleOpacity, scale: titleScale, willChange: "transform" }}
              className="absolute inset-0 z-0 flex flex-col items-center justify-center px-4 text-center"
            >
              <h2 className="mb-8 text-5xl md:text-6xl lg:text-[4.25rem] xl:!text-[4.85rem] !font-black !text-neutral-900 leading-[1.05] tracking-[-0.12rem]">
                YOUR INDUSTRY, <br /> POWERED BY <br />
                HOLOBOX
              </h2>
              <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                <motion.button
                  type="button"
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: "#c8102e",
                    border: "none",
                    borderRadius: "100px",
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#a30d24" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 cursor-pointer px-12 py-4 text-base font-bold text-white shadow-lg"
                >
                  Explore Our Holobox Further
                </motion.button>
                <motion.button
                  type="button"
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: "#c8102e",
                    border: "none",
                    borderRadius: "100px",
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: "#a30d24" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 cursor-pointer px-12 py-4 text-base font-semibold text-white shadow-lg"
                >
                  Get A Demo
                </motion.button>
              </div>
            </motion.div>

            <SolutionImagesLayer scrollProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

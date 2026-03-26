"use client";

import { useRef, useLayoutEffect, useCallback, useSyncExternalStore } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';

const SOLUTION_IMAGES = [
  {
    id: 1,
    src: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
    alt: "Real Estate",
    label: "Real Estate",
    positionClass: "top-0 left-0",
    startX: -250, startY: -250,
    endX: 220, endY: 100,
  },
  {
    id: 2,
    src: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
    alt: "Hospitality",
    label: "Hospitality",
    positionClass: "top-[38%] left-0",
    startX: -250, startY: 0,
    endX: 210, endY: 0,
  },
  {
    id: 3,
    src: "/Tymore%20Ai%20with%20Holobox/3.3-—-Education.jpg",
    alt: "Education",
    label: "Education",
    positionClass: "bottom-0 left-0",
    startX: -250, startY: 250,
    endX: 220, endY: -100,
  },
  {
    id: 6,
    src: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg",
    alt: "Retail",
    label: "Retail",
    positionClass: "top-0 right-0",
    startX: 0, startY: -250,
    endX: -217, endY: 100,
  },
  {
    id: 4,
    src: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
    alt: "Healthcare",
    label: "Healthcare",
    positionClass: "top-0 right-0",
    startX: 50, startY: -250,
    endX: -290, endY: 119,
  },
  {
    id: 7,
    src: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg",
    alt: "Marketing",
    label: "Marketing",
    positionClass: "bottom-0 right-0",
    startX: 250, startY: 300,
    endX: -290, endY: -113.5,
  },
  {
    id: 5,
    src: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
    alt: "Government",
    label: "Government",
    positionClass: "bottom-0 right-0",
    startX: 0, startY: 250,
    endX: -217, endY: -94,
  },
] as const;

const ANIM_START = 0.15;
const ANIM_END = 0.95;
const ANIM_RANGE = ANIM_END - ANIM_START;

/** One subscription, synchronous DOM updates — matches Framer scroll + inertial scroll without one-frame RAF lag. */
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
          className={`absolute ${img.positionClass} w-full max-w-62.5 xl:max-w-80 h-auto rounded-xl overflow-hidden shadow-2xl group`}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="absolute top-0 inset-x-0 bg-linear-to-b from-black/70 via-black/30 to-transparent p-4 z-10 text-center">
            <span className="text-white text-sm xl:text-base font-extrabold uppercase tracking-widest drop-shadow-md">
              {img.label}
            </span>
          </div>
          <img
            src={img.src}
            alt={img.alt}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "auto"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      ))}
    </>
  );
}

function MobileProjectBanner() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-black leading-tight mb-6 tracking-tighter">
          YOUR INDUSTRY POWERED BY<br />HOLOBOX TECHNOLOGY
        </h2>
        <button
          className="px-10 py-3 text-base font-bold text-white shadow-lg"
          style={{ backgroundColor: '#FF7A00', border: 'none', borderRadius: '100px' }}
        >
          Get a Demo
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {SOLUTION_IMAGES.map((img) => (
          <div
            key={img.id}
            className="relative aspect-3/4 rounded-xl overflow-hidden shadow-md"
          >
            <div className="absolute top-0 inset-x-0 bg-linear-to-b from-black/80 to-transparent p-3 z-10 text-center">
              <span className="text-[10px] font-bold uppercase text-white tracking-wider">{img.label}</span>
            </div>
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProjectBanner() {
  const isMobile = useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined') return () => { };
      const mq = window.matchMedia('(max-width: 990px)');
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 990px)').matches,
    () => false,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const titleScale = useTransform(scrollYProgress, [0.05, 0.15, 0.39, 0.95], [0.85, 1, 1, 0.85]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);

  const buttonOpacity = useTransform(scrollYProgress, [0.10, 0.18], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.10, 0.18], [30, 0]);

  if (isMobile) {
    return <MobileProjectBanner />;
  }

  return (
    <section
      style={{ overflow: 'clip', width: '100%', zIndex: 1100, position: 'relative' }}
    >
      <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-svh w-full bg-white">
          <div className="relative h-full w-full">
            <motion.div
              style={{ opacity: titleOpacity, scale: titleScale, willChange: 'transform' }}
              className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-4"
            >
              <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] xl:!text-[5.2rem] !font-bold !text-red-500 leading-[1.1] mb-8 tracking-[-0.160rem]">
                YOUR INDUSTRY, <br /> POWERED BY <br />HOLOBOX
              </h2>
              <div className="flex flex-row items-center justify-center gap-4">
                <motion.button
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: '#0099bf',
                    border: 'none',
                    borderRadius: '100px',
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: '#0099bf' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 text-base mt-2 font-bold text-white shadow-lg cursor-pointer"
                >
                  Explore Our Holobox Further
                </motion.button>
                <motion.button
                  style={{
                    opacity: buttonOpacity,
                    y: buttonY,
                    backgroundColor: '#0099bf',
                    border: 'none',
                    borderRadius: '100px',
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: '#0099bf' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 text-base mt-2 font-semibold text-white shadow-lg cursor-pointer"
                >
                  Get A Demo
                </motion.button>
              </div>
            </motion.div>

            <SolutionImagesLayer scrollProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section >
  );
}
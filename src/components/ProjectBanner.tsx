// "use client";

// import { useRef, useState, useEffect } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';

// const CARDS = [
//   { id: 1, image: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg", label: "Real Estate", angle: 0 },
//   { id: 2, image: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg", label: "Hospitality", angle: 45 },
//   { id: 3, image: "/Tymore%20Ai%20with%20Holobox/3.3-—-Education.jpg", label: "Education", angle: 90 },
//   { id: 4, image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg", label: "Retail", angle: 135 },
//   { id: 5, image: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg", label: "Healthcare", angle: 180 },
//   { id: 6, image: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg", label: "Marketing", angle: 225 },
//   { id: 7, image: "/Tymore%20Ai%20with%20Holobox/3.7-—-Government.jpg", label: "Government", angle: 270 },
//   { id: 8, image: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg", label: "Corporate/Executive", angle: 315 },
// ];

// function BloomCard({ angle, image, label, scrollProgress, groupRotation, isMobile }: { angle: number; image: string; label: string; scrollProgress: any; groupRotation: any; isMobile: boolean }) {
//   // Continuous expansion: images move "far and far" throughout the scroll
//   const radius = useTransform(scrollProgress, [0.1, 1], [0, isMobile ? 300 : 650]);
//   const scale = useTransform(scrollProgress, [0.1, 0.4], [0.4, 1]);

//   const angleRad = (angle - 90) * (Math.PI / 180);
//   const x = useTransform(radius, (r) => Math.cos(angleRad) * r);
//   const y = useTransform(radius, (r) => Math.sin(angleRad) * r);

//   // Counter-rotate each card to stay perfectly straight
//   const counterRotate = useTransform(groupRotation, (r: number) => -r);

//   return (
//     <motion.div
//       style={{ x, y, scale, rotate: counterRotate, zIndex: 9999 }}
//       className={`${isMobile ? "w-[140px] h-[200px]" : "w-[220px] h-[300px]"} absolute rounded-2xl overflow-hidden shadow-bloom-card`}
//     >
//       <img src={image} alt={label} className="w-full h-full object-cover" />
//       <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
//         <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">{label}</span>
//       </div>
//     </motion.div>
//   );
// }

// function MobileProjectBanner() {
//   return (
//     <section className="bg-white py-20 px-4">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl font-black text-black leading-tight mb-6 tracking-tighter">
//           YOUR INDUSTRY POWERED BY<br />HOLOBOX TECHNOLOGY
//         </h2>
//         <button
//           className="px-10 py-3 text-base font-bold text-white shadow-lg"
//           style={{ backgroundColor: '#FF7A00', border: 'none', borderRadius: '100px' }}
//         >
//           Get a Demo
//         </button>
//       </div>
//       <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
//         {CARDS.map((card) => (
//           <div key={card.id} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
//             <img src={card.image} alt={card.label} className="w-full h-full object-cover" />
//             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//               <span className="text-[10px] font-bold uppercase text-white">{card.label}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default function ProjectBanner() {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 991);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end end"],
//   });

//   // Original Desktop Animation Values
//   const groupRotate = useTransform(scrollYProgress, [0.1, 1], [0, 540]);
//   const centerOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
//   const centerScale = useTransform(scrollYProgress, [0.5, 0.7], [0.85, 1]);

//   if (isMobile) {
//     return <MobileProjectBanner />;
//   }

//   return (
//     <div ref={containerRef} className="relative h-[400vh] bloom-container" style={{ zIndex: 1100 }}>
//       <div className="sticky top-0 flex h-svh w-full items-center justify-center bg-white overflow-hidden" style={{ zIndex: 1100 }}>
//         <motion.div
//           style={{ rotate: groupRotate }}
//           className="relative flex items-center justify-center"
//         >
//           {CARDS.map((card) => (
//             <BloomCard
//               key={card.id}
//               angle={card.angle}
//               image={card.image}
//               label={card.label}
//               scrollProgress={scrollYProgress}
//               groupRotation={groupRotate}
//               isMobile={false}
//             />
//           ))}
//         </motion.div>

//         <motion.div
//           style={{ opacity: centerOpacity, scale: centerScale }}
//           className="absolute z-20 flex flex-col items-center text-center max-w-2xl px-4 pointer-events-auto"
//         >
//           <h2 className="text-3xl md:text-5xl font-black text-black leading-tight mb-8 tracking-tighter">
//             YOUR INDUSTRY POWERED BY<br />HOLOBOX TECHNOLOGY
//           </h2>
//           <motion.button
//             whileHover={{ scale: 1.05, backgroundColor: '#e66e00' }}
//             whileTap={{ scale: 0.95 }}
//             className="px-12 py-4 text-base font-bold text-white transition-all shadow-lg"
//             style={{ backgroundColor: '#FF7A00', border: 'none', borderRadius: '100px' }}
//           >
//             Get a Demo
//           </motion.button>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

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
    startX: 200, startY: -300,
    endX: -250, endY: 100,
  },
  {
    id: 4,
    src: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
    alt: "Healthcare",
    label: "Healthcare",
    positionClass: "top-0 right-0",
    startX: 0, startY: -250,
    endX: -215, endY: 100,
  },
  {
    id: 7,
    src: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg",
    alt: "Marketing",
    label: "Marketing",
    positionClass: "bottom-0 right-0",
    startX: 200, startY: 300,
    endX: -250, endY: -100,
  },
  {
    id: 5,
    src: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
    alt: "Corporate",
    label: "Corporate",
    positionClass: "bottom-0 right-0",
    startX: 0, startY: 250,
    endX: -220, endY: -100,
  },
] as const;

const ANIM_START = 0.15;
const ANIM_END = 0.95;
const ANIM_RANGE = ANIM_END - ANIM_START;

/** One subscription, synchronous DOM updates — matches Framer scroll + inertial scroll without one-frame RAF lag. */
function SolutionImagesLayer({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const refs = useRef<(HTMLImageElement | null)[]>([]);

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
        <img
          key={img.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          src={img.src}
          alt={img.alt}
          decoding="async"
          fetchPriority={i === 0 ? "high" : "auto"}
          className={`absolute ${img.positionClass} w-full max-w-62.5 xl:max-w-80 2xl:max-w-96 h-auto object-cover`}
          style={{
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        />
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
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-3">
              <span className="text-[10px] font-bold uppercase text-white">{img.label}</span>
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

  const titleScale = useTransform(scrollYProgress, [0.05, 0.15, 0.39, 0.95], [0.4, 1, 1, 0.4]);
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
              <h2 className="text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[6.5rem] 2xl:text-[7.5rem] font-black text-black leading-[1.1] mb-8 tracking-[-0.160rem]">
                YOUR INDUSTRY POWERED BY<br />HOLOBOX TECHNOLOGY
              </h2>
              <motion.button
                style={{
                  opacity: buttonOpacity,
                  y: buttonY,
                  backgroundColor: '#FF7A00',
                  border: 'none',
                  borderRadius: '100px',
                }}
                whileHover={{ scale: 1.05, backgroundColor: '#e66e00' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 text-base font-bold text-white shadow-lg cursor-pointer"
              >
                Get a Demo
              </motion.button>
            </motion.div>

            <SolutionImagesLayer scrollProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
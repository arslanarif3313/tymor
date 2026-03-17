"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CARDS = [
  { id: 1, image: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg", label: "Real Estate", angle: 0 },
  { id: 2, image: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg", label: "Hospitality", angle: 45 },
  { id: 3, image: "/Tymore%20Ai%20with%20Holobox/3.3-—-Education.jpg", label: "Education", angle: 90 },
  { id: 4, image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg", label: "Retail", angle: 135 },
  { id: 5, image: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg", label: "Healthcare", angle: 180 },
  { id: 6, image: "/Tymore%20Ai%20with%20Holobox/3.6-—-Marketing.jpg", label: "Marketing", angle: 225 },
  { id: 7, image: "/Tymore%20Ai%20with%20Holobox/3.7-—-Government.jpg", label: "Government", angle: 270 },
  { id: 8, image: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg", label: "Corporate/Executive", angle: 315 },
];

function BloomCard({ angle, image, label, scrollProgress, groupRotation }: { angle: number; image: string; label: string; scrollProgress: any; groupRotation: any }) {
  // Continuous expansion: images move "far and far" throughout the scroll
  const radius = useTransform(scrollProgress, [0.1, 1], [0, 650]);
  const scale = useTransform(scrollProgress, [0.1, 0.4], [0.4, 1]);

  const angleRad = (angle - 90) * (Math.PI / 180);
  const x = useTransform(radius, (r) => Math.cos(angleRad) * r);
  const y = useTransform(radius, (r) => Math.sin(angleRad) * r);

  // Counter-rotate each card to stay perfectly straight
  const counterRotate = useTransform(groupRotation, (r: number) => -r);

  return (
    <motion.div
      style={{ x, y, scale, rotate: counterRotate, zIndex: 9999 }}
      className="absolute w-[220px] h-[300px] rounded-2xl overflow-hidden shadow-bloom-card"
    >
      <img src={image} alt={label} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white">{label}</span>
      </div>
    </motion.div>
  );
}

export default function ProjectBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Continuous clockwise rotation: spins more as it expands
  const groupRotate = useTransform(scrollYProgress, [0.1, 1], [0, 540]);
  const centerOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const centerScale = useTransform(scrollYProgress, [0.5, 0.7], [0.85, 1]);

  return (
    <div ref={containerRef} className="relative h-[400vh]" style={{ zIndex: 1100 }}>
      <div className="sticky top-0 flex h-svh w-full items-center justify-center bg-white" style={{ zIndex: 1100 }}>
        <motion.div
          style={{ rotate: groupRotate }}
          className="relative flex items-center justify-center"
        >
          {CARDS.map((card) => (
            <BloomCard
              key={card.id}
              angle={card.angle}
              image={card.image}
              label={card.label}
              scrollProgress={scrollYProgress}
              groupRotation={groupRotate}
            />
          ))}
        </motion.div>

        <motion.div
          style={{ opacity: centerOpacity, scale: centerScale }}
          className="absolute z-20 flex flex-col items-center text-center max-w-2xl px-4 pointer-events-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black text-black leading-tight mb-8 tracking-tighter">
            YOUR INDUSTRY POWERED BY<br />HOLOBOX TECHNOLOGY
          </h2>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#e66e00' }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 text-base font-bold text-white transition-all shadow-lg"
            style={{ backgroundColor: '#FF7A00', border: 'none', borderRadius: '100px' }}
          >
            Get a Demo
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

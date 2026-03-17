"use client";

import { useRef, useState, useEffect } from 'react';
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

function BloomCard({ angle, image, label, scrollProgress, groupRotation, isMobile }: { angle: number; image: string; label: string; scrollProgress: any; groupRotation: any; isMobile: boolean }) {
  // Continuous expansion: images move "far and far" throughout the scroll
  const radius = useTransform(scrollProgress, [0.1, 1], [0, isMobile ? 300 : 650]);
  const scale = useTransform(scrollProgress, [0.1, 0.4], [0.4, 1]);

  const angleRad = (angle - 90) * (Math.PI / 180);
  const x = useTransform(radius, (r) => Math.cos(angleRad) * r);
  const y = useTransform(radius, (r) => Math.sin(angleRad) * r);

  // Counter-rotate each card to stay perfectly straight
  const counterRotate = useTransform(groupRotation, (r: number) => -r);

  return (
    <motion.div
      style={{ x, y, scale, rotate: counterRotate, zIndex: 9999 }}
      className={`${isMobile ? "w-[140px] h-[200px]" : "w-[220px] h-[300px]"} absolute rounded-2xl overflow-hidden shadow-bloom-card`}
    >
      <img src={image} alt={label} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">{label}</span>
      </div>
    </motion.div>
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
        {CARDS.map((card) => (
          <div key={card.id} className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-md">
            <img src={card.image} alt={card.label} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <span className="text-[10px] font-bold uppercase text-white">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ProjectBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 991);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Original Desktop Animation Values
  const groupRotate = useTransform(scrollYProgress, [0.1, 1], [0, 540]);
  const centerOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const centerScale = useTransform(scrollYProgress, [0.5, 0.7], [0.85, 1]);

  if (isMobile) {
    return <MobileProjectBanner />;
  }

  return (
    <div ref={containerRef} className="relative h-[400vh] bloom-container" style={{ zIndex: 1100 }}>
      <div className="sticky top-0 flex h-svh w-full items-center justify-center bg-white overflow-hidden" style={{ zIndex: 1100 }}>
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
              isMobile={false}
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

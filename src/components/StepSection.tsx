"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    quote: "We were skeptical going in. We had seen too many demonstrations look impressive then fall apart the moment they hit a real environment. Tymor delivered exactly what they promised on day one and has not missed a beat since.",
    author: "James Whitfield",
    role: "Enterprise Lead",
    image: "/images/clients/client-1.png",
  },
  {
    quote: "We gave Tymor our brand guidelines, our product catalog, and our customer profile. What came back was a MetaHuman that spoke like our best sales associate, knew every product better than our floor staff, and hasn't taken a single day off since.",
    author: "Sofia Chen",
    role: "Retail Director",
    image: "/images/clients/client-2.png",
  },
  {
    quote: "We beamed our CEO live to twelve locations simultaneously. Every employee saw him life-size, in real time, through the Holobox. The room went completely silent.",
    author: "Marcus Andersen",
    role: "Communications VP",
    image: "/images/clients/client-3.png",
  },
  {
    quote: "The leading competitor came with bold marketing and an underwhelming reality. They couldn't grasp that we needed custom-built digital humans created around our brand, not characters from a pre-built catalog.",
    author: "Diana Reeves",
    role: "Brand Manager",
    image: "/images/clients/client-4.png",
  },
  {
    quote: "Tymor's ability to integrate conversational AI with a Holobox MetaHuman was technically remarkable. The avatar responds naturally, maintains eye contact, and delivers information with a level of realism we had not seen before.",
    author: "Arjun Patel",
    role: "Technical Director",
    image: "/images/clients/client-5.png",
  },
  {
    quote: "Planning a Holobox deployment inside a complex enterprise environment is not easy. Tymor made it feel that way. Their guidance never wavered and their technical depth never ran out.",
    author: "Catherine Laurent",
    role: "Operations Head",
    image: "/images/clients/client-6.png",
  },
];

const CUBE_SIZE = 340;
const MOBILE_CUBE_SIZE = 240;

const cubeFaceTransform = (i: number, size: number): string => {
  const half = size / 2;
  switch (i) {
    case 0: return `rotateY(0deg) translateZ(${half}px)`;
    case 1: return `rotateY(90deg) translateZ(${half}px)`;
    case 2: return `rotateY(180deg) translateZ(${half}px)`;
    case 3: return `rotateY(-90deg) translateZ(${half}px)`;
    case 4: return `rotateX(90deg) translateZ(${half}px)`;
    case 5: return `rotateX(-90deg) translateZ(${half}px)`;
    default: return '';
  }
};

const rotationTargets = [
  { x: 0, y: 0 },
  { x: 0, y: -90 },
  { x: 0, y: -180 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
];

const ZONE_START = 0.22; // Starts rotation after entrance phase
const ZONE_END = 0.95;
const ZONE_SIZE = ZONE_END - ZONE_START;
const SEG = ZONE_SIZE / 6;

const StepSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024); 
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cubeSize = isMobile ? MOBILE_CUBE_SIZE : CUBE_SIZE;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.0001,
  });

  // 1. Color Phase (0.0 -> 0.05)
  const bgColor = useTransform(smoothProgress, [0, 0.05], ["#ffffff", "#000000"]);
  const headingColor = useTransform(smoothProgress, [0, 0.05], ["rgb(0,0,0)", "rgb(255,255,255)"]);
  const headingScale = useTransform(smoothProgress, [0, 0.05], [1, 0.6]);
  
  // 2. Hold Phase (0.05 -> 0.12) - Background stays black, heading stays fixed

  // 3. Exit/Entrance Phase (0.12 -> 0.22)
  const introY = useTransform(smoothProgress, [0.12, 0.22], [0, -1000]);
  const introOpacity = useTransform(smoothProgress, [0.12, 0.17], [1, 0]);

  const cubeY = useTransform(smoothProgress, [0.12, 0.22], [800, 0]);
  const cubeScale = useTransform(smoothProgress, [0.12, 0.22], [0.1, 1]);
  const cubeOpacity = useTransform(smoothProgress, [0.12, 0.17], [0, 1]);

  // Cube rotation stops
  const rotXStops: number[] = [-35, -35, 0];
  const rotYStops: number[] = [-45, -45, 0];
  const progressStops: number[] = [0, 0.1, 0.22]; 

  for (let i = 0; i < 6; i++) {
    const segStart = ZONE_START + i * SEG;
    const rotateStart = segStart + SEG * 0.55;
    const rotateEnd = segStart + SEG * 0.85;

    if (rotateStart > 0.22) {
      progressStops.push(rotateStart);
      rotXStops.push(rotationTargets[i].x);
      rotYStops.push(rotationTargets[i].y);
    }

    if (i < 5 && rotateEnd > 0.22) {
      progressStops.push(rotateEnd);
      rotXStops.push(rotationTargets[i + 1].x);
      rotYStops.push(rotationTargets[i + 1].y);
    }
  }

  const cubeRotateX = useTransform(smoothProgress, progressStops, rotXStops);
  const cubeRotateY = useTransform(smoothProgress, progressStops, rotYStops);

  const textX = useTransform(scrollYProgress, (v: number) => {
    if (v < ZONE_START || v > ZONE_END) return 1500;
    const pos = (v - ZONE_START) / SEG;
    const segFrac = pos - Math.floor(pos);
    const sweepEnd = 0.55;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1400;

    if (segFrac <= sweepEnd) {
      const t = segFrac / sweepEnd;
      return vw * (1 - t * 2);
    }
    return -vw * 1.5;
  });

  const textOpacity = useTransform(scrollYProgress, (v: number) => {
    if (v < ZONE_START || v > ZONE_END) return 0;
    const pos = (v - ZONE_START) / SEG;
    const segFrac = pos - Math.floor(pos);
    if (segFrac < 0.03) return segFrac / 0.03;
    if (segFrac < 0.50) return 1;
    if (segFrac < 0.55) return 1 - (segFrac - 0.50) / 0.05;
    return 0;
  });

  useMotionValueEvent(scrollYProgress, 'change', (v: number) => {
    if (v < ZONE_START) { setActiveIndex(0); return; }
    if (v > ZONE_END) { setActiveIndex(5); return; }
    const pos = (v - ZONE_START) / SEG;
    const idx = Math.min(5, Math.floor(pos));
    if (idx !== activeIndex) setActiveIndex(idx);
  });

  const current = testimonials[activeIndex];

  return (
    <div ref={containerRef} style={{ height: '800vh', position: 'relative' }}>
      <motion.div
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden font-sans antialiased"
        style={{ backgroundColor: bgColor }}
      >
        {/* Intro Heading Layer */}
        <motion.div
          className="absolute inset-x-0 flex items-center justify-center z-50 pointer-events-none"
          style={{
            opacity: introOpacity,
            scale: headingScale,
            top: '50%',
            y: introY,
            translateY: '-50%'
          }}
        >
          <motion.h2
            className="uppercase leading-[0.9] tracking-tighter text-center"
            style={{
              fontSize: isMobile ? 'clamp(5rem, 18vw, 8rem)' : '200px',
              fontWeight: 400,
              fontFamily: 'Anton, var(--font-anton), sans-serif',
              color: headingColor,
              lineHeight: isMobile ? '0.9' : '210px',
              maxWidth: '1400px'
            }}
          >
            WHAT OUR<br />CLIENTS SAY
          </motion.h2>
        </motion.div>

        {/* Cube Layer */}
        <motion.div
          className="relative"
          style={{
            y: cubeY,
            scale: cubeScale,
            opacity: cubeOpacity,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: cubeSize,
              height: cubeSize,
              perspective: 1500,
            }}
          >
            <motion.div
              style={{
                width: cubeSize,
                height: cubeSize,
                transformStyle: 'preserve-3d',
                rotateX: cubeRotateX,
                rotateY: cubeRotateY,
              }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    transform: cubeFaceTransform(i, cubeSize),
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <img
                    src={t.image}
                    alt={t.author}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonial Active Text Layer */}
        <motion.div
          className="absolute"
          style={{
            x: textX,
            opacity: textOpacity,
            top: '50%',
            translateY: '-50%',
            width: isMobile ? 240 : 340,
            zIndex: 20,
            mixBlendMode: 'difference',
            pointerEvents: 'none',
          }}
        >
          <p
            className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4"
            style={{ color: '#fff' }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </p>
          <p className="text-lg md:text-2xl font-bold mb-1 tracking-tight" style={{ visibility: 'hidden' }}>{current.author}</p>
          <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-5" style={{ visibility: 'hidden' }}>{current.role}</p>
          <p className="text-xs md:text-sm leading-relaxed" style={{ visibility: 'hidden' }}>{current.quote}</p>
        </motion.div>

        <motion.div
          className="absolute"
          style={{
            x: textX,
            opacity: textOpacity,
            top: '50%',
            translateY: '-50%',
            width: isMobile ? 240 : 340,
            zIndex: 21,
          }}
        >
          <p
            className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-4"
            style={{ color: '#fff', visibility: 'hidden' }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </p>
          <p
            className="text-lg md:text-2xl font-bold mb-1 tracking-tight"
            style={{ color: '#fff' }}
          >
            {current.author}
          </p>
          <p
            className="text-[10px] uppercase tracking-[0.25em] font-medium mb-5"
            style={{ color: '#fff' }}
          >
            {current.role}
          </p>
          <p
            className="text-xs md:text-sm leading-relaxed"
            style={{ color: '#fff' }}
          >
            {current.quote}
          </p>
        </motion.div>

        {/* Progress dots */}
        <div className="absolute bottom-8 md:bottom-12 flex gap-2" style={{ zIndex: 30 }}>
          {testimonials.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-700"
              style={{
                width: i === activeIndex ? 32 : 8,
                backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StepSection;

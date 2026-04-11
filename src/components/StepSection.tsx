"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';

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

const CUBE_SIZE = 330;
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
  { x: 90, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 90 },
  { x: 0, y: 180 },
  { x: 0, y: 270 },
  { x: -90, y: 0 },
];

const ZONE_START = 0.22;
const ZONE_END = 0.95;
const ZONE_SIZE = ZONE_END - ZONE_START;
const SEG = ZONE_SIZE / 6;

const entranceStops  = [0.120, 0.127, 0.134, 0.141, 0.149, 0.156, 0.163, 0.170, 0.177, 0.184, 0.191, 0.199, 0.206, 0.213, 0.220];
const entranceScale  = [0.254, 0.362, 0.412, 0.455, 0.494, 0.509, 0.593, 0.620, 0.668, 0.719, 0.783, 0.848, 0.902, 0.970, 1.0];
const entranceRotX   = [-44.3, -24.8, -15.9, -8.0,  -1.0,  1.6,   16.7,  21.6,  30.2,  39.4,  50.9,  62.7,  72.4,  84.7,  90.0];
const entranceRotY   = [67.2,  57.4,  53.0,  49.0,  45.5,  44.2,  36.6,  34.2,  29.9,  25.3,  19.6,  13.6,  8.8,   2.7,   0.0];
const entranceTransX = [-41,   -58,   -66,   -73,   -79,   -79,   -65,   -61,   -53,   -45,   -35,   -24,   -16,   -5,    0];

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

  const bgColor = useTransform(smoothProgress, [0, 0.05], ["#ffffff", "#000000"]);
  const headingColor = useTransform(smoothProgress, [0, 0.05], ["rgb(0,0,0)", "rgb(255,255,255)"]);
  const headingScale = useTransform(smoothProgress, [0, 0.05], [1, 0.6]);

  const introY = useTransform(smoothProgress, [0.12, 0.22], [0, -1000]);
  const introOpacity = useTransform(smoothProgress, [0.12, 0.17], [1, 0]);

  const cubeEntranceY = useTransform(smoothProgress, [0.12, 0.22], [600, 0]);
  const cubeEntranceScale = useTransform(smoothProgress, entranceStops, entranceScale);
  const cubeOpacity = useTransform(smoothProgress, [0.12, 0.16], [0, 1]);
  const cubeEntranceTransX = useTransform(smoothProgress, entranceStops, entranceTransX);

  const entranceRotXTransform = useTransform(smoothProgress, entranceStops, entranceRotX);
  const entranceRotYTransform = useTransform(smoothProgress, entranceStops, entranceRotY);

  const postRotXStops: number[] = [90];
  const postRotYStops: number[] = [0];
  const postProgressStops: number[] = [0.22];

  for (let i = 0; i < 6; i++) {
    const segStart = ZONE_START + i * SEG;
    const rotateStart = segStart + SEG * 0.55;
    const rotateEnd = segStart + SEG * 0.85;

    if (rotateStart > 0.22) {
      postProgressStops.push(rotateStart);
      postRotXStops.push(rotationTargets[i].x);
      postRotYStops.push(rotationTargets[i].y);
    }

    if (i < 5 && rotateEnd > 0.22) {
      postProgressStops.push(rotateEnd);
      postRotXStops.push(rotationTargets[i + 1].x);
      postRotYStops.push(rotationTargets[i + 1].y);
    }
  }

  const postCubeRotateX = useTransform(smoothProgress, postProgressStops, postRotXStops);
  const postCubeRotateY = useTransform(smoothProgress, postProgressStops, postRotYStops);

  const cubeRotateX = useTransform(smoothProgress, (v: number) => {
    if (v < 0.22) return entranceRotXTransform.get();
    return postCubeRotateX.get();
  });

  const cubeRotateY = useTransform(smoothProgress, (v: number) => {
    if (v < 0.22) return entranceRotYTransform.get();
    return postCubeRotateY.get();
  });

  const cubeTransX = useTransform(smoothProgress, (v: number) => {
    if (v < 0.22) return cubeEntranceTransX.get();
    return 0;
  });

  const cubeScaleFinal = useTransform(smoothProgress, (v: number) => {
    if (v < 0.22) return cubeEntranceScale.get();
    return 1;
  });

  const cubeYFinal = useTransform(smoothProgress, (v: number) => {
    if (v < 0.22) return cubeEntranceY.get();
    return 0;
  });

  const textX = useTransform(scrollYProgress, (v: number) => {
    if (v < ZONE_START || v > ZONE_END) return 1500;
    const pos = (v - ZONE_START) / SEG;
    const segFrac = pos - Math.floor(pos);
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1400;

    const sweepInEnd = 0.18;
    const holdEnd = 0.40;
    const sweepOutEnd = 0.55;
    const cubeRight = vw / 2 + 165;
    const cubeLeft = vw / 2 - 165;
    const tw = vw < 1024 ? 240 : 340;
    const idx = Math.floor(pos);
    const restPositions = [
      vw / 2 + 85,             // person 1: overlaps image from right
      cubeRight + 100,          // person 2: small gap right of image
      cubeLeft - tw - 85,       // person 3: left side, small gap
      cubeLeft - tw + 105,       // person 4: left side, overlaps cube a bit
      vw / 2 + 400,            // person 5
      vw / 2 - 750,            // person 6
    ];
    const restX = restPositions[Math.min(idx, 5)];

    if (segFrac <= sweepInEnd) {
      const t = segFrac / sweepInEnd;
      return vw + (restX - vw) * t;
    }
    if (segFrac <= holdEnd) {
      return restX;
    }
    if (segFrac <= sweepOutEnd) {
      const t = (segFrac - holdEnd) / (sweepOutEnd - holdEnd);
      return restX + (-vw * 1.5 - restX) * t;
    }
    return -vw * 1.5;
  });

  const textOpacity = useTransform(scrollYProgress, (v: number) => {
    if (v < ZONE_START || v > ZONE_END) return 0;
    const pos = (v - ZONE_START) / SEG;
    const segFrac = pos - Math.floor(pos);
    if (segFrac < 0.03) return segFrac / 0.03;
    if (segFrac < 0.48) return 1;
    if (segFrac < 0.55) return 1 - (segFrac - 0.48) / 0.07;
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
    <div ref={containerRef} style={{ height: '2400vh', position: 'relative' }}>
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
            y: cubeYFinal,
            scale: cubeScaleFinal,
            x: cubeTransX,
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

        {/* Crystal blend layer — number + author name */}
        <motion.div
          className="absolute"
          style={{
            x: textX,
            opacity: textOpacity,
            left: 0,
            top: '50%',
            translateY: '-50%',
            width: isMobile ? 240 : 340,
            zIndex: 20,
            mixBlendMode: 'difference',
            pointerEvents: 'none',
          }}
        >
          <p
            className="text-5xl font-black leading-none tracking-tighter mb-4 -ml-2"
            style={{ color: '#fff' }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </p>
          <p className="text-lg md:text-4xl mb-1 font-bold -ml-2 tracking-tight" style={{ color: '#f74a00' }}>
            {current.author}
          </p>
          <p className="text-sm md:text-xl mb-4 -ml-2 tracking-tight" style={{ visibility: 'hidden' }}>{current.role}</p>
          <p className="text-xs md:text-lg leading-relaxed -ml-2" style={{ visibility: 'hidden' }}>{current.quote}</p>
        </motion.div>

        {/* Normal layer — role + quote (no blend, no blur) */}
        <motion.div
          className="absolute"
          style={{
            x: textX,
            opacity: textOpacity,
            left: 0,
            top: '50%',
            translateY: '-50%',
            width: isMobile ? 240 : 340,
            zIndex: 21,
            pointerEvents: 'none',
          }}
        >
          <p className="text-5xl font-black leading-none tracking-tighter mb-4 -ml-2" style={{ visibility: 'hidden' }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </p>
          <p className="text-lg md:text-4xl mb-1 font-bold -ml-2 tracking-tight" style={{ visibility: 'hidden' }}>{current.author}</p>
          <p className="text-sm md:text-xl mb-4 -ml-2 tracking-tight" style={{ color: '#fff' }}>
            {current.role}
          </p>
          <p className="text-xs md:text-lg leading-relaxed -ml-2" style={{ color: '#fff' }}>
            {current.quote}
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default StepSection;

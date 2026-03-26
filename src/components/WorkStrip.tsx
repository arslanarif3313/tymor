"use client";
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const features = [
  {
    id: "01",
    title: "Full Stack Ownership",
    description:
      "Unlike any other Holobox solution, Tymor is built by an IT company, meaning one partner owns the full stack with no vendor gaps and no finger-pointing.",
  },
  {
    id: "02",
    title: "Intelligence Behind the Presence",
    description:
      "Anyone can put a face on a screen; Tymor builds the AI behind it \u2014 the logic, knowledge, and integrations that make every interaction meaningful.",
  },
  {
    id: "03",
    title: "Versatility Across Industries",
    description:
      "Tymor\u2019s Holobox is built for any environment \u2014 from healthcare facilities to enterprise headquarters \u2014 with scalable configurations that fit any use case and budget.",
  },
  {
    id: "04",
    title: "Launch Then Evolve",
    description:
      "Tymor measures success every day after delivery \u2014 with professional setup, training, analytics, and continuous optimization that keep your Holobox performing and evolving alongside your business.",
  },
  {
    id: "05",
    title: "Changes With You",
    description:
      "Redeploying a Holobox MetaHuman to a new location, role, or knowledge base is simply a managed update \u2014 no disruption, no starting over, just the same character with a new purpose.",
  },
  {
    id: "06",
    title: "No Off Days",
    description:
      "Your best employee can only handle one conversation at a time; your Holobox MetaHuman has no such limit, performing identically at scale with no fatigue, frustration, or drop in quality.",
  },
  {
    id: "07",
    title: "Interactions Become Intelligence",
    description:
      "Most vendors give you a display. Tymor gives you data, with every interaction logged and reported so your Holobox becomes a source of audience intelligence you never had before.",
  },
];

const ICON_IMAGES = [
  "https://framerusercontent.com/images/dfm8JnI7K7zBoES0pPSRYDn2S0.png?scale-down-to=512",
  "https://framerusercontent.com/images/BmmyYLfsCbtpxxexDslWVCYKdpE.png?scale-down-to=512",
  "https://framerusercontent.com/images/LuLvgfQnOXwjfxFoUiWRA5nHbog.png?scale-down-to=512",
  "https://framerusercontent.com/images/fQfiEf6CGFwe4CIiIh6oLDj5g.png?scale-down-to=512",
  "https://framerusercontent.com/images/yqEZWmi7l26eErBmxmv7K3sUts.png?scale-down-to=512",
  "https://framerusercontent.com/images/mItFSA6DtA8zAdRwPPfpr4Dho2A.png?scale-down-to=512",
  "https://framerusercontent.com/images/dfm8JnI7K7zBoES0pPSRYDn2S0.png?scale-down-to=512"
];

function IsometricStack({ activeIndex, tileSize }: { activeIndex: number, tileSize: number }) {
  const xStep = tileSize / 2;
  const yStep = tileSize / 2;

  const tilePositions = ICON_IMAGES.map((_, i) => ({
    x: i * xStep,
    y: (ICON_IMAGES.length - 1 - i) * yStep,
  }));

  const stackW = (ICON_IMAGES.length - 1) * xStep + tileSize;
  const stackH = (ICON_IMAGES.length - 1) * yStep + tileSize;

  const highlightedTile =
    activeIndex >= 1 && activeIndex <= ICON_IMAGES.length
      ? activeIndex - 1
      : -1;

  return (
    <div className="relative" style={{ width: stackW, height: stackH }}>
      {ICON_IMAGES.map((src, i) => {
        const isHighlighted = i === highlightedTile;
        const pos = tilePositions[i];

        return (
          <motion.div
            key={i}
            animate={{
              scale: isHighlighted ? 1.15 : 1,
              x: 0,
              y: isHighlighted ? -(tileSize * 0.35) : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 22,
              mass: 0.8,
            }}
            style={{
              position: 'absolute',
              width: tileSize,
              height: tileSize,
              left: pos.x,
              top: pos.y,
              borderRadius: 14,
              overflow: 'hidden',
              zIndex: isHighlighted ? 20 : i + 1,
              willChange: 'transform',
            }}
          >
            <motion.div
              animate={{
                boxShadow: isHighlighted
                  ? '0 20px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.08)'
                  : '0 8px 24px rgba(0,0,0,0.4)',
                opacity: isHighlighted ? 1 : highlightedTile === -1 ? 1 : 0.5,
              }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 14,
                overflow: 'hidden',
              }}
            >
              <img
                src={src}
                alt=""
                decoding="async"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function MobileWorkStrip() {
  return (
    <section className="bg-background text-foreground py-16 px-6">
      <div className="flex flex-col gap-10">
        {features.map((feature) => (
          <div key={feature.id}>
            <span
              style={{
                fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                color: 'rgba(255,255,255,0.35)',
                display: 'block',
                marginBottom: '10px',
              }}
            >
              {feature.id}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#fff',
                margin: '0 0 10px 0',
              }}
            >
              {'// '}{feature.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.55)',
                margin: '0 0 16px 0',
              }}
            >
              {feature.description}
            </p>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Get started <ArrowUpRight size={14} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function WorkStrip() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [is2xl, setIs2xl] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 992);
      setIs2xl(window.innerWidth >= 1536);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const totalSections = features.length + 1;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(
      totalSections - 1,
      Math.floor(latest * totalSections)
    );
    if (index !== activeIndex) setActiveIndex(index);
  });

  if (isMobile) return <MobileWorkStrip />;

  const feature = activeIndex >= 1 ? features[activeIndex - 1] : null;
  const tileSize = is2xl ? 170 : 120;

  return (
    <section
      ref={containerRef}
      className="relative bg-background text-foreground"
      style={{ height: `${totalSections * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Headline at Left Center */}
        <div className="absolute top-1/2 left-1/4 z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2">
          <motion.p
            aria-hidden={activeIndex !== 0}
            initial={false}
            animate={{
              opacity: activeIndex === 0 ? 1 : 0,
              y: activeIndex === 0 ? 0 : -30
            }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
            style={{
              fontFamily: 'var(--font-manrope), Manrope, sans-serif',
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#FFFF00',
              lineHeight: 1.1,
              textAlign: 'center',
              textTransform: 'uppercase',
              maxWidth: '700px'
            }}
          >
            Limits Are For Others
          </motion.p>
        </div>

        <div className="flex h-full w-full">
          {/* Left — text content */}
          <div className="w-1/2 flex items-center justify-center px-12 xl:px-24">
            <div style={{ width: '100%', maxWidth: 540 }}>
              <AnimatePresence mode="wait">
                {feature ? (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        lineHeight: 1,
                        letterSpacing: '-0.04em',
                        color: 'rgb(163, 163, 163)',
                        display: 'block',
                        marginBottom: '16px',
                      }}
                    >
                      {feature.id}
                    </span>

                    <h3
                      style={{
                        fontFamily: 'var(--font-manrope), Manrope, sans-serif',
                        fontSize: '42px',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                        color: '#FFFF00',
                        margin: '0 0 20px 0',
                      }}
                    >
                      {'// '}{feature.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                        fontSize: '18px',
                        fontWeight: 400,
                        lineHeight: 1.6,
                        color: 'rgb(212, 212, 212)',
                        margin: '0 0 32px 0',
                        maxWidth: 480,
                      }}
                    >
                      {feature.description}
                    </p>

                    <a
                      href="#"
                      className="group"
                      style={{
                        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#ffffff',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      Get started
                      <ArrowUpRight
                        size={18}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>

                    <div
                      style={{
                        marginTop: '40px',
                        height: '1px',
                        background: 'rgba(255,255,255,0.08)',
                        maxWidth: 400,
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Isometric Stack */}
          <div className="relative w-1/2 flex items-center justify-center overflow-visible px-4">
            <div className="relative">
              <IsometricStack activeIndex={activeIndex} tileSize={tileSize} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
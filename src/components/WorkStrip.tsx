"use client";
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Layers,
  Cpu,
  Box,
  Zap,
  RefreshCw,
  Infinity,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const features = [
  {
    id: "01",
    title: "Full Stack Ownership",
    shortDescription: "Unlike any other Holobox solution, Tymor is built by an IT company, meaning one partner owns the full stack with no vendor gaps and no finger-pointing.",
    description:
      "Tymor is the only Holobox solution built by an IT company. That distinction matters. It means one accountable partner for everything — end-to-end deployment, infrastructure, cybersecurity, enterprise integration, and ongoing support. No gaps between vendors. No finger-pointing when something goes wrong. Just Tymor, owning the full stack, making Holobox technology work reliably inside real enterprise environments.",
    icon: Layers,
  },
  {
    id: "02",
    title: "Intelligence Behind Presence",
    shortDescription: "Anyone can put a face on a screen; Tymor builds the AI behind it — the logic, knowledge, and integrations that make every interaction meaningful.",
    description:
      "Anyone can project an image. Not everyone can make it think, speak, respond, and remember. Tymor doesn't just put a face on a screen — we build the intelligence behind it. The knowledge base, the conversation architecture, the guardrails, the enterprise integrations. The face is what visitors see. The AI is what makes them come back.",
    icon: Cpu,
  },
  {
    id: "03",
    title: "Versatility Across Industries",
    shortDescription: "Tymor's Holobox is built for any environment — from healthcare facilities to enterprise headquarters — with scalable configurations that fit any use case and budget.",
    description:
      "From hotel lobbies to enterprise headquarters, healthcare facilities to military training sessions, Tymor’s HoloBox adapts to diverse use cases — offering scalable packages and configurations that fit unique needs and budgets.",
    icon: Box,
  },
  {
    id: "04",
    title: "Launch Then Evolve",
    shortDescription: "Tymor measures success every day after delivery — with professional setup, training, analytics, and continuous optimization that keep your Holobox performing and evolving alongside your business.",
    description:
      "Most vendors measure success at delivery. Tymor measures it every day after. Professional setup, training, analytics, and continuous optimization ensure your Holobox never stops performing — and never stops evolving. Adapting to your audience and advancing with your business objectives.",
    icon: Zap,
  },
  {
    id: "05",
    title: "Changes With You",
    shortDescription: "Redeploying a Holobox MetaHuman to a new location, role, or knowledge base is simply a managed update — no disruption, no starting over, just the same character with a new purpose.",
    description:
      "Redeploying a human employee costs time, money, and disruption. Redeploying your Holobox MetaHuman to a new location, a new role, or a new knowledge base is a managed update. Same character. New purpose. Tymor's platform is built for the reality that your business evolves — and your MetaHuman evolves with it without starting over.",
    icon: RefreshCw,
  },
  {
    id: "06",
    title: "No Off Days",
    shortDescription: "Your best employee can only handle one conversation at a time; your Holobox MetaHuman has no such limit, performing identically at scale with no fatigue, frustration, or drop in quality.",
    description:
      "Your best human employee has a limit — one conversation at a time. Your Holobox MetaHuman doesn’t. During a trade show rush, a hospital peak hour, or a busy retail Saturday, your MetaHuman performs identically for the hundredth visitor as it did for the first. No fatigue. No frustration. No drop in quality. Consistency at scale is something humans cannot deliver. Holobox technology can.",
    icon: Infinity,
  },
  {
    id: "07",
    title: "Interactions Become Intelligence",
    shortDescription: "Most vendors give you a display. Tymor gives you data, with every interaction logged and reported so your Holobox becomes a source of audience intelligence you never had before.",
    description:
      "Every interaction your MetaHuman has is logged, measured, and reported. What visitors asked, how long they engaged, what topics surfaced most, where conversations escalated. Most vendors give you a display. Tymor gives you intelligence about your audience that you never had before. The Holobox doesn't just serve your customers — it teaches you about them.",
    icon: BarChart3,
  },
];

const WorkStrip = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(
      features.length - 1,
      Math.floor(latest * features.length)
    );
    if (index !== activeIndex) {
      setActiveIndex(index);
      setIsFlipped(false); // Reset flip on scroll
    }
  });

  const activeFeature = features[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative bg-background text-foreground"
      style={{ height: isMobile ? 'auto' : `${features.length * 70}vh` }}
    >
      <div className={`${isMobile ? 'py-5' : 'sticky top-0 h-screen'} flex flex-col lg:flex-row overflow-hidden`}>
        {/* Left Column */}
        <div className="w-full lg:w-1/2 flex items-center px-6 lg:px-16 xl:px-24 py-12 lg:py-0 text-center text-lg-start justify-content-center justify-content-lg-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFeature.id}-${isFlipped}`}
              initial={{ opacity: 0, rotateY: isFlipped ? -20 : 20, y: isMobile ? 0 : 20 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 20 : -20, y: isMobile ? 0 : -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-100"
              style={{ perspective: 1000 }}
            >
              <div className="flex flex-col">
                <span className="text-muted-foreground font-mono text-xs lg:text-sm mb-3 block">
                  {activeFeature.id} {isFlipped && <span className="text-primary opacity-50 ml-2">// BACK PAGE</span>}
                </span>
                <h3 className="text-xl lg:text-4xl anton-font text-uppercase tracking-tight text-foreground mb-4 lg:mb-5">
                  <span className="text-primary font-mono italic">//</span>{' '}
                  {activeFeature.title}
                </h3>
                <p className="text-muted-foreground text-sm lg:text-[17px] leading-relaxed max-w-lg mb-6 lg:mb-8 mx-auto mx-lg-0">
                  {isFlipped ? activeFeature.description : activeFeature.shortDescription}
                </p>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="inline-flex items-center gap-1.5 text-foreground text-xs lg:text-sm font-medium hover:text-primary transition-colors group bg-transparent border-0 p-0"
                  >
                    {isFlipped ? "Back to Front" : "Get started"}
                    <ArrowUpRight
                      size={14}
                      className={`transition-transform ${isFlipped ? 'rotate-180' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-8 lg:mt-10 border-b border-border/40 max-w-lg mx-auto mx-lg-0" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - tiles cluster */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center overflow-hidden">
          <div className="relative w-[300px] lg:w-[400px] h-[300px] lg:h-[500px]" style={{ perspective: '800px' }}>
            {features.map((feature, index) => (
              <TileItem
                key={feature.id}
                feature={feature}
                index={index}
                activeIndex={activeIndex}
                total={features.length}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Grid layout: 3 columns, staggered rows
const tileGrid = [
  { x: 0, y: 0 },
  { x: 140, y: -20 },
  { x: 280, y: 10 },
  { x: 60, y: 110 },
  { x: 200, y: 90 },
  { x: 0, y: 210 },
  { x: 140, y: 190 },
];

function TileItem({
  feature,
  index,
  activeIndex,
  total,
  isMobile,
}: {
  feature: (typeof features)[number];
  index: number;
  activeIndex: number;
  total: number;
  isMobile: boolean;
}) {
  const Icon = feature.icon;
  const grid = isMobile
    ? [
      { x: 0, y: 0 },
      { x: 100, y: -10 },
      { x: 200, y: 5 },
      { x: 40, y: 90 },
      { x: 140, y: 75 },
      { x: 0, y: 160 },
      { x: 100, y: 145 },
    ]
    : tileGrid;

  const pos = grid[index];

  // Each tile moves up based on how many steps have passed relative to its index
  const stepsPassed = activeIndex;
  const stepHeight = isMobile ? 35 : 45;
  const yOffset = -stepsPassed * stepHeight + index * 8;

  const isHighlighted = index <= activeIndex;

  return (
    <motion.div
      animate={{
        y: pos.y + yOffset,
        opacity: isHighlighted ? 1 : 0.2,
        rotateX: 20,
        rotateY: -12,
      }}
      transition={{
        type: isMobile ? 'tween' : 'spring',
        stiffness: 80,
        damping: 20,
        duration: isMobile ? 0 : undefined
      }}
      style={{
        position: 'absolute',
        left: pos.x,
        top: isMobile ? 120 : 200,
        transformStyle: 'preserve-3d',
      }}
      className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]"
    >
      <div
        className="w-full h-full rounded-xl border border-border/50 flex items-center justify-center"
        style={{
          background:
            'linear-gradient(145deg, var(--card) 0%, var(--secondary) 100%)',
          boxShadow: isHighlighted
            ? '0 8px 32px rgba(249,101,1,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <Icon
          size={isMobile ? 24 : 32}
          strokeWidth={1.5}
          className="text-primary"
          style={{
            filter: isHighlighted ? 'var(--tymor-glow)' : 'none',
          }}
        />
      </div>
    </motion.div>
  );
}

export default WorkStrip;
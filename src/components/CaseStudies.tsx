"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// Premium easing for smooth motion
const smoothEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

const IMPACT_STATS = [
  { count: "40", text: "Years of Technology Leadership" },
  { count: "100,000+", text: "Systems Managed Across Industries" },
  { count: "99.9%", text: "Operational Reliability" },
  { count: "7+", text: "Industries Served Across Diverse Environments" },
];

const AnimatedCard = ({ startIndex = 0 }: { startIndex?: number }) => {
  const [current, setCurrent] = useState(startIndex % IMPACT_STATS.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMPACT_STATS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const isOrange = current % 2 === 0;
  const stat = IMPACT_STATS[current];

  return (
    <motion.div
      className="marquee-video rounded-0 d-flex flex-column justify-content-center align-items-start px-3 px-md-4"
      animate={{
        scale: [1, 1.02, 1],
        boxShadow: isOrange
          ? ["0 0 0 rgba(250,100,0,0)", "0 0 20px rgba(250,100,0,0.3)", "0 0 0 rgba(250,100,0,0)"]
          : ["0 0 0 rgba(224,224,224,0)", "0 0 20px rgba(224,224,224,0.2)", "0 0 0 rgba(224,224,224,0)"],
      }}
      transition={{
        scale: { duration: 0.4, ease: smoothEase },
        boxShadow: { duration: 0.6, ease: smoothEase },
      }}
      style={{
        background: isOrange ? "#fa6400" : "#e0e0e0",
        transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.98 }}
          transition={{ duration: 0.45, ease: smoothEase }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.05, duration: 0.3 }}
            style={{
              fontFamily: "var(--font-anton), 'Anton', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1,
              color: "#0a0a0a",
              letterSpacing: "-0.02em",
            }}
          >
            {stat.count}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35, ease: smoothEase }}
            style={{
              marginTop: "6px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 400,
              fontSize: "clamp(11px, 1.2vw, 16px)",
              lineHeight: 1.3,
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {stat.text}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const industriesRow1 = [
  {
    id: "r1-1",
    name: "Hospitality",
    desc: "Redefined Guest Engagement using our AI-Powered HoloBox Concierge.",
    image: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
  },
  {
    id: "r1-2",
    name: "Retail",
    desc: "AI Holobox Product Specialist Transforms the In-Store Experience for Retail.",
    image: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
  },
  {
    id: "r1-3",
    name: "Real Estate",
    desc: "Realty Group Introduces AI Holobox Advisors to Elevate the Property Buying Experience Leveraging Real-Time Buyer Insights.",
    image: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
  },
];

const industriesRow2 = [
  {
    id: "r2-1",
    name: "Healthcare",
    desc: "Live-Streamed Physician Model Improves Clinical Patient Care Delivery in Hospital Settings.",
    image: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
  },
  {
    id: "r2-2",
    name: "Marketing",
    desc: "HoloBox AI Brand Ambassador Drives Audience Engagement at Marketing Events and Shows.",
    image: "/Tymore%20Ai%20with%20Holobox/3.7-—-Government.jpg",
  },
];

const IndustryCard = ({
  industry,
  index = 0,
  totalCards = 1,
  viewportCenter = 0.5,
}: {
  industry: (typeof industriesRow1)[0];
  index?: number;
  totalCards?: number;
  viewportCenter?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardCenter, setCardCenter] = useState(0.5);

  // Track card position in viewport
  useEffect(() => {
    const updatePosition = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      const normalizedPos = centerX / viewportWidth;
      setCardCenter(normalizedPos);
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  // Depth: cards further from center feel slightly recessed
  const centerPosition = (totalCards - 1) / 2;
  const distanceFromCenter = Math.abs(index - centerPosition) / centerPosition || 0;
  const depthScale = isHovered ? 1 : 1 - (distanceFromCenter * 0.03);
  const depthOpacity = isHovered ? 1 : 1 - (distanceFromCenter * 0.08);

  // VIEWPORT CENTER EMPHASIS: cards near viewport center feel more prominent
  const distanceFromViewportCenter = Math.abs(cardCenter - viewportCenter);
  const viewportProximity = Math.max(0, 1 - distanceFromViewportCenter * 2);
  const viewportScale = 1 + (viewportProximity * 0.02); // Up to 2% larger at center
  const viewportBrightness = 1 + (viewportProximity * 0.04); // Up to 4% brighter at center

  return (
    <motion.div
      ref={cardRef}
      className="industry-marquee-card position-relative overflow-hidden cursor-pointer rounded-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1 : depthScale * viewportScale,
        opacity: depthOpacity,
        filter: isHovered ? "brightness(1.1)" : `brightness(${viewportBrightness})`,
      }}
      transition={{
        scale: { duration: 0.5, ease: smoothEase },
        opacity: { duration: 0.4, ease: smoothEase },
        filter: { duration: 0.3, ease: smoothEase },
      }}
      style={{
        transformOrigin: "center center",
      }}
    >
      <motion.img
        src={industry.image}
        alt={industry.name}
        className="w-100 h-100 object-fit-cover"
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.7, ease: smoothEase }}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="position-absolute top-0 left-0 w-100 h-100 d-flex flex-column justify-content-end p-3 p-md-4"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
              backdropFilter: "blur(6px)",
              zIndex: 10,
            }}
          >
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.05, duration: 0.3, ease: smoothEase }}
              className="text-uppercase anton-font mb-2"
              style={{ color: "var(--accent)", letterSpacing: "1px" }}
            >
              {industry.name}
            </motion.h4>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.1, duration: 0.3, ease: smoothEase }}
              className="small text-white-50 m-0"
              style={{ lineHeight: "1.4" }}
            >
              {industry.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function ScrollResponsiveMarquee({
  children,
  direction = "left",
  className = "",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useMotionValue(0);
  const [duration, setDuration] = useState(direction === "left" ? 36 : 34);

  // Track scroll velocity and adjust marquee speed
  useMotionValueEvent(scrollY, "change", () => {
    const velocity = scrollVelocity.get();
    // Subtle speed variation based on scroll direction
    const baseDuration = direction === "left" ? 36 : 34;
    const speedFactor = velocity > 0 ? 0.92 : velocity < 0 ? 1.08 : 1; // 8% faster on scroll down, 8% slower on scroll up
    setDuration(baseDuration * speedFactor);
  });

  // Calculate scroll velocity
  useEffect(() => {
    let lastScrollY = scrollY.get();
    let rafId: number;
    
    const updateVelocity = () => {
      const current = scrollY.get();
      const velocity = current - lastScrollY;
      scrollVelocity.set(velocity);
      lastScrollY = current;
      rafId = requestAnimationFrame(updateVelocity);
    };
    
    rafId = requestAnimationFrame(updateVelocity);
    return () => cancelAnimationFrame(rafId);
  }, [scrollY, scrollVelocity]);

  return (
    <div ref={containerRef} className={`marquee ${className}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
      <div className="marquee-inner-scroll-responsive" data-direction={direction}>
        {children}
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const containerRef = useRef<HTMLElement>(null);
  const [viewportCenter, setViewportCenter] = useState(0.5);

  // Track viewport center for position-based emphasis
  useEffect(() => {
    const updateViewportCenter = () => {
      const center = window.innerWidth / 2 / window.innerWidth;
      setViewportCenter(center);
    };
    updateViewportCenter();
    window.addEventListener("resize", updateViewportCenter);
    return () => window.removeEventListener("resize", updateViewportCenter);
  }, []);

  return (
    <section ref={containerRef} className="case-studies py-4 py-md-5 overflow-hidden">
      <div className="container text-center mb-4 mb-md-5">
        <h2
          className="display-5 fw-bold text-uppercase anton-font mb-0 case-studies-heading"
          style={{ color: "#FA6400" }}
        >
          IMPACT HIGHLIGHTS
        </h2>
      </div>

      <ScrollResponsiveMarquee direction="right" className="marquee-right">
        {[0, 1].map((copy) => (
          <div key={copy} className="d-flex" style={{ gap: 0 }}>
            {industriesRow1.map((item, idx) => (
              <IndustryCard
                key={`${item.id}-c${copy}-a`}
                industry={item}
                index={idx}
                totalCards={industriesRow1.length}
                viewportCenter={viewportCenter}
              />
            ))}
            <AnimatedCard startIndex={0} />
            {industriesRow1.map((item, idx) => (
              <IndustryCard
                key={`${item.id}-c${copy}-b`}
                industry={item}
                index={idx + industriesRow1.length}
                totalCards={industriesRow1.length * 2}
                viewportCenter={viewportCenter}
              />
            ))}
            <AnimatedCard startIndex={0} />
          </div>
        ))}
      </ScrollResponsiveMarquee>

      <ScrollResponsiveMarquee direction="left" className="marquee-left mt-3 mt-md-4">
        {[0, 1].map((copy) => (
          <div key={copy} className="d-flex" style={{ gap: 0 }}>
            <AnimatedCard startIndex={2} />
            {industriesRow2.map((item, idx) => (
              <IndustryCard
                key={`${item.id}-c${copy}`}
                industry={item}
                index={idx}
                totalCards={industriesRow2.length}
                viewportCenter={viewportCenter}
              />
            ))}
            <AnimatedCard startIndex={2} />
            {industriesRow2.map((item, idx) => (
              <IndustryCard
                key={`${item.id}-c${copy}-dup`}
                industry={item}
                index={idx + industriesRow2.length}
                totalCards={industriesRow2.length * 2}
                viewportCenter={viewportCenter}
              />
            ))}
          </div>
        ))}
      </ScrollResponsiveMarquee>
    </section>
  );
}

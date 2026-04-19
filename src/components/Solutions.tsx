"use client";

import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

// Premium easing
const smoothEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

const solutions = [
  {
    id: "01",
    title: "AI Holobox Technology",
    heading: "Intelligent. Immersive. Unforgettable.",
    image: "/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg",
  },
  {
    id: "02",
    title: "Conversational AI",
    heading: "Meaningful Conversations Everywhere.",
    image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg",
  },
  {
    id: "03",
    title: "AI Holobox Integration Services",
    heading: "Intelligent MetaHumans. Instant Business Interactions.",
    image: "/Tymore%20Ai%20with%20Holobox/2.3-—-AI-Integration-Services.jpg",
  },
  {
    id: "04",
    title: "MetaHuman And Avatar Production",
    heading: "Designed from Day One for You.",
    image: "/Tymore%20Ai%20with%20Holobox/2.4-—-Avatar-Production-Support.jpg",
  },
  {
    id: "05",
    title: "Managed AI Systems",
    heading: "AI Holobox Never Without Support.",
    image: "/Tymore%20Ai%20with%20Holobox/2.5-—-Managed-AI-Expertise.jpg",
  },
  {
    id: "06",
    title: "Software Development",
    heading: "The Brains Behind the Box.",
    image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI-option-2.jpg",
  },
  {
    id: "07",
    title: "Live Beaming",
    heading: "No Travel Required.",
    image: "/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg",
  },
];

const ACTIVE_SOLUTION_COLOR = "#fa6400";

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // LIVE SCROLL COUNTER: Non-linear mapping for centering without initial/terminal gaps
  const stepY = 187; // Matches line-height of .solutions-big-number (187px)
  const tStops = [0];
  const tValues = [0];
  for (let i = 0; i < solutions.length; i++) {
    tStops.push((i + 0.5) / solutions.length);
    tValues.push(-i * stepY);
  }
  tStops.push(1);
  tValues.push(-(solutions.length - 1) * stepY);
  const tickerY = useTransform(scrollYProgress, tStops, tValues);

  // More responsive spring: higher stiffness for faster catch-up, balanced damping
  const smoothTickerY = useSpring(tickerY, { stiffness: 100, damping: 25, restDelta: 0.001 });

  // Number scale spring for emphasis when changing
  const numberScale = useSpring(1, { stiffness: 300, damping: 20 });

  // Map scroll progress to the active index with improved alignment
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const count = solutions.length;
      const newIndex = Math.min(
        Math.floor(latest * count),
        count - 1
      );
      setActiveIndex((prevIndex) => {
        if (newIndex !== prevIndex) {
          // Number emphasis animation on change
          numberScale.set(1.12);
          setTimeout(() => numberScale.set(1), 150);
        }
        return newIndex;
      });
    });
  }, [scrollYProgress, numberScale]);

  const handleTabClick = useCallback((index: number) => {
    if (!containerRef.current) return;

    // Calculate the scroll position required to reach the center of this item's visual range
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const start = rect.top + scrollTop;
    const scrollableDistance = rect.height - window.innerHeight;

    // Target progress is the middle of the range assigned to this index
    const targetProgress = (index + 0.5) / solutions.length;
    const targetScroll = start + (targetProgress * scrollableDistance);

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  // Adjust transformations for mobile
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 992 : false;

  // Horizontal movement for the image track with non-linear mapping to avoid gaps
  const xStops = [0];
  const xValues = [isMobile ? "0%" : "0vw"];
  for (let i = 0; i < solutions.length; i++) {
    xStops.push((i + 0.5) / solutions.length);
    xValues.push(isMobile ? "0%" : `-${i * 56}vw`);
  }
  xStops.push(1);
  xValues.push(isMobile ? "0%" : `-${(solutions.length - 1) * 56}vw`);
  const x = useTransform(scrollYProgress, xStops, xValues);

  return (
    <section ref={containerRef} className="solutions-scroll-section" id="solutions">
      <div className={`${isMobile ? "" : "solutions-sticky-wrapper"}`}>
        <div className="solutions-main-header">INTELLIGENT SOLUTIONS</div>
        <div className="container-fluid h-100 p-0">
          <div className="row g-0 h-100">
            {/* LEFT CONTENT AREA */}
            <div className="col-lg-6 position-relative d-flex flex-column justify-content-between p-6 p-lg-10 bg-white text-center text-lg-start">
              {/* Focus Pull: Container dims slightly when user is engaged */}
              <motion.div
                className="solutions-left-top"
                animate={{
                  opacity: 1,
                }}
                transition={{ duration: 0.4 }}
              >
                <div className="solutions-list" style={{ paddingBottom: '30px' }}>
                  {solutions.map((item, index) => {
                    const isActive = index === activeIndex;
                    const distanceFromActive = Math.abs(index - activeIndex);
                    // Focus pull: items further from active get more dimmed
                    const focusOpacity = isActive ? 1 : Math.max(0.35, 0.7 - distanceFromActive * 0.15);

                    return (
                      <motion.div
                        key={item.id}
                        onClick={() => handleTabClick(index)}
                        className={`solution-list-item ${isActive ? "active" : ""}`}
                        animate={{
                          x: isActive ? 12 : 0,
                          scale: isActive ? 1.04 : 1,
                          opacity: focusOpacity,
                          y: isActive ? 0 : distanceFromActive * 2, // Slight vertical spread for depth
                        }}
                        whileHover={{
                          x: isActive ? 12 : 6,
                          opacity: 1,
                          scale: isActive ? 1.04 : 1.02,
                        }}
                        whileTap={{
                          scale: 0.96,
                          x: isActive ? 10 : 4,
                        }}
                        transition={{
                          duration: isActive ? 0.4 : 0.5, // Slight asymmetry
                          ease: smoothEase,
                          delay: isActive ? 0 : distanceFromActive * 0.03, // Stagger by distance
                        }}
                        style={{
                          cursor: "pointer",
                          color: isActive ? ACTIVE_SOLUTION_COLOR : undefined,
                          transformOrigin: "left center",
                        }}
                      >
                        {item.title}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Large Counter: Simplified Transition */}
              <motion.div
                className="solutions-counter-wrap"
                animate={{
                  x: 0,
                }}
                transition={{ duration: 0.5, ease: smoothEase }}
              >
                <motion.div
                  style={{ y: smoothTickerY, scale: numberScale }}
                  className="solutions-counter-ticker"
                >
                  {solutions.map((item, index) => {
                    const isActive = index === activeIndex;
                    const distanceFromActive = Math.abs(index - activeIndex);
                    return (
                      <motion.div
                        key={item.id}
                        className="solutions-big-number"
                        animate={{
                          opacity: isActive ? 1 : Math.max(0.25, 0.5 - distanceFromActive * 0.1),
                          scale: isActive ? 1 : 0.88,
                          x: isActive ? 0 : -5, // Slight left shift for inactive
                        }}
                        transition={{
                          duration: isActive ? 0.35 : 0.45, // Asymmetric timing
                          ease: smoothEase,
                          delay: isActive ? 0.02 : 0, // Micro lead on active
                        }}
                        style={{ transformOrigin: "left center" }}
                      >
                        {item.id}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>

              {/* Changing Headline at Bottom Left - DELAYED: updates after image */}
              <div className="solutions-bottom-left">
                <AnimatePresence mode="popLayout">
                  <motion.h2
                    key={activeIndex}
                    initial={{ y: 16, opacity: 0, filter: 'blur(4px)', scale: 0.92 }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ y: -16, opacity: 0, filter: 'blur(4px)', scale: 0.88 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.08, // Delayed after image arrives
                      ease: smoothEase,
                    }}
                    className="solutions-dynamic-heading"
                    style={{ position: 'relative', transformOrigin: 'left center' }}
                  >
                    {solutions[activeIndex].heading.split('\n').map((line, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8, x: i % 2 === 0 ? -3 : 3 }} // Slight asymmetry per line
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.08 + i * 0.1, // Staggered reveal
                          ease: smoothEase,
                        }}
                      >
                        {line}<br />
                      </motion.span>
                    ))}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT SIDE (Horizontal Image Scroll) - MAIN EVENT */}
            <div className="col-lg-6 overflow-hidden position-relative bg-black h-100">
              <motion.div style={{ x }} className="solutions-image-track">
                {solutions.map((item, index) => {
                  const isActive = index === activeIndex;
                  const distanceFromActive = Math.abs(index - activeIndex);

                  // Depth illusion: active forward, inactive recessed
                  const shadowOpacity = isActive ? 0.3 : 0;

                  return (
                    <motion.div
                      key={item.id}
                      className="solutions-image-box"
                      animate={{
                        scale: isActive ? 1 : 0.88,
                        opacity: isActive ? 1 : Math.max(0.3, 0.6 - distanceFromActive * 0.1),
                        z: isActive ? 20 : 0, // Forward when active
                        y: isActive ? 0 : distanceFromActive * 3, // Vertical spread for depth
                      }}
                      transition={isActive ? {
                        // Snap-then-smooth spring for impact moment
                        type: "spring",
                        stiffness: 400,
                        damping: 22,
                        mass: 0.8,
                        delay: 0.04,
                      } : {
                        duration: 0.7,
                        ease: smoothEase,
                      }}
                      style={{
                        zIndex: isActive ? 10 : 1,
                        boxShadow: isActive
                          ? `0 25px 50px -12px rgba(0,0,0,${shadowOpacity})`
                          : 'none',
                      }}
                    >
                      <motion.img
                        src={item.image}
                        alt={item.title}
                        initial={{ y: 0 }}
                        animate={{
                          scale: isActive ? 1.08 : 1,
                          y: isActive ? 0 : 10, // Arrival motion: slides up when active
                        }}
                        transition={{
                          duration: isActive ? 0.7 : 0.5,
                          delay: isActive ? 0.06 : 0,
                          ease: smoothEase,
                        }}
                        style={{
                          transformOrigin: "center center",
                        }}
                      />
                      {/* Impact ring effect - subtle moment of emphasis */}
                      <motion.div
                        className="solutions-image-impact"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={isActive ? {
                          scale: [1, 1.06, 1],
                          opacity: [0, 0.15, 0],
                        } : {
                          scale: 0.8,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          ease: [0.23, 1, 0.32, 1],
                          times: [0, 0.5, 1],
                        }}
                        style={{
                          position: "absolute",
                          inset: "-10%",
                          borderRadius: "8px",
                          border: "2px solid var(--accent)",
                          pointerEvents: "none",
                          zIndex: 20,
                        }}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

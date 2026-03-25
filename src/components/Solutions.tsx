"use client";

import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const solutions = [
  {
    id: "01",
    title: "AI Holobox Technology",
    heading: "The Design, the Brain,\nand the Presence",
    image: "/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg",
  },
  {
    id: "02",
    title: "Conversational AI",
    heading: "Meaningful Conversation Across\nany Language or Industry",
    image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI.jpg",
  },
  {
    id: "03",
    title: "AI Holobox Integration Services",
    heading: "Connecting AI, Avatars and Business\nSystems for real-time interactions",
    image: "/Tymore%20Ai%20with%20Holobox/2.3-—-AI-Integration-Services.jpg",
  },
  {
    id: "04",
    title: "Avatar & Metahuman Production",
    heading: "Your MetaHuman, Crafted\nfrom the ground up",
    image: "/Tymore%20Ai%20with%20Holobox/2.4-—-Avatar-Production-Support.jpg",
  },
  {
    id: "05",
    title: "Managed AI Systems",
    heading: "End-to-end support\nfor Holobox AI",
    image: "/Tymore%20Ai%20with%20Holobox/2.5-—-Managed-AI-Expertise.jpg",
  },
  {
    id: "06",
    title: "Live Beaming",
    heading: "Be anywhere in the world\nwithout leaving the room",
    image: "/Tymore%20Ai%20with%20Holobox/2.2-—-Conversational-AI-option-2.jpg",
  },
];

export default function Solutions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Map scroll progress to the active index with improved alignment
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      const count = solutions.length;
      const index = Math.min(
        Math.floor(latest * count),
        count - 1
      );
      setActiveIndex(index);
    });
  }, [scrollYProgress]);

  const handleTabClick = (index: number) => {
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
  };

  // Adjust transformations for mobile
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 992 : false;

  // Horizontal movement for the image track
  const x = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : `-${(solutions.length - 1) * 50}vw`]);

  // LIVE SCROLL COUNTER: Direct mapping for the "real counter up" feel
  const tickerY = useTransform(scrollYProgress, [0, 1], [0, -(solutions.length - 1) * 187]);
  // Heavier spring: less stiffness, more damping for fluid, organic motion
  const smoothTickerY = useSpring(tickerY, { stiffness: 40, damping: 30, restDelta: 0.001 });

  return (
    <section ref={containerRef} className="solutions-scroll-section" id="solutions">
      <div className={`${isMobile ? "" : "solutions-sticky-wrapper"}`}>
        <div className="solutions-main-header">INTELLIGENT SERVICES</div>
        <div className="container-fluid h-100 p-0">
          <div className="row g-0 h-100">
            {/* LEFT CONTENT AREA */}
            <div className="col-lg-6 position-relative d-flex flex-column justify-content-between p-6 p-lg-10 bg-white text-center text-lg-start">
              <div className="solutions-left-top">
                <div className="solutions-list" style={{ paddingBottom: '30px' }}>
                  {solutions.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleTabClick(index)}
                      className={`solution-list-item ${index === activeIndex ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>

              {/* Large Counter: Simplified Transition */}
              <div className="solutions-counter-wrap">
                <motion.div
                  style={{ y: smoothTickerY }}
                  className="solutions-counter-ticker"
                >
                  {solutions.map((item) => (
                    <div key={item.id} className="solutions-big-number">
                      {item.id}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Changing Headline at Bottom Left */}
              <div className="solutions-bottom-left">
                <AnimatePresence mode="popLayout">
                  <motion.h2
                    key={activeIndex}
                    initial={{ y: 0, opacity: 0, filter: 'blur(2px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: 0, opacity: 0, filter: 'blur(2px)' }}
                    transition={{
                      duration: 1.0,
                      ease: [0.25, 0, 0.35, 0.5] // Gentle ease-in-out for slow motion
                    }}
                    className="solutions-dynamic-heading"
                    style={{ position: 'relative' }}
                  >
                    {solutions[activeIndex].heading.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT SIDE (Horizontal Image Scroll) */}
            <div className="col-lg-6 overflow-hidden position-relative bg-black h-100">
              <motion.div style={{ x }} className="solutions-image-track">
                {solutions.map((item) => (
                  <div key={item.id} className="solutions-image-box">
                    <img src={item.image} alt={item.title} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

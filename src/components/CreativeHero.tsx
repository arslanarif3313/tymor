"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export default function CreativeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Cursor Following Logic for the Bottom Section
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Softer springs for a "friendly" magnetic feel
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Magnestism range: reduced slightly to 600px for a more balanced area
    const maxDistance = 600;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < maxDistance) {
      // Pull button towards cursor (slightly adjusted multiplier for larger range)
      mouseX.set(distanceX * 0.35);
      mouseY.set(distanceY * 0.35);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Row 1: get the [VIDEO] left-size
  // Starting at 20px / -20px to make them "more in touch" with the video
  const xLeft1 = useTransform(scrollYProgress, [0.1, 0.75], ["18px", "-25vw"]);
  const xRight1 = useTransform(scrollYProgress, [0.1, 0.75], ["-18px", "25vw"]);

  // Row 2: intelligence [IMG] that
  const xLeft2 = useTransform(scrollYProgress, [0.15, 0.85], ["25px", "-25vw"]);
  const xRight2 = useTransform(scrollYProgress, [0.15, 0.85], ["-29px", "25vw"]);

  // Row 3: makes [IMG] futures
  const xLeft3 = useTransform(scrollYProgress, [0.2, 0.95], ["25px", "-25vw"]);
  const xRight3 = useTransform(scrollYProgress, [0.2, 0.95], ["-18px", "25vw"]);
  return (
    <section ref={containerRef} className="hero-scroll-container">
      <div
        className="hero-sticky-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero-content-inner">

          {/* Row 1: get the intelligence makes [VIDEO] left-size that futures */}
          <div className="hero-row">
            <motion.span style={{ x: xLeft1 }} className="hero-text">
              get the
            </motion.span>
            {/* Image: static, no animation */}
            <div
              className="hero-img-box"
              style={{ width: '200px', height: '115px', margin: '0 15px', flexShrink: 0, borderRadius: '50px' }}
            >
              <video autoPlay muted loop playsInline>
                <source src="/1.mp4" type="video/mp4" />
              </video>
            </div>
            <motion.span style={{ x: xRight1 }} className="hero-text">
              left-size
            </motion.span>
          </div>

          {/* Row 2: intelligence [IMG] that */}
          <div className="hero-row" style={{ marginTop: '-30px' }}>
            <motion.span style={{ x: xLeft2 }} className="hero-text">
              intelligence
            </motion.span>
            {/* Row 2 Image: bigger, no roundness */}
            <div
              className="hero-img-box"
              style={{ width: '360px', height: '300px', margin: '0 20px', flexShrink: 0 }}
            >
              <img src="/Tymore%20Ai%20with%20Holobox/Hero-Banner.jpg" alt="Creative Experience" />
            </div>
            <motion.span style={{ x: xRight2 }} className="hero-text">
              that
            </motion.span>
          </div>

          {/* Row 3: makes [IMG] futures */}
          <div className="hero-row" style={{ marginTop: '-60px' }}>
            <motion.span style={{ x: xLeft3 }} className="hero-text">
              shapes
            </motion.span>
            {/* Row 3 Image: bigger, no roundness */}
            <div
              className="hero-img-box"
              style={{ width: '280px', height: '180px', margin: '0 15px', flexShrink: 0 }}
            >
              <img src="/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg" alt="Shaping Tomorrow" />
            </div>
            <motion.span style={{ x: xRight3 }} className="hero-text">
              tomorrow now
            </motion.span>
          </div>

          {/* Bottom Controls / Info */}
          <div className="hero-bottom-row">
            <motion.a
              ref={buttonRef}
              href="#"
              className="about-btn-circle"
              style={{ x: springX, y: springY }}
            >
              About<br />Us
            </motion.a>
            <div className="strategic-expertise">
              <div className="strategic-line"></div>
              <p>GET THE STRATEGIC EXPERTISE YOU NEED</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

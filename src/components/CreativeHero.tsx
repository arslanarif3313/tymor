"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export default function CreativeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
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
  // Now using ["start start", "end end"] offset. 
  // 1.0 = bottom of hero at bottom of screen.
  // 0.8 = finish well before next section enters.
  // Reduced travel distance as requested by user.
  const xLeft1 = useTransform(scrollYProgress, [0.1, 0.6], ["18px", "-6vw"]);
  const xRight1 = useTransform(scrollYProgress, [0.1, 0.6], ["-18px", "6vw"]);

  // Row 2: intelligence [IMG] that
  const xLeft2 = useTransform(scrollYProgress, [0.15, 0.6], ["25px", "-5vw"]);
  const xRight2 = useTransform(scrollYProgress, [0.15, 0.6], ["-29px", "5vw"]);

  // Row 3: makes [IMG] futures
  const xLeft3 = useTransform(scrollYProgress, [0.2, 0.6], ["25px", "-6vw"]);
  const xRight3 = useTransform(scrollYProgress, [0.2, 0.6], ["-18px", "6vw"]);
  return (
    <section ref={containerRef} className="pt-12 hero-scroll-container">
      <div
        className="hero-sticky-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero-content-inner xl:!mt-10">

          <div className="hero-row hero-row-1">
            <motion.span style={{ x: xLeft1 }} className="hero-text">
              unlock
            </motion.span>
            <div className="hero-img-box video-box">
              <video autoPlay muted loop playsInline>
                <source src="./1.mp4" type="video/mp4" />
              </video>
            </div>
            <motion.span style={{ x: xRight1 }} className="hero-text">
              life-size
            </motion.span>
          </div>

          <div className="hero-row hero-row-2 !-mt-8">
            <motion.span style={{ x: xLeft2 }} className="hero-text">
              intelligence
            </motion.span>
            <div className="hero-img-box main-img-box">
              <img src="/Tymore%20Ai%20with%20Holobox/Hero-Banner.jpg" alt="Creative Experience" />
            </div>
            <motion.span style={{ x: xRight2 }} className="hero-text">
              that
            </motion.span>
          </div>

          <div className="hero-row hero-row-3 !-mt-16">
            <motion.span style={{ x: xLeft3 }} className="hero-text">
              defines
            </motion.span>
            <div className="hero-img-box sub-img-box">
              <img src="/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg" alt="Shaping Tomorrow" />
            </div>
            <motion.span style={{ x: xRight3 }} className="hero-text">
              experience
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

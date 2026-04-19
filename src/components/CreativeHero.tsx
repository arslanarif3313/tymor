"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef } from "react";

// Premium easing curve: smooth, elegant deceleration
const smoothEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function CreativeHero() {
  const containerRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Cursor Following Logic - Softer, more premium feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Reduced stiffness and increased damping for gentler, more controlled magnetic feel
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25, mass: 0.8 });

  // Magnetic button scale spring
  const buttonScale = useMotionValue(1);
  const buttonSpringScale = useSpring(buttonScale, { stiffness: 300, damping: 25 });

  // Bounded cursor-follow interaction zone
  // Horizontal: within strategic text width (~400px total range)
  // Vertical: from button position up to "defines" word (~120px upward max)
  const BOUNDED_RANGE_X = 200; // Half-width of interaction zone (±200px from center)
  const BOUNDED_RANGE_Y_UP = 100; // Max upward movement toward "defines"
  const BOUNDED_RANGE_Y_DOWN = 15; // Minimal downward movement

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Raw cursor offset from button center
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;

    // Calculate bounded movement using direct position mapping
    // X: Map cursor position to horizontal bounds (clamped)
    const targetX = Math.max(-BOUNDED_RANGE_X, Math.min(BOUNDED_RANGE_X, offsetX * 0.6));

    // Y: Map cursor position to vertical bounds (clamped)
    // Upward movement (negative Y) has larger range than downward
    let targetY: number;
    if (offsetY < 0) {
      // Cursor above button - allow upward movement toward "defines"
      targetY = Math.max(-BOUNDED_RANGE_Y_UP, offsetY * 0.5);
    } else {
      // Cursor below button - very limited downward movement
      targetY = Math.min(BOUNDED_RANGE_Y_DOWN, offsetY * 0.15);
    }

    // Apply bounded position (no distance-based falloff - pure constrained follow)
    mouseX.set(targetX);
    mouseY.set(targetY);

    // Subtle scale based on vertical position (lifts feel lighter)
    const liftFactor = Math.abs(targetY) / BOUNDED_RANGE_Y_UP;
    buttonScale.set(1 + liftFactor * 0.03);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    buttonScale.set(1);
  };

  // STAGGERED SCROLL RANGES with different start/end points for organic flow
  // Row 1 (unlock/ life-size): Early start, moves faster (text layer)
  const xLeft1Raw = useTransform(scrollYProgress, [0.05, 0.55], ["18px", "-8vw"]);
  const xRight1Raw = useTransform(scrollYProgress, [0.05, 0.55], ["-18px", "8vw"]);

  // Row 2 (intelligence/ that): Slightly delayed start, medium speed
  const xLeft2Raw = useTransform(scrollYProgress, [0.12, 0.62], ["25px", "-6vw"]);
  const xRight2Raw = useTransform(scrollYProgress, [0.12, 0.62], ["-29px", "6vw"]);

  // Row 3 (defines/ experiences): Latest start, completes last
  const xLeft3Raw = useTransform(scrollYProgress, [0.18, 0.68], ["25px", "-7vw"]);
  const xRight3Raw = useTransform(scrollYProgress, [0.18, 0.68], ["-18px", "7vw"]);

  // Spring-smoothed transforms for buttery motion (not linear)
  const xLeft1 = useSpring(xLeft1Raw, { stiffness: 60, damping: 25, mass: 0.6 });
  const xRight1 = useSpring(xRight1Raw, { stiffness: 60, damping: 25, mass: 0.6 });
  const xLeft2 = useSpring(xLeft2Raw, { stiffness: 55, damping: 25, mass: 0.7 });
  const xRight2 = useSpring(xRight2Raw, { stiffness: 55, damping: 25, mass: 0.7 });
  const xLeft3 = useSpring(xLeft3Raw, { stiffness: 50, damping: 25, mass: 0.8 });
  const xRight3 = useSpring(xRight3Raw, { stiffness: 50, damping: 25, mass: 0.8 });

  // PARALLAX DEPTH: Images move slower than text (0.6x speed factor)
  // This creates depth perception - foreground text faster, images slower
  const imgX1Raw = useTransform(scrollYProgress, [0.05, 0.55], ["0px", "-3vw"]);
  const imgX2Raw = useTransform(scrollYProgress, [0.12, 0.62], ["0px", "-2.5vw"]);
  const imgX3Raw = useTransform(scrollYProgress, [0.18, 0.68], ["0px", "-3.5vw"]);

  const imgX1 = useSpring(imgX1Raw, { stiffness: 45, damping: 30, mass: 1 });
  const imgX2 = useSpring(imgX2Raw, { stiffness: 40, damping: 30, mass: 1 });
  const imgX3 = useSpring(imgX3Raw, { stiffness: 38, damping: 30, mass: 1 });

  // Subtle scale animation for images during scroll (cinematic depth)
  const scale1 = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 1.02]),
    { stiffness: 40, damping: 25 }
  );
  const scale2 = useSpring(
    useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.98, 1, 1.01]),
    { stiffness: 35, damping: 25 }
  );
  const scale3 = useSpring(
    useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.98, 1, 1.01]),
    { stiffness: 35, damping: 25 }
  );

  // Scroll-based opacity - only for exit fade (starts at 1, entrance handles initial reveal)
  const opacity1 = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 1, 0.7]),
    { stiffness: 50, damping: 25 }
  );
  const opacity2 = useSpring(
    useTransform(scrollYProgress, [0, 0.55, 0.75], [1, 1, 0.7]),
    { stiffness: 45, damping: 25 }
  );
  const opacity3 = useSpring(
    useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 1, 0.7]),
    { stiffness: 40, damping: 25 }
  );

  // Entrance animation variants - staggered flow
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.75,
        ease: smoothEase,
      },
    },
  };

  return (
    <section ref={containerRef} className="pt-12 hero-scroll-container">
      <div
        className="hero-sticky-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="hero-content-inner xl:!mt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Row 1: unlock [VIDEO] life-size */}
          <motion.div
            className="hero-row hero-row-1"
            style={{ opacity: opacity1 }}
            variants={rowVariants}
          >
            <motion.span
              style={{ x: xLeft1 }}
              className="hero-text"
            >
              unlock
            </motion.span>
            <motion.div
              className="hero-img-box video-box"
              style={{ x: imgX1, scale: scale1 }}
            >
              <video autoPlay muted loop playsInline>
                <source src="./1.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <motion.span
              style={{ x: xRight1 }}
              className="hero-text"
            >
              life-size
            </motion.span>
          </motion.div>

          {/* Row 2: intelligence [IMG] that */}
          <motion.div
            className="hero-row hero-row-2 !-mt-8"
            style={{ opacity: opacity2 }}
            variants={rowVariants}
          >
            <motion.span
              style={{ x: xLeft2 }}
              className="hero-text"
            >
              intelligence
            </motion.span>
            <motion.div
              className="hero-img-box main-img-box"
              style={{ x: imgX2, scale: scale2 }}
            >
              <img
                src="/Tymore%20Ai%20with%20Holobox/Hero-Banner.jpg"
                alt="Creative Experiences"
              />
            </motion.div>
            <motion.span
              style={{ x: xRight2 }}
              className="hero-text"
            >
              that
            </motion.span>
          </motion.div>

          {/* Row 3: defines [IMG] experiences */}
          <motion.div
            className="hero-row hero-row-3 !-mt-16"
            style={{ opacity: opacity3 }}
            variants={rowVariants}
          >
            <motion.span
              style={{ x: xLeft3 }}
              className="hero-text"
            >
              defines
            </motion.span>
            <motion.div
              className="hero-img-box sub-img-box"
              style={{ x: imgX3, scale: scale3 }}
            >
              <img
                src="/Tymore%20Ai%20with%20Holobox/2.1-—-Holobox-AI-Presence.jpg"
                alt="Shaping Tomorrow"
              />
            </motion.div>
            <motion.span
              style={{ x: xRight3 }}
              className="hero-text"
            >
              experience<span style={{ display: "inline" }}>s</span>
            </motion.span>
          </motion.div>

          {/* Bottom Controls / Info */}
          <motion.div
            className="hero-bottom-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: smoothEase }}
          >
            <motion.a
              ref={buttonRef}
              href="#"
              className="about-btn-circle"
              style={{
                x: springX,
                y: springY,
                scale: buttonSpringScale,
              }}
              whileHover={{ backgroundColor: "var(--accent)" }}
              transition={{ duration: 0.3, ease: smoothEase }}
            >
              About
              <br />
              Us
            </motion.a>
            <div className="strategic-expertise">
              <div className="strategic-line"></div>
              <p>GET THE STRATEGIC EXPERTISE YOU NEED</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

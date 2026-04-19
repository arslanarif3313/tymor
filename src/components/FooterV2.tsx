"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";

// ==========================================
// UNDERLINED LINK
// ==========================================
function UnderlinedLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Link
      {...props}
      className="group relative transition-colors duration-300 no-underline inline-block"
      style={{
        color: "rgba(250, 100, 0, 0.7)",
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        fontSize: "10px",
        lineHeight: "13px",
      }}
    >
      <span className="group-hover:text-orange-500 transition-colors">
        {children}
      </span>
      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-orange-500/30 origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
      <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-75" />
    </Link>
  );
}

// ==========================================
// SPLIT TEXT ANIMATION - SINGLE ENTRANCE
// ==========================================
function SplitText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = text.split("");

  return (
    <strong className="inline-block group cursor-default">
      {characters.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block relative"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.04 + delay,
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
          whileHover={{
            scale: 1.05,
            y: -2,
            color: "#fff",
            transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </strong>
  );
}

// ==========================================
// ROTATING SMILEY CANVAS - SMOOTH TRACKING
// ==========================================
function SmileyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRotation = useMotionValue(0);

  // Smoother rotation with increased damping and reduced stiffness
  const rotation = useSpring(targetRotation, { stiffness: 80, damping: 35, mass: 1.2 });

  // Track previous angle for continuous rotation
  const prevAngleRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate angle from center to mouse
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const degrees = angle * (180 / Math.PI);

      if (prevAngleRef.current === null) {
        prevAngleRef.current = degrees;
      } else {
        // Calculate delta with reduced sensitivity (0.4x multiplier)
        let delta = degrees - prevAngleRef.current;
        // Handle wrap-around
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        // Apply reduced sensitivity for smoother, less reactive movement
        const newRotation = targetRotation.get() + (delta * 0.4);
        targetRotation.set(newRotation);
        prevAngleRef.current = degrees;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [targetRotation]);

  return (
    <div
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 z-[50] pointer-events-none select-none"
      style={{
        bottom: "clamp(-8rem, -12rem, -8rem)",
        width: "clamp(28rem, 35rem, 35rem)",
        height: "clamp(28rem, 35rem, 35rem)",
        borderRadius: "100%",
      }}
    >
      <div className="relative w-full h-full">
        {/* Smiley Base */}
        <Image
          src="/loveable/smiley-base.png"
          alt=""
          fill
          className="object-contain"
          priority
        />
        {/* Rotating Text - replaces smiley face */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[70%] h-[70%] flex items-center justify-center"
          style={{
            rotate: rotation,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <span
            className="text-center font-black leading-tight"
            style={{
              color: "#fff",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "block" }}>One Demo</span>
            <span style={{ display: "block" }}>Game Over</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN FOOTER V2 COMPONENT
// ==========================================
export function FooterV2() {
  return (
    <footer
      className="relative bg-black flex flex-col justify-start h-screen overflow-hidden z-10"
      data-section="in-view"
    >
      {/* Left Corner SVG */}
      <div className="absolute left-0 bottom-0 z-[1] pointer-events-none">
        <svg
          width="220"
          height="194"
          viewBox="0 0 220 194"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="scale(-1,1) translate(-220,0)">
            <g clip-path="url(#clip0_1170_1020)">
              <path
                d="M220 177.005C219.873 177.005 219.746 177.005 219.615 177.005C126.904 177.005 50.6872 105.126 43.7035 14.1728H69.9239V0H0V14.1728H27.4229C30.6371 60.5089 50.1974 103.64 83.362 136.804C119.758 173.2 168.145 193.242 219.615 193.242C219.742 193.242 219.869 193.242 220 193.242V177.009V177.005Z"
                fill="#FFFFFF"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_1170_1020">
              <rect width="220" height="193.237" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Right Corner SVG */}
      <div className="absolute right-0 bottom-0 z-[1] pointer-events-none">
        <svg
          width="220"
          height="194"
          viewBox="0 0 220 194"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="scale(-1,1) translate(-220,0)">
            <path
              d="M220 14.1778V0H159.051V14.1778H175.626C168.651 105.036 92.5936 176.862 0 177.067V193.305C88.4848 193.126 163.151 133.046 185.537 51.5536H208.264V37.3758H188.854C190.329 29.7904 191.352 22.0475 191.908 14.1778H219.996H220Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>

      <div className="footer__block w-full mx-auto px-4 md:px-6 flex flex-col relative z-[2]">
        {/* Copyright */}
        {/* <div className="footer__copyright mb-8">
          <UnderlinedLink href="#">© 2026 The Happy Few</UnderlinedLink>
        </div> */}

        {/* Main Heading - Bring Holobox to life */}
        <h3
          className="w-full flex flex-col m-0 p-0"
          style={{
            color: "rgb(240, 199, 19)",
            fontFamily: "'ABC Ginto Nord Ultra', sans-serif",
            fontWeight: 700,
            lineHeight: "0.95",
            letterSpacing: "-0.02em",
            marginTop: "0",
          }}
        >
          <motion.span
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(6rem, 13vw, 14rem)",
              display: "block",
              fontFamily: "'Inter', sans-serif",
              // textTransform: "capitalize",
              fontWeight: 400,
              lineHeight: "1",
            }}
          >
            <SplitText text="Bring" delay={0.5} />
          </motion.span>
          <div className="flex flex-row justify-between items-end">
            <motion.span
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(4rem, 10vw, 8rem)",
                fontFamily: "'Inter', sans-serif",
                textTransform: "lowercase",
                fontWeight: 400,
                lineHeight: "0.85",
              }}
            >
              <SplitText text="holobox" delay={0.8} />
            </motion.span>
            <motion.span
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontSize: "clamp(4rem, 10vw, 8rem)",
                fontFamily: "'Inter', sans-serif",
                textTransform: "lowercase",
                fontWeight: 400,
                lineHeight: "0.85",
              }}
            >
              <SplitText text="to life" delay={1.1} />
            </motion.span>
          </div>
        </h3>

        {/* Decorative Line */}
        <motion.div
          className="footer__line w-full my-8"
          style={{ 
            height: "5px",
            backgroundColor: "rgb(240, 199, 19)", 
            originX: 0 
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        />

        {/* Navigation */}
        {/* <nav className="footer__nav flex flex-col md:flex-row justify-between gap-6 md:gap-12">
          <div className="flex flex-col gap-2">
            <UnderlinedLink href="/files/algemene-voorwaarden-2024.pdf" external>
              Terms & Conditions
            </UnderlinedLink>
            <UnderlinedLink href="https://maps.app.goo.gl/qR7Bs3oD65Sj3YFs8" external>
              4871 CK Etten-Leur
            </UnderlinedLink>
          </div>
          <div className="flex flex-col gap-2">
            <UnderlinedLink href="tel:0767200911">
              076-72 00 911
            </UnderlinedLink>
            <UnderlinedLink href="mailto:hey@thehappyfew.agency">
              hey@thehappyfew.agency
            </UnderlinedLink>
          </div>
        </nav> */}
      </div>

      {/* Rotating Smiley Canvas - positioned at bottom */}
      <SmileyCanvas />
    </footer>
  );
}

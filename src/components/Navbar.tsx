"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Premium cubic-bezier easing: smooth, elegant deceleration
const premiumEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

// Magnetic button component for CTA
function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.25);
    y.set((e.clientY - centerY) * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="#contact"
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: premiumEase }}
    >
      {children}
    </motion.a>
  );
}

// Staggered nav items
const navItems = [
  { href: "/", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#solutions", label: "Solutions" },
  { href: "#project", label: "Project" },
  { href: "#industry", label: "AI By Industry" },
  { href: "#blog", label: "Blog" },
  { href: "#holobox", label: "Holobox" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      className="navbar navbar-expand-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: premiumEase }}
    >
      <div className="container">
        {/* Logo with subtle entrance */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: premiumEase }}
        >
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
            <Image
              src="/images/logo-tymor.png"
              alt="Tymor AI"
              width={150}
              height={60}
              style={{ height: "60px", width: "auto" }}
            />
          </Link>
        </motion.div>

        {/* Hamburger with smooth animation */}
        <motion.button
          className={`navbar-toggler ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: premiumEase }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: premiumEase }}
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.2, ease: premiumEase }}
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25, ease: premiumEase }}
          />
        </motion.button>

        {/* Navigation with staggered entrance */}
        <div className={`collapse navbar-collapse justify-content-end ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav align-items-lg-center">
            {navItems.map((item, index) => (
              <motion.li
                key={item.href}
                className="nav-item"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15 + index * 0.05,
                  ease: premiumEase,
                }}
              >
                <Link
                  href={item.href}
                  className="nav-link"
                  onClick={() => isMenuOpen && setIsMenuOpen(false)}
                >
                  <motion.span
                    className="nav-link-inner"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: premiumEase }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              </motion.li>
            ))}
            <li className="nav-item d-lg-none">
              <Link
                className="nav-link nav-cta"
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>

        {/* CTA with magnetic effect */}
        <motion.div
          className="d-none d-lg-block"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: premiumEase }}
        >
          <MagneticButton className="nav-cta">
            Get Started
          </MagneticButton>
        </motion.div>
      </div>
    </motion.nav>
  );
}

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  { href: "/holobox", label: "Holobox" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ glassmorphic = false, darkMode = false }: { glassmorphic?: boolean; darkMode?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      className="navbar navbar-expand-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: premiumEase }}
      style={
        glassmorphic
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              background: darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderBottom: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            }
          : undefined
      }
    >
      <div className="container d-flex align-items-center justify-content-between">
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

        {/* Navigation items - in the MIDDLE between logo and CTA */}
        <motion.div 
          className="d-none d-lg-flex align-items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease: premiumEase }}
        >
          {navItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <motion.div
                key={item.href}
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
                  style={isActive ? {
                    background: "rgba(249, 101, 1, 0.15)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    color: "#f96501 !important",
                  } : undefined}
                >
                  <motion.span
                    className="nav-link-inner"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: premiumEase }}
                    style={{ display: "inline-block" }}
                  >
                    {item.label}
                    {isActive && (
                      <span 
                        style={{
                          display: "block",
                          width: "100%",
                          height: "2px",
                          background: "#f96501",
                          marginTop: "2px",
                          borderRadius: "1px",
                        }}
                      />
                    )}
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA with magnetic effect - on the RIGHT */}
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

        {/* Hamburger - visible on mobile only */}
        <motion.button
          className={`navbar-toggler d-lg-none ${isMenuOpen ? "active" : ""}`}
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <motion.div 
            className="position-absolute top-100 start-0 end-0 d-lg-none"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, ease: premiumEase }}
            style={{ 
              zIndex: 1000,
              background: glassmorphic 
                ? (darkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.15)")
                : "#212529",
              backdropFilter: glassmorphic ? "blur(20px)" : undefined,
              WebkitBackdropFilter: glassmorphic ? "blur(20px)" : undefined,
            }}
          >
            <div className="container py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="d-block py-2 nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                className="d-block py-2 nav-link nav-cta"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

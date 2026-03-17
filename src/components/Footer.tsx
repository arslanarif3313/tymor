"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";

function MagneticLink({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 1.5); // Significantly increased for extreme drag/range
    y.set((e.clientY - centerY) * 1.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const scrollToTop = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.23, 1, 0.32, 1] as any
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer-area bg-dark text-white overflow-hidden position-relative">
      {/* 1. CREATIVE BACKDROP (MESH GRADIENT) */}
      <div className="footer-creative-backdrop">
        <div className="footer-mesh-orb mesh-1"></div>
        <div className="footer-mesh-orb mesh-2"></div>
        <div className="footer-mesh-orb mesh-3"></div>
      </div>

      <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
        {/* 1. BRANDING & CTA SECTION */}
        <motion.div 
          className="row gy-4 justify-content-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-12 mb-4" variants={itemVariants}>
            <Link href="/" className="d-inline-block">
              <Image
                src="/images/logo-tymor.png"
                alt="Tymor AI"
                width={160}
                height={60}
                style={{ height: "auto", width: "160px" }}
              />
            </Link>
          </motion.div>
          <motion.div className="col-12" variants={itemVariants}>
            <div className="footer-cta-container position-relative d-flex justify-content-center align-items-center">
              <motion.h2 
                className="footer-big-title anton-font text-uppercase m-0 cursor-default position-relative text-center"
                style={{ zIndex: 10 }}
              >
                ONE DEMO<br /><span className="text-highlight-teal">CHANGES</span><br />EVERYTHING
              </motion.h2>
              <div className="footer-cta-button-wrapper position-absolute">
                <MagneticLink>
                  <Link href="/contact" className="footer-cta-btn">
                    Bring HoloBox<br />to Life
                  </Link>
                </MagneticLink>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 2. NEWSLETTER & CONTACT ROW */}
        <motion.div 
          className="row gy-5 align-items-center mt-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Newsletter */}
          <motion.div className="col-lg-4 col-md-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Our Newsletter</h6>
            <div className="newsletter-box-refined">
              <input type="email" placeholder="Your email address" />
              <button type="submit">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div className="col-lg-8" variants={itemVariants}>
            <div className="row gy-4">
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">Call us</span>
                <MagneticLink>
                  <a href="tel:+2135558573" className="footer-contact-link">+(213) 555-8573</a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">Drop us a line</span>
                <MagneticLink>
                  <a href="mailto:inquiry@tymor.com" className="footer-contact-link">inquiry@tymor.com</a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">Teams</span>
                <MagneticLink>
                  <a href="#" className="footer-contact-link">tymor.team</a>
                </MagneticLink>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 2.5 BRAND MARQUEE (CREATIVE ELEMENT) */}
        <motion.div 
          className="footer-marquee-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="footer-marquee-inner">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="footer-marquee-item"><span className="marquee-dot"></span>HOLOGRAPHIC</div>
                <div className="footer-marquee-item"><span className="marquee-dot"></span>AI-DRIVEN</div>
                <div className="footer-marquee-item"><span className="marquee-dot"></span>FUTURE TECH</div>
                <div className="footer-marquee-item"><span className="marquee-dot"></span>TYMOR CORE</div>
                <div className="footer-marquee-item"><span className="marquee-dot"></span>VIRTUAL PRESENCE</div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* 3. LINKS GRID SECTION */}
        <motion.div 
          className="row gy-5 mt-5 pt-5 border-top border-secondary border-opacity-25"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-lg-4" variants={itemVariants}>
            <p className="opacity-50 small" style={{ maxWidth: '320px' }}>
              Pioneering the future of holographic human interaction. Experience the next generation of AI-driven virtual presence.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Quick Links</h6>
            <ul className="list-unstyled footer-nav-list">
              <li><MagneticLink><Link href="/">Home</Link></MagneticLink></li>
              <li><MagneticLink><Link href="/blogs">Blogs</Link></MagneticLink></li>
              <li><MagneticLink><Link href="/careers">Careers</Link></MagneticLink></li>
            </ul>
          </motion.div>

          {/* Experience */}
          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Experience</h6>
            <ul className="list-unstyled footer-nav-list">
              <li><MagneticLink><Link href="/projects">Projects</Link></MagneticLink></li>
              <li><MagneticLink><Link href="/solutions">Solutions</Link></MagneticLink></li>
            </ul>
          </motion.div>

          {/* Locations */}
          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Locations</h6>
            <ul className="list-unstyled footer-nav-list">
              <li className="footer-location-item">Pennsylvania, US</li>
              <li className="footer-location-item">Dubai, UAE</li>
              <li className="footer-location-item">London, UK</li>
              <li className="footer-location-item">Chandigarh, Punjab</li>
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Support</h6>
            <ul className="list-unstyled footer-nav-list">
              <li><MagneticLink><Link href="/contact">Contact Us</Link></MagneticLink></li>
              <li><MagneticLink><Link href="/demo">Request Demo</Link></MagneticLink></li>
            </ul>
          </motion.div>
        </motion.div>

        {/* 4. COPYRIGHT & BACK TOP */}
        <motion.div 
          className="row pt-5 mt-5 border-top border-secondary border-opacity-25 align-items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <p className="opacity-50 small mb-0">© 2026 Tymor, All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <MagneticLink>
              <a href="#" onClick={scrollToTop} className="footer-back-link small text-uppercase opacity-50">
                Back to top ↑
              </a>
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

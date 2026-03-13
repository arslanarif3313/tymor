"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

const industries = [
  { id: 1, name: "Real Estate", image: "/images/industries/real-estate.png", rotate: -70, x: -440, y: 140 },
  { id: 2, name: "Hospitality", image: "/images/industries/hospitality.png", rotate: -50, x: -460, y: -140 },
  { id: 3, name: "Education", image: "/images/industries/education.png", rotate: -25, x: -280, y: -400 },
  { id: 4, name: "Retail", image: "/images/industries/retail.png", rotate: 0, x: 0, y: -480 },
  { id: 5, name: "Healthcare", image: "/images/industries/healthcare.png", rotate: 25, x: 280, y: -400 },
  { id: 6, name: "Marketing", image: "/images/industries/marketing.png", rotate: 50, x: 460, y: -140 },
  { id: 7, name: "Government", image: "/images/industries/government.png", rotate: 70, x: 440, y: 140 },
  { id: 8, name: "Corporate", image: "/images/industries/corporate.png", rotate: 90, x: 120, y: 400 },
];

export default function ProjectBanner() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // CONTENT REVEAL: Delayed even further for "reveal from inside" effect
  const opacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.55, 0.75], [0.5, 1]);
  
  // CARDS FADE: Visible earlier
  const cardsOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  return (
    <section ref={containerRef} className="industry-fan-section py-0" style={{ position: 'relative', zIndex: 9999 }}>
      <div className="container position-relative" style={{ minHeight: '850px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Industry Cards Container */}
        <div className="industry-cards-wrap" style={{ overflow: 'visible' }}>
          {industries.map((ind, index) => {
            // SLOWER BLOOM: Start scale at 0.4 for better initial coverage of central text
            const rotate = useTransform(scrollYProgress, [0.1, 0.8], [0, ind.rotate]);
            const x = useTransform(scrollYProgress, [0.1, 0.8], [0, ind.x]);
            const y = useTransform(scrollYProgress, [0.1, 0.8], [0, ind.y]);
            const scale = useTransform(scrollYProgress, [0.1, 0.8], [0.4, 1]);

            return (
              <motion.div
                key={ind.id}
                className="industry-card"
                style={{
                  rotate,
                  x,
                  y,
                  scale,
                  opacity: cardsOpacity,
                  zIndex: index
                }}
              >
                <div className="industry-card-inner">
                  <img src={ind.image} alt={ind.name} />
                  <div className="industry-card-label">{ind.name}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Central Content: Absolute Centered Reveal */}
        <motion.div 
          className="industry-fan-content"
          style={{ 
            opacity, 
            scale: contentScale, 
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            zIndex: 100,
            width: '100%',
            maxWidth: '600px',
            textAlign: 'center'
          }}
        >
          <h2 className="industry-fan-title">
            YOUR INDUSTRY POWERED BY<br />
            <span className="text-silver">HOLOBOX TECHNOLOGY</span>
          </h2>
          
          <div className="d-flex flex-column align-items-center gap-4 mt-5">
            <Link href="/contact" className="capsule-btn-orange">
              Get a Demo
            </Link>
            
            <Link href="/solutions" className="explore-link">
              Explore our Holobox further
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="ms-2"
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
} 
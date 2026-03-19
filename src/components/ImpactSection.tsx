"use client";

import { useState, useEffect, useRef } from "react";

const impactData = [
  { count: "40", text: "Years of Technology Leadership" },
  { count: "100,000+", text: "Systems Managed Across Industries" },
  { count: "99.9%", text: "Operational Reliability" },
  { count: "7+", text: "Industries Served Across Diverse Environments" },
];

export default function ImpactSection() {
  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return;

      const rect = wrapperRef.current.getBoundingClientRect();
      const scrollStart = 0; // Relative to the top of the wrapper hitting the viewport top

      // The total amount of scroll available for the sticky section
      const totalScrollHeight = wrapperRef.current.offsetHeight - window.innerHeight;

      // Calculate how much we've scrolled into the wrapper
      // When rect.top is 0, we've scrolled exactly to the top of the wrapper.
      const currentScrollDepth = -rect.top;

      const rawProgress = currentScrollDepth / totalScrollHeight;
      const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

      setProgress(clampedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate stage (0 to length - 1)
  const stage = progress * (impactData.length - 1);

  // Translation percentage relative to WHOLE reel
  const translateY = -(stage / impactData.length) * 100;

  // Responsive values for text container height
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 992 : false;
  const isSmallMobile = typeof window !== 'undefined' ? window.innerWidth < 576 : false;

  const textContainerHeight = isSmallMobile ? '80px' : isMobile ? '100px' : '120px';

  return (
    <div className="impact-wrapper" ref={wrapperRef}>
      <section className="impact-section">
        <div className="container">
          <div className="row align-items-center text-white">
            {/* LEFT */}
            <div className="col-lg-3 mb-5 mb-lg-0 text-center text-lg-start">
              <div className="impact-small">01.04</div>
              <h2 className="impact-title">IMPACT HIGHLIGHT</h2>
            </div>

            {/* CENTER NUMBER REEL */}
            <div className="col-lg-6 text-center mb-5 mb-lg-0 d-flex justify-content-center">
              <div className="impact-pill">
                <div
                  className="impact-number-reel"
                  style={{
                    transform: `translateY(${translateY}%)`,
                  }}
                >
                  {impactData.map((item, index) => (
                    <div className="impact-reel-item" key={index}>
                      <span className="impact-number">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT TEXT REEL */}
            <div className="col-lg-3 text-center text-lg-end overflow-hidden d-flex justify-content-center justify-content-lg-end" style={{ height: textContainerHeight, position: 'relative' }}>
              <div
                className="impact-text-reel"
                style={{
                  transform: `translateY(${translateY}%)`,
                }}
              >
                {impactData.map((item, index) => (
                  <div className="impact-reel-item-small" key={index}>
                    <p className="impact-text m-0">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

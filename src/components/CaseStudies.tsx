"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const IMPACT_STATS = [
  { count: "40", text: "Years of Technology Leadership" },
  { count: "100,000+", text: "Systems Managed Across Industries" },
  { count: "99.9%", text: "Operational Reliability" },
  { count: "7+", text: "Industries Served Across Diverse Environments" },
];

const AnimatedCard = ({ startIndex = 0 }: { startIndex?: number }) => {
  const [current, setCurrent] = useState(startIndex % IMPACT_STATS.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMPACT_STATS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const isOrange = current % 2 === 0;
  const stat = IMPACT_STATS[current];

  return (
    <div
      className="marquee-video rounded-0 d-flex flex-column justify-content-center align-items-start px-3 px-md-4"
      style={{
        background: isOrange ? "#fa6400" : "#e0e0e0",
        transition: "background 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            style={{
              fontFamily: "var(--font-anton), 'Anton', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1,
              color: "#0a0a0a",
              letterSpacing: "-0.02em",
            }}
          >
            {stat.count}
          </div>
          <div
            style={{
              marginTop: "6px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 400,
              fontSize: "clamp(11px, 1.2vw, 16px)",
              lineHeight: 1.3,
              color: "#333",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {stat.text}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const industriesRow1 = [
  {
    id: "r1-1",
    name: "Hospitality",
    desc: "Redefined Guest Engagement using our AI-Powered HoloBox Concierge.",
    image: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
  },
  {
    id: "r1-2",
    name: "Retail",
    desc: "AI Holobox Product Specialist Transforms the In-Store Experience for Retail.",
    image: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
  },
  {
    id: "r1-3",
    name: "Real Estate",
    desc: "Realty Group Introduces AI Holobox Advisors to Elevate the Property Buying Experience Leveraging Real-Time Buyer Insights.",
    image: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
  },
];

const industriesRow2 = [
  {
    id: "r2-1",
    name: "Healthcare",
    desc: "Live-Streamed Physician Model Improves Clinical Patient Care Delivery in Hospital Settings.",
    image: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
  },
  {
    id: "r2-2",
    name: "Marketing",
    desc: "HoloBox AI Brand Ambassador Drives Audience Engagement at Marketing Events and Shows.",
    image: "/Tymore%20Ai%20with%20Holobox/3.7-—-Government.jpg",
  },
];

const IndustryCard = ({
  industry,
}: {
  industry: (typeof industriesRow1)[0];
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="industry-marquee-card position-relative overflow-hidden cursor-pointer rounded-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={industry.image}
        alt={industry.name}
        className="w-100 h-100 object-fit-cover"
        style={{ transition: "transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)" }}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="position-absolute top-0 left-0 w-100 h-100 d-flex flex-column justify-content-end p-3 p-md-4"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
          >
            <motion.h4
              className="text-uppercase anton-font mb-2"
              style={{ color: "var(--accent)", letterSpacing: "1px" }}
            >
              {industry.name}
            </motion.h4>
            <motion.p
              className="small text-white-50 m-0"
              style={{ lineHeight: "1.4" }}
            >
              {industry.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CaseStudies() {
  return (
    <section className="case-studies py-4 py-md-5 overflow-hidden">
      <div className="container text-center mb-4 mb-md-5">
        <h2
          className="display-5 fw-bold text-uppercase anton-font mb-0 case-studies-heading"
          style={{ color: "#FA6400" }}
        >
          IMPACT HIGHLIGHTS
        </h2>
      </div>

      <div className="marquee marquee-right">
        <div className="marquee-inner">
          {[0, 1].map((copy) => (
            <div key={copy} className="d-flex" style={{ gap: 0 }}>
              {industriesRow1.map((item) => (
                <IndustryCard key={`${item.id}-c${copy}-a`} industry={item} />
              ))}
              <AnimatedCard startIndex={0} />
              {industriesRow1.map((item) => (
                <IndustryCard key={`${item.id}-c${copy}-b`} industry={item} />
              ))}
              <AnimatedCard startIndex={0} />
            </div>
          ))}
        </div>
      </div>

      <div className="marquee marquee-left mt-3 mt-md-4">
        <div className="marquee-inner">
          {[0, 1].map((copy) => (
            <div key={copy} className="d-flex" style={{ gap: 0 }}>
              <AnimatedCard startIndex={2} />
              {industriesRow2.map((item) => (
                <IndustryCard key={`${item.id}-c${copy}`} industry={item} />
              ))}
              <AnimatedCard startIndex={2} />
              {industriesRow2.map((item) => (
                <IndustryCard key={`${item.id}-c${copy}-dup`} industry={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

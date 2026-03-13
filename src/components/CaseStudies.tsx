"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const industriesRow1 = [
  {
    id: "r1-1",
    name: "Real Estate",
    desc: "Revolutionizing property showcasing with interactive 3D holograms and virtual tours.",
    image: "/Tymore%20Ai%20with%20Holobox/3.1-—-Real-Estate.jpg",
  },
  {
    id: "r1-2",
    name: "Hospitality",
    desc: "Elevating guest experiences with 24/7 holographic concierge and personalized services.",
    image: "/Tymore%20Ai%20with%20Holobox/3.2-—-Hospitality.jpg",
  },
  {
    id: "r1-3",
    name: "Education",
    desc: "Bringing complex concepts to life through immersive virtual instructors and interactive learning.",
    image: "/Tymore%20Ai%20with%20Holobox/3.3-—-Education.jpg",
  },
];

const industriesRow2 = [
  {
    id: "r2-1",
    name: "Healthcare",
    desc: "Empowering patient education and medical training with advanced visual AI and safe interaction.",
    image: "/Tymore%20Ai%20with%20Holobox/3.5-—-Healthcare.jpg",
  },
  {
    id: "r2-2",
    name: "Government",
    desc: "Enhancing public communication with reliable, 24/7 accessible digital meta-humans.",
    image: "/Tymore%20Ai%20with%20Holobox/3.7-—-Government.jpg",
  },
  {
    id: "r2-3",
    name: "Corporate",
    desc: "Future-proofing office interaction, internal communication, and executive presence.",
    image: "/Tymore%20Ai%20with%20Holobox/3.8-—-Corporate.jpg",
  },
];

const IndustryCard = ({ industry }: { industry: typeof industriesRow1[0] }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="industry-marquee-card position-relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: "300px", height: "300px", margin: "0 10px", flexShrink: 0, borderRadius: "20px" }}
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
            className="position-absolute top-0 left-0 w-100 h-100 d-flex flex-column justify-content-end p-4"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
              backdropFilter: "blur(4px)",
              zIndex: 10
            }}
          >
            <motion.h4
              className="text-uppercase anton-font mb-2"
              style={{ color: "#00f0ff", letterSpacing: "1px" }}
            >
              {industry.name}
            </motion.h4>
            <motion.p className="small text-white-50 m-0" style={{ lineHeight: "1.4" }}>
              {industry.desc}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CaseStudies() {
  const videoUrl = "https://html.aqlova.com/videos/pixora/banner-4-1.mp4";

  return (
    <section className="case-studies text-white py-5 overflow-hidden">
      <div className="container text-center mb-5">
        <h2 className="display-5 fw-bold text-uppercase anton-font">CASE STUDIES</h2>
      </div>

      {/* ROW 1 (RIGHT) */}
      <div className="marquee marquee-right">
        <div className="marquee-inner">
          {industriesRow1.map((item) => <IndustryCard key={item.id} industry={item} />)}
          <div className="marquee-video" style={{ width: "400px", height: "300px", borderRadius: "20px" }}>
            <video loop muted autoPlay playsInline className="w-100 h-100 object-fit-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {/* Repeat for seamless loop */}
          {industriesRow1.map((item) => <IndustryCard key={`${item.id}-dup`} industry={item} />)}
          <div className="marquee-video" style={{ width: "400px", height: "300px", borderRadius: "20px" }}>
            <video loop muted autoPlay playsInline className="w-100 h-100 object-fit-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* ROW 2 (LEFT) */}
      <div className="marquee marquee-left mt-4">
        <div className="marquee-inner">
          <div className="marquee-video" style={{ width: "400px", height: "300px", borderRadius: "20px" }}>
            <video loop muted autoPlay playsInline className="w-100 h-100 object-fit-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {industriesRow2.map((item) => <IndustryCard key={item.id} industry={item} />)}
          {/* Repeat */}
          <div className="marquee-video" style={{ width: "400px", height: "300px", borderRadius: "20px" }}>
            <video loop muted autoPlay playsInline className="w-100 h-100 object-fit-cover">
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {industriesRow2.map((item) => <IndustryCard key={`${item.id}-dup`} industry={item} />)}
        </div>
      </div>
    </section>
  );
}

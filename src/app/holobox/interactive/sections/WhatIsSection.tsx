"use client";

import { motion } from "framer-motion";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function WhatIsSection() {
  return (
    <section className="min-h-screen flex items-center py-24 relative" style={{ background: "#ffffff", zIndex: 1 }}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section label */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="block mb-6 text-xs uppercase tracking-[0.3em]"
            style={{ color: "#f96501" }}
          >
            What is Holobox
          </motion.span>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
            style={{ color: "#0f0f0f", letterSpacing: "-0.02em" }}
          >
            Presence Without Distance
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: PREMIUM_EASE }}
            className="text-lg md:text-xl leading-relaxed mb-8"
            style={{ color: "#555", maxWidth: "700px", margin: "0 auto 2rem" }}
          >
            The Holobox creates a life-size holographic window between two points in space. 
            Unlike video calls, you see the full person—gestures, posture, presence—exactly 
            as if they were standing on the other side of glass.
          </motion.p>

          {/* Secondary description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: PREMIUM_EASE }}
            className="text-base leading-relaxed"
            style={{ color: "#777", maxWidth: "600px", margin: "0 auto" }}
          >
            No headsets. No screens to hold. Just natural, human connection across any distance.
          </motion.p>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: PREMIUM_EASE }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {[
              { label: "Life-size", value: "1:1 Scale" },
              { label: "Latency", value: "< 50ms" },
              { label: "Resolution", value: "4K+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: PREMIUM_EASE }}
                className="text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: "#f96501" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider" style={{ color: "#888" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

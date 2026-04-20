"use client";

import { motion } from "framer-motion";
import { Users, Building2, Sparkles, Globe } from "lucide-react";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const useCases = [
  {
    icon: Building2,
    title: "Executive Meetings",
    description: "Board members present from different continents with true presence and authority.",
  },
  {
    icon: Users,
    title: "Healthcare Consultations",
    description: "Doctors connect with patients as if in the same room, reading body language and presence.",
  },
  {
    icon: Sparkles,
    title: "Events & Performances",
    description: "Artists perform in multiple venues simultaneously. Speakers command global stages.",
  },
  {
    icon: Globe,
    title: "Family Connections",
    description: "Grandparents see grandchildren life-size. Hugs feel possible, even across oceans.",
  },
];

export default function UseCasesSection() {
  return (
    <section className="py-24 relative" style={{ background: "#0f0f0f", zIndex: 1 }}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: PREMIUM_EASE }}
            className="block mb-4 text-xs uppercase tracking-[0.3em]"
            style={{ color: "#f96501" }}
          >
            Applications
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
          >
            Use Cases
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: PREMIUM_EASE,
                }}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer"
              >
                <div
                  className="p-8 rounded-xl h-full transition-all duration-500"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300"
                    style={{
                      background: "rgba(249, 101, 1, 0.1)",
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: "#f96501" }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-semibold mb-3"
                    style={{ color: "#ffffff" }}
                  >
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#888", lineHeight: "1.7" }}
                  >
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const steps = [
  {
    number: "01",
    title: "Entry",
    description: "The Holobox detects incoming connection. Internal systems begin warm-up sequence.",
  },
  {
    number: "02",
    title: "Activation",
    description: "Holographic projectors calibrate. The chamber fills with soft amber light.",
  },
  {
    number: "03",
    title: "Energy Build",
    description: "Light particles converge. The space prepares for matter reconstruction.",
  },
  {
    number: "04",
    title: "Human Emergence",
    description: "The hologram materializes. A life-size human form takes shape in real-time.",
  },
  {
    number: "05",
    title: "Presence",
    description: "Connection established. Natural conversation flows as if standing in the same room.",
  },
];

function TimelineStep({
  step,
  index,
  progress,
}: {
  step: (typeof steps)[0];
  index: number;
  progress: MotionValue<number>;
}) {
  // Each step activates at 20% intervals (0-0.2, 0.2-0.4, etc.)
  const stepStart = index * 0.2;
  const stepEnd = stepStart + 0.15;

  const stepProgress = useTransform(progress, [stepStart, stepEnd], [0, 1], {
    clamp: true,
  });

  const isActive = useTransform(progress, (value) => value >= stepStart);
  const isComplete = useTransform(progress, (value) => value >= stepEnd);

  const opacity = useSpring(stepProgress, { stiffness: 100, damping: 20 });
  const x = useTransform(stepProgress, [0, 1], [-30, 0]);

  const circleScale = useSpring(
    useTransform(isActive, (active) => (active ? 1.1 : 1) as number),
    { stiffness: 200, damping: 15 }
  );

  return (
    <motion.div
      className="flex gap-6 md:gap-8 mb-12 last:mb-0"
      style={{ opacity, x }}
    >
      {/* Step number / indicator */}
      <div className="shrink-0 relative z-10">
        <motion.div
          className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300"
          style={{
            scale: circleScale,
            background: useTransform(isComplete, (complete) =>
              complete ? "#f96501" : "#ffffff"
            ),
            color: useTransform(isComplete, (complete) =>
              complete ? "#ffffff" : "#0f0f0f"
            ),
            border: useTransform(isComplete, (complete) =>
              complete ? "2px solid #f96501" : "2px solid #ddd"
            ),
            boxShadow: useTransform(isComplete, (complete) =>
              complete
                ? "0 4px 20px rgba(249, 101, 1, 0.3)"
                : "0 2px 10px rgba(0,0,0,0.05)"
            ),
          }}
        >
          {step.number}
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-1 md:pt-3">
        <h3
          className="text-xl md:text-2xl font-semibold mb-2"
          style={{ color: "#0f0f0f" }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm md:text-base leading-relaxed"
          style={{ color: "#666", lineHeight: "1.7" }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Orange line height grows from 0% to 100%
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Current step indicator (0-4)
  const currentStep = useTransform(smoothProgress, (value) => {
    return Math.min(Math.floor(value * 5), 4);
  });

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{
        height: "500vh",
        background: "#f8f8f8",
        zIndex: 1,
      }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex items-center py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: PREMIUM_EASE }}
              className="block mb-4 text-xs uppercase tracking-[0.3em]"
              style={{ color: "#f96501" }}
            >
              The Experience
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: PREMIUM_EASE }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{ color: "#0f0f0f", letterSpacing: "-0.02em" }}
            >
              How It Works
            </motion.h2>
          </div>

          {/* Steps with animated line */}
          <div className="max-w-4xl mx-auto relative">
            {/* Animated orange line */}
            <div className="absolute left-5 md:left-7 top-0 w-0.5 h-full bg-gray-200">
              <motion.div
                className="w-full bg-[#f96501] origin-top"
                style={{
                  height: lineHeight,
                  boxShadow: "0 0 20px rgba(249, 101, 1, 0.5)",
                }}
              />
            </div>

            {/* Steps */}
            <div className="relative">
              {steps.map((step, index) => (
                <TimelineStep
                  key={step.number}
                  step={step}
                  index={index}
                  progress={smoothProgress}
                />
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          {/* <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium z-10"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              color: "#f96501",
            }}
          >
            <span>Step</span>
            <motion.span>
              {useTransform(currentStep, (v) => Math.min(v + 1, 5))}
            </motion.span>
            <span>/ 5</span>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}

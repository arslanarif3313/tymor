"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

// Premium easing
const smoothEase: [number, number, number, number] = [0.23, 1, 0.32, 1];

interface ProjectItem {
  id: string;
  company: string;
  description: string;
  image: string;
  width: string;
  aspect: string;
}

const projects: ProjectItem[] = [
  {
    id: "01",
    company: "Hospitality",
    description:
      "Redefined Guest Engagement using our AI-Powered HoloBox Concierge.",
    image: "/images/solution/Real Estate.jpg",
    width: "col-lg-4",
    aspect: "1:1",
  },
  {
    id: "02",
    company: "Retail & Flagship",
    description:
      "AI Holobox Product Specialist Transforms the In-Store Experience for Retail.",
    image: "/images/solution/hospitality.avif",
    width: "col-lg-8",
    aspect: "16/9",
  },
  {
    id: "03",
    company: "Healthcare",
    description:
      "Realty Group Introduces AI Holobox Advisors to Elevate the Property Buying Experience Leveraging Real-Time Buyer Insights.",
    image: "/images/solution/retail.jpg",
    width: "col-lg-5",
    aspect: "16/10",
  },
  {
    id: "04",
    company: "Education",
    description:
      "Live-Streamed Physician Model Improves Clinical Patient Care Delivery in Hospital Settings.",
    image: "/images/solution/education.avif",
    width: "col-lg-7",
    aspect: "1:1",
  },
  {
    id: "05",
    company: "Corporate HQ",
    description:
      "HoloBox AI Brand Ambassador Drives Audience Engagement at Marketing Events and Shows--Marketing.",
    image: "/images/solution/Healthcare.avif",
    width: "col-lg-6",
    aspect: "16/10",
  },
  {
    id: "06",
    company: "Marketing & Events",
    description:
      "Launch moments, trade floors, and campaigns with a Holobox anchor that draws crowds and converts.",
    image: "/images/solution/marketing.avif",
    width: "col-lg-6",
    aspect: "16/9",
  },
];

const ProjectCard = ({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRight = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // L-Shape Reveal Progress with eased interpolation (not linear)
  const revealProgressRaw = useTransform(scrollYProgress, [0.1, 0.45], [0, 100]);
  const revealProgress = useSpring(revealProgressRaw, { stiffness: 60, damping: 20, mass: 0.8 });

  const lReveal = useTransform(revealProgress, (p) => {
    // Apply easing curve to the progress for more natural reveal
    const easedP = p < 50 ? (p * p) / 50 : 100 - Math.pow(100 - p, 2) / 50;
    if (isRight) {
      // Top-Right L-Reveal
      return `polygon(100% 0%, 0% 0%, 0% ${easedP}%, ${100 - easedP}% ${easedP}%, ${100 - easedP}% 100%, 100% 100%)`;
    } else {
      // Top-Left L-Reveal
      return `polygon(0% 0%, 100% 0%, 100% ${easedP}%, ${easedP}% ${easedP}%, ${easedP}% 100%, 0% 100%)`;
    }
  });

  // Image scale with subtle depth during reveal (1.15 → 1)
  const imageScaleRaw = useTransform(scrollYProgress, [0.1, 0.5], [1.15, 1]);
  const imageScale = useSpring(imageScaleRaw, { stiffness: 80, damping: 25 });

  // Z-depth shift during reveal (image feels closer)
  const imageZ = useTransform(revealProgress, [0, 100], [30, 0]);

  // TEXT: Fully scroll-driven with consistent ranges
  // Company: 0.20-0.45 (appears first)
  // Description: 0.28-0.52 (follows with micro delay via range offset)

  // Company text transforms
  const companyProgress = useTransform(scrollYProgress, [0.20, 0.45], [0, 1]);
  const companyProgressSpring = useSpring(companyProgress, { stiffness: 50, damping: 25, mass: 0.6 });
  const companyY = useTransform(companyProgressSpring, [0, 1], [12, 0]);
  const companyScale = useTransform(companyProgressSpring, [0, 1], [0.97, 1]);
  const companyOpacity = useTransform(companyProgressSpring, [0, 0.7], [0, 1]);

  // Description text transforms (slightly delayed via range)
  const descProgress = useTransform(scrollYProgress, [0.28, 0.52], [0, 1]);
  const descProgressSpring = useSpring(descProgress, { stiffness: 50, damping: 25, mass: 0.6 });
  const descY = useTransform(descProgressSpring, [0, 1], [16, 0]);
  const descScale = useTransform(descProgressSpring, [0, 1], [0.96, 1]);
  const descOpacity = useTransform(descProgressSpring, [0, 0.7], [0, 1]);

  // Shared horizontal offset (directional based on layout)
  const textXOffset = useTransform(companyProgressSpring, [0, 1], [isRight ? -15 : 15, 0]);

  return (
    <div
      ref={containerRef}
      className={`row g-0 align-items-stretch ${isRight ? "flex-row-reverse" : ""}`}
      style={{ margin: 0, padding: 0 }}
    >
      {/* Image Column */}
      <div className={`${project.width} p-0 m-0`}>
        <div
          className="project-img-wrapper h-100 position-relative"
          style={{ margin: 0, overflow: "hidden" }}
        >
          <motion.img
            src={project.image}
            alt={project.company}
            className="w-100 h-100 object-fit-cover d-block"
            style={{
              clipPath: lReveal as any,
              scale: imageScale,
              z: imageZ,
              transformOrigin: "center center",
            }}
            whileHover={{
              scale: 1.05,
              filter: "brightness(1.1) contrast(1.05)",
            }}
            transition={{ duration: 0.8, ease: smoothEase }}
          />
        </div>
      </div>

      {/* Info Column - Text feels "behind" and follows image reveal (fully scroll-driven) */}
      <div
        className={`col-lg flex-grow-1 d-flex flex-column justify-content-center ${isRight ? "align-items-center align-items-lg-start ps-lg-5" : "align-items-center align-items-lg-end pe-lg-5"} px-4`}
      >
        <div className="project-info py-5 w-100">
          {/* Company name - scroll-driven reveal */}
          <motion.div
            className={`d-flex align-items-baseline gap-3 mb-2 justify-content-center ${isRight ? "justify-content-lg-start" : "justify-content-lg-end"}`}
            style={{
              opacity: companyOpacity,
              y: companyY,
              scale: companyScale,
              x: textXOffset,
              textAlign: typeof window !== "undefined" && window.innerWidth < 992
                ? "center"
                : isRight
                  ? "left"
                  : "right",
            }}
          >
            <h4 className="project-company-name mb-0">{project.company}</h4>
          </motion.div>
          {/* Description - scroll-driven reveal (follows company) */}
          <motion.p
            className="project-description-text mt-2 mx-auto mx-lg-0"
            style={{
              maxWidth: "550px",
              opacity: descOpacity,
              y: descY,
              scale: descScale,
              x: textXOffset,
              textAlign: typeof window !== "undefined" && window.innerWidth < 992
                ? "center"
                : isRight
                  ? "left"
                  : "right",
            }}
          >
            {project.description}
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default function ProjectList() {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 992 : false;

  return (
    <section
      className="project-grid-area bg-white"
      style={{ marginTop: isMobile ? "100px" : "350px", overflow: "hidden" }}
    >
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row mb-50">
            <div className="col-12 text-center">
              {/* <h2 className="project-grid-subtitle text-uppercase">Projects</h2> */}
              <h1
                className="project-grid-title mt-3 mx-auto text-uppercase"
                style={{ fontSize: isMobile ? "2rem" : "3.5rem", letterSpacing: "-0.02em" }}
              >
                PORTFOLIO
              </h1>
            </div>
          </div>
        </div>

        <div
          className="project-rows-connected"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            borderBottom: "1px solid #eee",
          }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

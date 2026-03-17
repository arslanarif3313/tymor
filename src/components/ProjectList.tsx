"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ProjectItem {
  id: string;
  company: string;
  description: string;
  category: string;
  image: string;
  width: string; // Bootstrap col width
  aspect: string; // CSS aspect ratio
}

const projects: ProjectItem[] = [
  { id: "01", company: "Brandlift", description: "Strategic Branding and Motion Identity", category: "PRODUCT DESIGN, MOTION", image: "/images/solution/Real Estate.jpg", width: "col-lg-4", aspect: "1:1" },
  { id: "02", company: "Devnest", description: "Full-stack Platform Development", category: "DEVELOPMENT, BRANDING", image: "/images/solution/Hospitality.avif", width: "col-lg-8", aspect: "16/9" },
  { id: "03", company: "Wiregrid", description: "Enterprise Strategy and Digital Motion", category: "STRATEGY, MOTION", image: "/images/solution/retail.jpg", width: "col-lg-5", aspect: "16/10" },
  { id: "04", company: "Agencylabs", description: "UI/UX Design and Product Scalability", category: "UI/UX, DEVELOPMENT", image: "/images/solution/education.avif", width: "col-lg-7", aspect: "1:1" },
  { id: "05", company: "Visionary", description: "Immersive 3D Environments", category: "AR/VR, DESIGN", image: "/images/solution/Healthcare.avif", width: "col-lg-6", aspect: "16/10" },
  { id: "06", company: "Apex", description: "Market Position and Growth Strategy", category: "MARKETING, STRATEGY", image: "/images/solution/marketing.avif", width: "col-lg-6", aspect: "16/9" },
];

const ProjectCard = ({ project, index }: { project: ProjectItem, index: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRight = index % 2 !== 0;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // L-Shape Reveal Progress (Architectural reveal from images)
  const revealProgress = useTransform(scrollYProgress, [0.1, 0.45], [0, 100]);

  const lReveal = useTransform(revealProgress, (p) => {
    if (isRight) {
      // Top-Right L-Reveal
      // Starting from top-right corner, revealing horizontally left and vertically down
      return `polygon(100% 0%, 0% 0%, 0% ${p}%, ${100 - p}% ${p}%, ${100 - p}% 100%, 100% 100%)`;
    } else {
      // Top-Left L-Reveal
      // Starting from top-left corner, revealing horizontally right and vertically down
      return `polygon(0% 0%, 100% 0%, 100% ${p}%, ${p}% ${p}%, ${p}% 100%, 0% 100%)`;
    }
  });

  const imageScale = useTransform(scrollYProgress, [0.1, 0.5], [1.1, 1]);

  const opacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const xOffset = useTransform(scrollYProgress, [0.1, 0.35], [isRight ? -30 : 30, 0]);

  return (
    <div ref={containerRef} className={`row g-0 align-items-stretch ${isRight ? 'flex-row-reverse' : ''}`} style={{ margin: 0, padding: 0 }}>
      {/* Image Column */}
      <div className={`${project.width} p-0 m-0`}>
        <div className="project-img-wrapper h-100 position-relative" style={{ margin: 0, overflow: 'hidden' }}>
          <motion.img
            src={project.image}
            alt={project.company}
            className="w-100 h-100 object-fit-cover d-block"
            style={{
              clipPath: lReveal as any,
              scale: imageScale,
            }}
            whileHover={{
              scale: 1.05,
              filter: 'brightness(1.1) contrast(1.05)'
            }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>
      </div>

      {/* Info Column */}
      <div className={`col-lg flex-grow-1 d-flex flex-column justify-content-center ${isRight ? 'align-items-start ps-lg-5 ps-4' : 'align-items-end pe-lg-5 pe-4'}`}>
        <motion.div
          className="project-info py-5 w-100"
          style={{
            textAlign: isRight ? 'left' : 'right',
            opacity,
            x: xOffset
          }}
        >
          <div className={`d-flex align-items-baseline gap-3 mb-2 ${isRight ? 'justify-content-start' : 'justify-content-end'}`}>
            <h4 className="project-company-name mb-0">{project.company}.</h4>
            <span className="project-category-text">{project.category}</span>
          </div>
          <p className="project-description-text mt-2">{project.description}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default function ProjectList() {
  return (
    <section className="project-grid-area bg-white" style={{ marginTop: '350px', overflow: 'hidden' }}>
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row mb-50">
            <div className="col-12 text-center">
              <h2 className="project-grid-subtitle text-uppercase">Projects</h2>
              <h1 className="project-grid-title mt-3 mx-auto">Projects that deliver real results</h1>
            </div>
          </div>
        </div>

        <div className="project-rows-connected" style={{ maxWidth: '1400px', margin: '0 auto', borderBottom: '1px solid #eee' }}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

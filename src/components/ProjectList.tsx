"use client";

import { useState, useEffect, useRef } from "react";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
}

const projects: ProjectItem[] = [
  { id: "(01)", title: "Real Estate", category: "Design Direction, UX/UI Design", image: "/images/solution/Real Estate.jpg" },
  { id: "(02)", title: "Hospitality", category: "Design Direction, UX/UI Design", image: "/images/solution/Hospitality.avif" },
  { id: "(03)", title: "Retail", category: "Design Direction, UX/UI Design", image: "/images/solution/retail.jpg" },
  { id: "(04)", title: "Education", category: "Design Direction, UX/UI Design", image: "/images/solution/education.avif" },
  { id: "(05)", title: "Health Care", category: "Design Direction, UX/UI Design", image: "/images/solution/Healthcare.avif" },
  { id: "(06)", title: "Marketing", category: "Design Direction, UX/UI Design", image: "/images/solution/marketing.avif" },
];

export default function ProjectList() {
  const [activeImg, setActiveImg] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [pos2, setPos2] = useState({ x: 0, y: 0 });
  const [pos3, setPos3] = useState({ x: 0, y: 0 });
  const [pos4, setPos4] = useState({ x: 0, y: 0 });
  const [pos5, setPos5] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const requestRef = useRef<number>(null);

  // Speed constants for the chain effect
  const speed = 0.22; // Increased from 0.15
  const trailSpeed = 0.18; // Increased from 0.12

  useEffect(() => {
    const animate = () => {
      setPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        
        const targetRotation = Math.min(Math.max(dx * 0.1, -15), 15);
        setRotation((prevRot) => prevRot + (targetRotation - prevRot) * 0.1);

        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed,
        };
      });

      // Chain logic: each point follows the previous one
      setPos2((prev) => ({
        x: prev.x + (pos.x - prev.x) * trailSpeed,
        y: prev.y + (pos.y - prev.y) * trailSpeed,
      }));
      setPos3((prev) => ({
        x: prev.x + (pos2.x - prev.x) * trailSpeed,
        y: prev.y + (pos2.y - prev.y) * trailSpeed,
      }));
      setPos4((prev) => ({
        x: prev.x + (pos3.x - prev.x) * trailSpeed,
        y: prev.y + (pos3.y - prev.y) * trailSpeed,
      }));
      setPos5((prev) => ({
        x: prev.x + (pos4.x - prev.x) * trailSpeed,
        y: prev.y + (pos4.y - prev.y) * trailSpeed,
      }));

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mousePos, pos, pos2, pos3, pos4]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section className="project-area -mt-96 py-5 text-white" onMouseMove={handleMouseMove}>
      <div className={`project-list ${isVisible ? "is-hovering" : ""}`}>
        {projects.map((project) => (
          <div 
            key={project.id} 
            className={`project-item ${activeId === project.id ? "active" : ""}`}
            onMouseEnter={() => {
              setActiveImg(project.image);
              setIsVisible(true);
              setActiveId(project.id);
            }}
            onMouseLeave={() => {
              setIsVisible(false);
              setActiveId(null);
            }}
          >
            <div className="container-fluid">
              <div className="row justify-content-center border-bottom">
                <div className="col-xl-9">
                  <div className="row align-items-center">
                    <div className="col-lg-7">
                      <div className="px-project-6-content d-flex">
                        <span>{project.id}</span>
                        <h4 className="px-project-6-title">{project.title}</h4>
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <div className="px-project-6-content text-lg-end">
                        <p>{project.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* floating hover image */}
      <div 
        className={`hover-preview ${isVisible ? "is-visible" : ""}`} 
        style={{ 
          left: `${pos.x}px`, 
          top: `${pos.y}px`, 
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`
        }}
      >
        <div className="preview-layer t-5" style={{ 
          transform: `translate(${(pos5.x - pos.x)}px, ${(pos5.y - pos.y)}px) scale(0.6)` 
        }}>
          <img src={activeImg} alt="Preview Tail 5" />
        </div>
        <div className="preview-layer t-4" style={{ 
          transform: `translate(${(pos4.x - pos.x)}px, ${(pos4.y - pos.y)}px) scale(0.7)` 
        }}>
          <img src={activeImg} alt="Preview Tail 4" />
        </div>
        <div className="preview-layer t-3" style={{ 
          transform: `translate(${(pos3.x - pos.x)}px, ${(pos3.y - pos.y)}px) scale(0.8)` 
        }}>
          <img src={activeImg} alt="Preview Tail 3" />
        </div>
        <div className="preview-layer t-2" style={{ 
          transform: `translate(${(pos2.x - pos.x)}px, ${(pos2.y - pos.y)}px) scale(0.9)` 
        }}>
          <img src={activeImg} alt="Preview Tail 2" />
        </div>
        <div className="preview-layer t-1" style={{ 
          transform: `translate(${(pos2.x - pos.x) * 0.5}px, ${(pos2.y - pos.y) * 0.5}px) scale(0.95)` 
        }}>
          <img src={activeImg} alt="Preview Tail 1" />
        </div>
        <div className="preview-layer base">
          <img src={activeImg} alt="Preview Main" />
        </div>
      </div>
    </section>
  );
}

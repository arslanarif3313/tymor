const projects = [
  {
    id: 1,
    image: "/images/solution/project-2-1.webp",
    tags: ["WEB DESIGN", "WEB DEVELOPMENT"],
    year: "2025"
  },
  {
    id: 2,
    image: "/images/solution/project-2-2.webp",
    tags: ["UI / UX DESIGN", "BRANDING"],
    year: "2024"
  },
  {
    id: 3,
    image: "/images/solution/project-2-3.webp",
    tags: ["MOBILE APP", "IOS / ANDROID"],
    year: "2025"
  },
  {
    id: 4,
    image: "/images/solution/project-2-4.webp",
    tags: ["BRANDING", "LOGO DESIGN"],
    year: "2024"
  }
];

export default function ProjectBanner() {
  return (
    <section className="banner-section !bg-white py-6" id="project">
      <div className="container">
        <div className="banner-stack">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="banner-card"
              style={{ 
                top: `${100 + (index * 20)}px`,
                zIndex: index + 1
              }}
            >
              <img src={project.image} alt={`Project ${project.id}`} />

              <div className="banner-content">
                <div className="banner-tags">
                  {project.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="banner-year">{project.year}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

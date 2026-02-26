"use client";

interface SolutionItem {
  title: string;
  span: string;
  tags: string[];
  image: string;
}

const solutions: SolutionItem[] = [
  {
    title: "ARTIFICIAL",
    span: "(AI) INTELLIGENCE",
    image: "/images/solution/st-service-1.webp",
    tags: [
      "Interactive AI & Holobox Experiences",
      "AI Avatars & Virtual Agents",
      "Custom AI Software Development",
      "Voice AI Solutions"
    ]
  },
  {
    title: "Full Cycle",
    span: "Management Technology",
    image: "/images/solution/st-service-2.webp",
    tags: [
      "Interactive AI & Holobox Experiences",
      "AI Avatars & Virtual Agents",
      "Custom AI Software Development",
      "Voice AI Solutions"
    ]
  },
  {
    title: "Cybersecurity",
    span: "AI Defense",
    image: "/images/solution/st-service-3.webp",
    tags: [
      "Interactive AI & Holobox Experiences",
      "AI Avatars & Virtual Agents",
      "Custom AI Software Development",
      "Voice AI Solutions"
    ]
  },
  {
    title: "Marketing",
    span: "Markets Moves",
    image: "/images/solution/st-service-4.webp",
    tags: [
      "Interactive AI & Holobox Experiences",
      "AI Avatars & Virtual Agents",
      "Custom AI Software Development",
      "Voice AI Solutions"
    ]
  }
];

export default function Solutions() {
  return (
    <section className="bf-service-area !mt-20 py-5" id="solutions">
      <div className="container">
        {/* Heading */}
        <div className="row mb-5">
          <div className="col-lg-5">
            <span className="bf-subtitle">OUR SOLUTIONS</span>
          </div>
          <div className="col-lg-7">
            <h2 className="bf-title">
              Solution we&apos;re <br /> always provides
            </h2>
            <p className="bf-desc">
              Expertise Guides our Strategy. Follow-through defines our impact.
            </p>
          </div>
        </div>

        {/* SERVICE ITEMS */}
        {solutions.map((item, index) => (
          <div key={index} className="bf-service-item">
            <div className="row align-items-center">
              {/* LEFT SIDE */}
              <div className="col-lg-6">
                <div className="card">
                  <div 
                    className="image" 
                    style={{ backgroundImage: `url(${item.image})` }}
                  ></div>
                  <div className="content">
                    <h2>{item.title} <span>{item.span}</span></h2>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-6">
                <div className="bf-right position-relative">
                  <div className="bf-service-item-3-btn">
                    <a href="#">
                      <span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 13L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M1 1H13V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </span>
                    </a>
                  </div>

                  <div className="bf-tags-marquee">
                    <div className="bf-tags-track">
                      {item.tags.map((tag, tIndex) => (
                        <span key={tIndex}>{tag}</span>
                      ))}
                      {/* duplicate for smooth loop */}
                      {item.tags.map((tag, tIndex) => (
                        <span key={`dup-${tIndex}`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

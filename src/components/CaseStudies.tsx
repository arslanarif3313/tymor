"use client";

const row1 = [
  "/images/case studies/gallery-1.webp",
  "/images/case studies/gallery-2.webp",
  "/images/case studies/gallery-3.webp",
  "/images/case studies/gallery-4.webp",
];

const row2 = [
  "/images/case studies/gallery-1.webp",
  "/images/case studies/gallery-2.webp",
  "/images/case studies/gallery-3.webp",
  "/images/case studies/gallery-4.webp",
];

export default function CaseStudies() {
  const videoUrl = "https://html.aqlova.com/videos/pixora/banner-4-1.mp4";

  return (
    <section className="case-studies text-white py-5 overflow-hidden">
      <div className="container text-center mb-5">
        <h2 className="display-5 fw-bold">CASE STUDIES</h2>
      </div>

      {/* ROW 1 (RIGHT) */}
      <div className="marquee marquee-right">
        <div className="marquee-inner">
          {row1.map((src, i) => <img key={`r1-${i}`} src={src} alt="Gallery" />)}
          <div className="marquee-video">
            <video loop muted autoPlay playsInline>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {/* Repeat */}
          {row1.map((src, i) => <img key={`r1-dup-${i}`} src={src} alt="Gallery" />)}
          <div className="marquee-video">
            <video loop muted autoPlay playsInline>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>

      {/* ROW 2 (LEFT) */}
      <div className="marquee marquee-left mt-4">
        <div className="marquee-inner">
          <div className="marquee-video">
            <video loop muted autoPlay playsInline>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {row2.map((src, i) => <img key={`r2-${i}`} src={src} alt="Gallery" />)}
          {/* Repeat */}
          <div className="marquee-video">
            <video loop muted autoPlay playsInline>
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
          {row2.map((src, i) => <img key={`r2-dup-${i}`} src={src} alt="Gallery" />)}
        </div>
      </div>
    </section>
  );
}

"use client";

export default function CreativeHero() {
  return (
    <section className="bf-hero-area py-6">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="bf-hero-title">
              <span className="text-marquee">GET THE</span>

              <div className="bf-hero-video d-none d-xl-inline-block mx-3">
                <video autoPlay muted loop playsInline>
                  <source src="https://html.aqlova.com/videos/bfolio/video-4.mp4" type="video/mp4" />
                </video>
              </div>

              <span className="text-marquee">CREATIVE</span>

              <div className="d-inline-block position-relative px-4">
                <span className="text-marquee">experiences</span>
                <img src="/images/thumb.webp" className="floating-img d-none d-xl-block" alt="thumb" />
              </div>

              <span className="text-marquee">that</span>

              <div className="d-inline-block position-relative px-4">
                <span className="text-marquee">Shape</span>
                <img src="/images/thumb-2.webp" className="floating-img-2 d-none d-xl-block" alt="thumb" />
              </div>

              <span className="text-marquee">TOMORROW.</span>
            </h1>
          </div>
        </div>

        <div className="row align-items-center mt-5">
          <div className="col-lg-6 col-md-3 text-lg-end mb-4 d-flex justify-content-lg-center">
            <a href="#" className="bf-btn-rounded">
              About<br />Us
            </a>
          </div>

          <div className="col-lg-6 col-md-9">
            <div className="bf-hero-3-dec mb-30">
              <p className="bf-hero-desc">
                GET THE STRATEGIC EXPERTISE YOU NEED – BEYOND BASIC IT SUPPORT!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

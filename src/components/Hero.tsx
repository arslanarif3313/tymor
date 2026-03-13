"use client";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container-fluid px-lg-5">
        <div className="row align-items-end">
          {/* LEFT SIDE */}
          <div className="col-xl-7 order-2 order-xl-1">
            <div className="row align-items-end">
              <div className="col-md-7 mb-4">
                <div className="hero-card">
                  <img src="/images/hero-banner.png" alt="Aleric" />
                  <div className="hero-name">Aleric</div>
                </div>
              </div>

              <div className="col-md-5 mb-4">
                <div className="ai-box">
                  <h3>AI</h3>
                  <p className="mb-4">
                    Startup agency providing AI services worldwide since 2016.
                  </p>
                  <a href="#about" className="btn btn-custom">
                    Get Started →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-xl-5 order-1 order-xl-2 text-xl-end mb-5 mb-xl-0">
            <h1 className="hero-title mb-4">
              Fuel Your <br />
              <span className="gradient-text">Vision with</span> <br />
              AI Intelligence
              <div className="d-flex justify-content-xl-end align-items-center mt-3">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  className="author-img me-2" 
                  alt="Author"
                />
                <span>Empower</span>
              </div>
            </h1>

            <p className="hero-sub">
              We follow a streamlined, intelligent workflow<br />
              designed to eliminate friction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

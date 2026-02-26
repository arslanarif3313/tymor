"use client";

import Link from "next/link";

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation logic is handled by 'was-validated' class if bootstrap is used
  };

  return (
    <footer className="footer-area">
      <div className="container py-5">
        {/* TOP */}
        <div className="row align-items-end design-footer-top-wrap">
          <div className="col-lg-8">
            <h2 className="footer-big-title">
              Thinking of something big
            </h2>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <a href="#contact" className="btn footer-btn">Let&apos;s talk!</a>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="row gy-4 align-items-center footer-detail">
          {/* Newsletter */}
          <div className="col-lg-4 col-md-6">
            <h6 className="footer-title">Our Newsletter</h6>
            <form className="newsletter-box needs-validation" noValidate onSubmit={handleSubmit}>
              <input 
                type="email"
                className="form-control"
                placeholder="Your email address"
                required
              />
              <button type="submit">✉</button>
            </form>
          </div>

          {/* Right Info */}
          <div className="col-lg-8 col-md-6">
            <div className="row gy-4">
              <div className="col-xl-4 col-md-6">
                <h6 className="footer-title">Call us</h6>
                <a href="tel:+2135558573" className="footer-link">+(213) 555-8573</a>
              </div>
              <div className="col-xl-4 col-md-6">
                <h6 className="footer-title">Drop us a line</h6>
                <a href="mailto:inquiry@tymor.com" className="footer-link">inquiry@tymor.com</a>
              </div>
              <div className="col-xl-4 col-md-6">
                <h6 className="footer-title">Teams</h6>
                <a href="#" className="footer-link">tymor.team</a>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="row pt-5 mt-4 border-top">
          <div className="col-md-6 text-center text-md-start">
            <p className="copyright">© 2026 Tymor, All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="backtop" onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>Back to top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

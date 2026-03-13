"use client";

export default function StepSection() {
  return (
    <section className="step-section d-flex align-items-center">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* LEFT TEXT */}
          <div className="col-lg-4 text-center text-lg-start">
            <h1 className="step-title">STEP</h1>
          </div>

          {/* CENTER IMAGE */}
          <div className="col-lg-4 text-center my-5 my-lg-0">
            <img src="/images/ring.gif" className="step-image img-fluid" alt="Ring Animation" />
          </div>

          {/* RIGHT EMPTY (keeps center alignment like design) */}
          <div className="col-lg-4"></div>
        </div>
      </div>
    </section>
  );
}

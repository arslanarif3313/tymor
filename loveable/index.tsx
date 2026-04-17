import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import smileyBase from "../assets/smiley-base.png";
import smileyFace from "../assets/smiley-face.png";
import happyF from "../assets/happy-f.svg";
import happyT from "../assets/happy-t.svg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ------------------------------------------------------------------ */
/*  THE HAPPY FEW — single-file footer (pixel replica)                */
/* ------------------------------------------------------------------ */

function HappyFewFooter() {
  const [rot, setRot] = useState(-40);
  const ballRef = useRef<HTMLDivElement>(null);

  // Smiley face overlay rotates toward cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ballRef.current) return;
      const r = ballRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
      setRot(angle);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ---------- Top marquee strip ---------- */
  const marqueeChunk = (
    <div className="flex items-center gap-10 shrink-0 pr-10">
      <span className="hf-marquee-text">GEERKADE 21</span>
      <span className="hf-marquee-smiley">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#2e2b26" strokeWidth="6" />
          <circle cx="36" cy="42" r="6" fill="#2e2b26" />
          <circle cx="64" cy="42" r="6" fill="#2e2b26" />
          <path d="M30 60 Q50 80 70 60" fill="none" stroke="#2e2b26" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </span>
      <span className="hf-marquee-text">4871 CK ETTEN-LEUR</span>
      <span className="hf-marquee-smiley">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="#2e2b26" strokeWidth="6" />
          <circle cx="36" cy="42" r="6" fill="#2e2b26" />
          <circle cx="64" cy="42" r="6" fill="#2e2b26" />
          <path d="M30 60 Q50 80 70 60" fill="none" stroke="#2e2b26" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );

  return (
    <footer
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden"
      style={{ backgroundColor: "#faed6d", color: "#2e2b26" }}
    >
      {/* ---------- TOP MARQUEE ---------- */}
      <div className="border-b border-[#2e2b26]/20 py-3 overflow-hidden">
        <div className="hf-marquee flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex">{marqueeChunk}</div>
          ))}
        </div>
      </div>

      {/* ---------- "The" (small, left) ---------- */}
      <div className="px-6 md:px-10 pt-6 md:pt-10">
        <h2 className="hf-the">The</h2>
      </div>

      {/* ---------- "happy few" giant wordmark ---------- */}
      <div className="px-6 md:px-10">
        <h1 className="hf-happyfew">happy few</h1>
      </div>

      {/* ---------- Mini meta row (terms / address / phone / email) ---------- */}
      <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-6 border-t border-[#2e2b26]/25 px-6 md:px-10 py-4 text-[0.7rem] md:text-xs uppercase tracking-[0.15em] md:grid-cols-4">
        <a className="underlined-link" href="#">Terms &amp; Conditions</a>
        <span>4871 CK Etten-Leur</span>
        <a className="underlined-link" href="tel:0767200911">076-72 00 911</a>
        <a className="underlined-link justify-self-end" href="mailto:hey@thehappyfew.agency">
          hey@thehappyfew.agency
        </a>
      </div>

      {/* ---------- BIG SMILE: happy-f arc | smiley ball | happy-t arc ---------- */}
      <div className="relative flex flex-1 items-end justify-between gap-2 overflow-hidden px-2">
        {/* Left arc */}
        <img
          src={happyF}
          alt=""
          aria-hidden
          className="happy-arc happy-arc-left"
          draggable={false}
        />

        {/* The smiley ball */}
        <div ref={ballRef} className="hf-ball-wrap">
          <img
            src={smileyBase}
            alt="Happy smiley"
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
          <img
            src={smileyFace}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-200 ease-out"
            style={{ transform: `translate(0,0) rotate(${rot}deg)` }}
            draggable={false}
          />
        </div>

        {/* Right arc */}
        <img
          src={happyT}
          alt=""
          aria-hidden
          className="happy-arc happy-arc-right"
          draggable={false}
        />
      </div>

      {/* ---------- Bottom socials + copyright ---------- */}
      <div className="relative z-10 flex items-center justify-between gap-4 bg-[#faed6d] px-6 md:px-10 py-5 text-[0.7rem] md:text-xs uppercase tracking-[0.15em]">
        <div className="flex items-center gap-3">
          <SocialIcon href="https://www.instagram.com/the_happy_few/" label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com/company/the-happy-few-brand-agency/" label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.48 3.04 5.48 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.62V8z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="tel:0767200911" label="Phone">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
            </svg>
          </SocialIcon>
          <SocialIcon href="mailto:hey@thehappyfew.agency" label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2.5" y="5" width="19" height="14" rx="2" />
              <path d="M3 6l9 7 9-7" />
            </svg>
          </SocialIcon>
        </div>

        <span className="hidden sm:block">© {new Date().getFullYear()} The Happy Few</span>

        <a className="underlined-link" href="https://mellowww.nl" target="_blank" rel="noreferrer">
          Website by Mellow
        </a>
      </div>

      {/* ---------- INLINE STYLES ---------- */}
      <style>{`
        .hf-the {
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.85;
          font-size: clamp(4rem, 12vw, 14rem);
          margin: 0;
        }
        .hf-happyfew {
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.06em;
          line-height: 0.85;
          font-size: clamp(5rem, 18vw, 22rem);
          margin: 0;
          white-space: nowrap;
        }
        .hf-marquee-text {
          font-family: "Inter", system-ui, sans-serif;
          font-weight: 900;
          letter-spacing: -0.02em;
          font-size: clamp(2rem, 5vw, 4rem);
          line-height: 1;
          color: #2e2b26;
          white-space: nowrap;
        }
        .hf-marquee-smiley {
          width: clamp(2rem, 5vw, 4rem);
          height: clamp(2rem, 5vw, 4rem);
          display: inline-block;
          flex-shrink: 0;
        }
        .hf-marquee-smiley svg { width: 100%; height: 100%; display: block; }
        @keyframes hf-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hf-marquee {
          width: max-content;
          animation: hf-marquee 35s linear infinite;
        }
        .happy-arc {
          height: clamp(8rem, 22vw, 18rem);
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
          user-select: none;
        }
        .happy-arc-left { transform: translateY(15%); }
        .happy-arc-right { transform: translateY(15%); }
        .hf-ball-wrap {
          position: relative;
          flex-shrink: 0;
          width: clamp(14rem, 38vw, 32rem);
          aspect-ratio: 1 / 1;
          align-self: end;
          transform: translateY(20%);
        }
        .underlined-link {
          position: relative;
          display: inline-block;
          width: fit-content;
        }
        .underlined-link::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 1px;
          background: currentColor;
          transform-origin: right;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(.6,.01,.05,1);
        }
        .underlined-link:hover::after {
          transform-origin: left;
          transform: scaleX(1);
        }
      `}</style>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2e2b26] text-[#2e2b26] transition-colors hover:bg-[#2e2b26] hover:text-[#faed6d]"
    >
      <span className="h-4 w-4 block">{children}</span>
    </a>
  );
}

function Index() {
  return <HappyFewFooter />;
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";

type RailGeom = {
  y: number;
  xLeft: number;
  xRight: number;
};
type PathGeom = {
  w: number;
  ballD: number;
  rail: [RailGeom, RailGeom, RailGeom];
  land: { x: number; y: number };
};

type CursorAnchor = { x: number; y: number };

function FooterCursorFollowCta({
  variant,
  anchor,
  stageRef,
}: {
  variant: "yellow" | "red";
  anchor: CursorAnchor;
  stageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const x = useMotionValue(anchor.x);
  const y = useMotionValue(anchor.y);
  const sx = useSpring(x, { stiffness: 240, damping: 28, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 240, damping: 28, mass: 0.45 });

  useEffect(() => {
    x.set(anchor.x);
    y.set(anchor.y);
  }, [anchor.x, anchor.y, x, y]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      // Keep cursor slightly above center so hover remains usable.
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top - 8);
    };
    const onLeave = () => {
      x.set(anchor.x);
      y.set(anchor.y);
    };
    stage.addEventListener("mousemove", onMove, { passive: true });
    stage.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, [anchor.x, anchor.y, stageRef, x, y]);

  return (
    <motion.div
      className="footer-cursor-follow-wrap"
      style={{
        position: "absolute",
        left: sx,
        top: sy,
        x: "-50%",
        y: "-50%",
        zIndex: 9,
      }}
    >
      <Link
        href="/contact"
        className={`footer-cursor-follow-btn footer-cursor-follow-btn--${variant}`}
        aria-label="One Demo Game Over — book a demo"
      >
        One Demo
        <br />
        Game Over
      </Link>
    </motion.div>
  );
}

/** Rolling CTA: shelf roll + projectile drops, then handoff CTA. */
function LadderRollingBall({
  variant,
  geom,
  ready,
  pathDone,
  onPathComplete,
}: {
  variant: "yellow" | "red";
  geom: PathGeom | null;
  ready: boolean;
  pathDone: boolean;
  onPathComplete: (anchor: CursorAnchor) => void;
}) {
  const dur = 12;
  const pathCompleteFired = useRef(false);

  if (pathDone) return null;
  if (!ready || !geom) return null;

  const [r1, r2, r3] = geom.rail;
  const { land } = geom;
  const rollR = geom.ballD / 2;
  const finalFall = Math.max(200, rollR * 3.5);
  const momentum = Math.max(80, rollR * 1.8);

  const land1X = Math.max(r2.xLeft, r1.xRight + momentum);
  const land2X = Math.max(r3.xLeft, r2.xRight + momentum);

  const arcWidth = Math.max(180, geom.w * 0.42);
  const arcLaunchX = r3.xRight + rollR * 0.5;
  const drop3X = Math.min(geom.w - rollR - 4, arcLaunchX + arcWidth * 0.32);
  const drop3XMid = Math.min(geom.w - rollR - 4, arcLaunchX + arcWidth * 0.6);
  const drop3XFar = Math.min(geom.w - rollR - 4, arcLaunchX + arcWidth * 0.82);
  const drop3XLand = Math.min(geom.w - rollR - 4, arcLaunchX + arcWidth);

  const roundClass =
    variant === "yellow"
      ? "footer-cta-round footer-cta-round--yellow footer-ladder-cta-ball"
      : "footer-cta-round footer-cta-round--red footer-ladder-cta-ball";

  const enterL = r1.xLeft - Math.max(28, Math.min(72, geom.w * 0.08));

  const xSeq = [
    enterL - rollR,
    r1.xLeft - rollR,
    r1.xRight - rollR,
    land1X - rollR,
    r2.xRight - rollR,
    land2X - rollR,
    r3.xRight - rollR,
    drop3X - rollR,
    drop3XMid - rollR,
    drop3XFar - rollR,
    drop3XLand - rollR,
  ];

  const ySeq = [
    r1.y - rollR,
    r1.y - rollR,
    r1.y - rollR,
    r2.y - rollR,
    r2.y - rollR,
    r3.y - rollR,
    r3.y - rollR,
    r3.y + finalFall * 0.10 - rollR,
    r3.y + finalFall * 0.38 - rollR,
    r3.y + finalFall * 0.72 - rollR,
    r3.y + finalFall - rollR,
  ];

  const times = [
    0, 0.06, 0.18, 0.34, 0.52, 0.68, 0.78, 0.86, 0.92, 0.97, 1,
  ] as const;

  type CubicBezier = [number, number, number, number];
  type EasingDef = CubicBezier | "linear";
  const gravity: CubicBezier = [0.32, 0, 0.67, 1];
  const arrive: CubicBezier = [0.25, 1, 0.5, 1];
  const drop: CubicBezier = [0.42, 0, 1, 1];

  const easePerSegment: EasingDef[] = [
    arrive,    // 0→1:  enter → arrive on shelf 1
    "linear",  // 1→2:  roll across "Bring"
    drop,      // 2→3:  single smooth drop to "Holobox"
    "linear",  // 3→4:  roll across "Holobox"
    drop,      // 4→5:  single smooth drop to "to Life"
    "linear",  // 5→6:  roll across "to Life"
    "linear",  // 6→7:  leave edge, start final arc
    gravity,   // 7→8:  falling
    gravity,   // 8→9:  falling faster
    gravity,   // 9→10: final
  ];

  const leftSeq = xSeq.map((v) => v + rollR);
  let cumulativeX = 0;
  const rotateKf = leftSeq.map((xPos, i) => {
    if (i > 0) cumulativeX += Math.abs(xPos - leftSeq[i - 1]);
    return (cumulativeX / (2 * Math.PI * Math.max(rollR, 1))) * 360;
  });

  const shadowOp = [
    0, 0.22, 0.4, 0.4, 0.4, 0.4, 0.4, 0.25, 0.15, 0.08, 0.03,
  ];
  const shadowSx = [
    0.34, 0.52, 0.78, 0.76, 0.78, 0.76, 0.78, 0.55, 0.4, 0.3, 0.2,
  ];

  const scaleXKF = [
    0.92, 0.98, 1, 1.06, 1, 1.06, 1, 0.97, 0.95, 0.95, 1,
  ];
  const scaleYKF = [
    0.92, 0.98, 1, 0.94, 1, 0.94, 1, 1.04, 1.06, 1.06, 1,
  ];
  const opacityKF = [
    0, 0.45, 1, 1, 1, 1, 1, 1, 1, 1, 0.15,
  ];

  return (
    <motion.div
      className="footer-ladder-ball-tracker"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 4,
        pointerEvents: "none",
      }}
      initial={false}
    >
      <motion.div
        className="footer-ladder-ball-tracker-inner"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          willChange: "transform",
        }}
        initial={{
          x: xSeq[0],
          y: ySeq[0],
          opacity: 0,
          rotate: rotateKf[0],
          scaleX: 0.92,
          scaleY: 0.92,
        }}
        whileInView={{
          x: xSeq,
          y: ySeq,
          rotate: rotateKf,
          scaleX: scaleXKF,
          scaleY: scaleYKF,
          opacity: opacityKF,
        }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: dur,
          times: [...times],
          ease: easePerSegment,
        }}
        onAnimationComplete={() => {
          if (pathCompleteFired.current) return;
          pathCompleteFired.current = true;
          onPathComplete({ x: land.x, y: land.y });
        }}
      >
        <motion.div
          className="footer-ladder-ball-shadow"
          initial={{ opacity: 0, scaleX: 0.35 }}
          whileInView={{
            opacity: shadowOp,
            scaleX: shadowSx,
          }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: dur,
            times: [...times],
            ease: [0.4, 0, 0.2, 1],
          }}
        />
        <Link
          href="/contact"
          className={`${roundClass} footer-roll-sphere`}
          aria-label="One Demo Game Over — book a demo"
        >
          <motion.span
            className="footer-roll-gloss-sweep"
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{
              duration: 28,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <span className="footer-cta-round-shade" aria-hidden />
          <span className="footer-cta-round-highlight" aria-hidden />
          <span className="footer-cta-round-label footer-cta-round-label--upright">
            One Demo
            <br />
            Game Over
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function FooterCreativeCta({
  lineAccent,
  variant,
}: {
  lineAccent: string;
  variant: "yellow" | "red";
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const railRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [geom, setGeom] = useState<PathGeom | null>(null);
  const [ready, setReady] = useState(false);
  const [stairML, setStairML] = useState<[number, number, number]>([0, 0, 0]);
  const [pathDone, setPathDone] = useState(false);
  const [followAnchor, setFollowAnchor] = useState<CursorAnchor | null>(null);
  const [followVisible, setFollowVisible] = useState(false);

  const handlePathComplete = useCallback((anchor: CursorAnchor) => {
    setFollowAnchor(anchor);
    setPathDone(true);
    // Hide rolling ball first, then reveal follow CTA.
    window.setTimeout(() => setFollowVisible(true), 420);
  }, []);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    const w = sr.width;
    if (w < 40) return;

    const stairGap = 10;
    const w0 = wordRefs.current[0]?.getBoundingClientRect().width ?? 0;
    const w1 = wordRefs.current[1]?.getBoundingClientRect().width ?? 0;
    setStairML([0, w0 + stairGap, w0 + w1 + 2 * stairGap]);

    const rowRects: {
      rr: DOMRect;
      lrLine: DOMRect;
      pad: number;
    }[] = [];
    for (let i = 0; i < 3; i++) {
      const railEl = railRefs.current[i];
      const lineEl = lineRefs.current[i];
      if (!railEl || !lineEl) return;
      rowRects.push({
        rr: railEl.getBoundingClientRect(),
        lrLine: lineEl.getBoundingClientRect(),
        pad: Math.min(12, w * 0.028),
      });
    }

    const rollD = Math.max(118, Math.min(168, w * 0.30));
    const rollR = rollD / 2;

    const rails: RailGeom[] = [];
    for (const row of rowRects) {
      const { rr, lrLine, pad } = row;
      const lineTop = lrLine.top - sr.top;
      // Keep the sphere near each line instead of floating unrealistically high.
      const yCenter = Math.max(8, lineTop - rollR - 8);
      rails.push({
        y: yCenter,
        xLeft: rr.left - sr.left + pad,
        xRight: rr.right - sr.left - pad,
      });
    }

    const changesLine = lineRefs.current[1];
    if (!changesLine) return;
    const ch = changesLine.getBoundingClientRect();
    const chR = ch.right - sr.left;
    const chCenterY = ch.top - sr.top + ch.height / 2;
    const r2g = rails[1];
    const landX = Math.min(
      sr.width - rollR - 6,
      Math.max(r2g.xRight + rollR + 8, chR + rollR + 12),
    );
    const landY = Math.max(
      10 + rollR,
      Math.min(sr.height - rollR - 10, chCenterY),
    );

    setGeom({
      w,
      ballD: rollD,
      rail: [rails[0], rails[1], rails[2]],
      land: {
        x: landX,
        y: landY,
      },
    });
    setReady(true);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const setRailRef = (i: number) => (el: HTMLDivElement | null) => {
    railRefs.current[i] = el;
  };

  const setLineRef = (i: number) => (el: HTMLDivElement | null) => {
    lineRefs.current[i] = el;
  };

  const setWordRef = (i: number) => (el: HTMLSpanElement | null) => {
    wordRefs.current[i] = el;
  };

  return (
    <div className="footer-cta-container position-relative py-4 py-xl-5 px-2">
      <div
        ref={stageRef}
        className="footer-ladder-stage w-100 position-relative"
        style={
          geom
            ? ({
                "--footer-ladder-ball": `${geom.ballD}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="footer-ladder-flow w-100 position-relative">
          <div className="footer-ladder-step">
            <div
              className="footer-ladder-track footer-ladder-track--0"
              style={{ marginLeft: stairML[0] }}
            >
              <div
                ref={setRailRef(0)}
                className="footer-ladder-rail"
                data-footer-rail
                aria-hidden
              />
              <div ref={setLineRef(0)} className="footer-ladder-line">
                <span
                  ref={setWordRef(0)}
                  className="footer-ladder-word footer-ladder-word--natural anton-font"
                  style={{ color: lineAccent }}
                >
                  Bring 
                </span>
              </div>
            </div>
          </div>

          <div className="footer-ladder-step">
            <div
              className="footer-ladder-track footer-ladder-track--1"
              style={{ marginLeft: stairML[1] }}
            >
              <div
                ref={setRailRef(1)}
                className="footer-ladder-rail"
                data-footer-rail
                aria-hidden
              />
              <div ref={setLineRef(1)} className="footer-ladder-line">
                <span
                  ref={setWordRef(1)}
                  className="footer-ladder-word footer-ladder-word--natural anton-font"
                  style={{ color: "#ffffff" }}
                >
                  Holobox
                </span>
              </div>
            </div>
          </div>

          <div className="footer-ladder-step">
            <div
              className="footer-ladder-track footer-ladder-track--2"
              style={{ marginLeft: stairML[2] }}
            >
              <div
                ref={setRailRef(2)}
                className="footer-ladder-rail"
                data-footer-rail
                aria-hidden
              />
              <div ref={setLineRef(2)} className="footer-ladder-line">
                <span
                  ref={setWordRef(2)}
                  className="footer-ladder-word footer-ladder-word--natural footer-ladder-word--lower anton-font"
                  style={{ color: lineAccent }}
                >
                  To Life
                </span>
              </div>
            </div>
          </div>

        </div>

        <LadderRollingBall
          variant={variant}
          geom={geom}
          ready={ready}
          pathDone={pathDone}
          onPathComplete={handlePathComplete}
        />
        {pathDone && followVisible && followAnchor ? (
          <FooterCursorFollowCta
            variant={variant}
            anchor={followAnchor}
            stageRef={stageRef}
          />
        ) : null}
      </div>
    </div>
  );
}

function MagneticLink({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 1.5);
    y.set((e.clientY - centerY) * 1.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const scrollToTop = (e: React.FormEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="footer-area text-white overflow-hidden position-relative">
      <div className="footer-creative-backdrop">
        <div className="footer-mesh-orb mesh-1"></div>
        <div className="footer-mesh-orb mesh-2"></div>
        <div className="footer-mesh-orb mesh-3"></div>
      </div>

      <div className="container py-5 position-relative" style={{ zIndex: 5 }}>
        <motion.div
          className="row gy-4 justify-content-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="col-12 mb-4 text-center"
            variants={itemVariants}
          >
            <Link href="/" className="d-inline-block">
              <Image
                src="/images/logo-tymor.png"
                alt="Tymor AI"
                width={160}
                height={60}
                style={{ height: "auto", width: "160px" }}
              />
            </Link>
          </motion.div>

          <motion.div
            className="col-12 text-start px-2 px-md-3"
            variants={itemVariants}
          >
            <FooterCreativeCta lineAccent="#ed3615" variant="yellow" />
          </motion.div>

        </motion.div>

        <motion.div
          className="row gy-5 align-items-center mt-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-lg-4 col-md-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">
              Our Newsletter
            </h6>
            <div className="newsletter-box-refined">
              <input type="email" placeholder="Your email address" />
              <button type="submit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div className="col-lg-8" variants={itemVariants}>
            <div className="row gy-4">
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Call us
                </span>
                <MagneticLink>
                  <a href="tel:+2135558573" className="footer-contact-link">
                    +(213) 555-8573
                  </a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Drop us a line
                </span>
                <MagneticLink>
                  <a
                    href="mailto:inquiry@tymor.com"
                    className="footer-contact-link"
                  >
                    inquiry@tymor.com
                  </a>
                </MagneticLink>
              </div>
              <div className="col-md-4">
                <span className="opacity-50 small text-uppercase d-block mb-2">
                  Teams
                </span>
                <MagneticLink>
                  <a href="#" className="footer-contact-link">
                    tymor.team
                  </a>
                </MagneticLink>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="footer-marquee-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="footer-marquee-inner">
            {[1, 2].map((i) => (
              <React.Fragment key={i}>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>HOLOGRAPHIC
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>AI-DRIVEN
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>FUTURE TECH
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>TYMOR CORE
                </div>
                <div className="footer-marquee-item">
                  <span className="marquee-dot"></span>VIRTUAL PRESENCE
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="row gy-5 mt-5 pt-5 border-top border-secondary border-opacity-25"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="col-lg-4" variants={itemVariants}>
            <p className="opacity-50 small" style={{ maxWidth: "320px" }}>
              Pioneering the future of holographic human interaction. Experience
              the next generation of AI-driven virtual presence.
            </p>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Quick Links</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/">Home</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/blogs">Blogs</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/careers">Careers</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Experience</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/projects">Projects</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/solutions">Solutions</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Locations</h6>
            <ul className="list-unstyled footer-nav-list">
              <li className="footer-location-item">Pennsylvania, US</li>
              <li className="footer-location-item">Dubai, UAE</li>
              <li className="footer-location-item">London, UK</li>
              <li className="footer-location-item">Chandigarh, Punjab</li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-2 col-6" variants={itemVariants}>
            <h6 className="footer-title-sm text-uppercase mb-4">Support</h6>
            <ul className="list-unstyled footer-nav-list">
              <li>
                <MagneticLink>
                  <Link href="/contact">Contact Us</Link>
                </MagneticLink>
              </li>
              <li>
                <MagneticLink>
                  <Link href="/demo">Request Demo</Link>
                </MagneticLink>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="row pt-5 mt-5 border-top border-secondary border-opacity-25 align-items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="col-md-6 mb-3 mb-md-0 text-center text-md-start">
            <p className="opacity-50 small mb-0">
              © 2026 Tymor, All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <MagneticLink>
              <a
                href="#"
                onClick={scrollToTop}
                className="footer-back-link small text-uppercase opacity-50"
              >
                Back to top ↑
              </a>
            </MagneticLink>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

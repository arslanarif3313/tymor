"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import * as THREE from "three";

const SmokeScene = dynamic(
  () => import("react-smoke").then((m) => m.SmokeScene),
  { ssr: false, loading: () => null },
);

type FooterR3FSmokeProps = {
  /** 0–1 from motion; scales visibility of the WebGL smoke */
  visible?: boolean;
  className?: string;
};

/**
 * [react-smoke](https://github.com/isoteriksoftware/react-smoke) — volumetric-style
 * billboard smoke in a small R3F canvas. Warm orange reads as “heat / cooling” on black.
 */
export default function FooterR3FSmoke({
  visible = true,
  className,
}: FooterR3FSmokeProps) {
  const smoke = useMemo(() => {
    const color = new THREE.Color("#f76828");
    return {
      color,
      density: 26,
      opacity: 0.52,
      enableTurbulence: true,
      turbulenceStrength: [0.014, 0.012, 0.014] as [number, number, number],
      enableRotation: true,
      rotation: [0, 0, 0.12] as [number, number, number],
      minBounds: [-140, -100, -90] as [number, number, number],
      maxBounds: [140, 100, 90] as [number, number, number],
      size: [420, 420, 420] as [number, number, number],
      windStrength: [0.012, 0.008, 0.004] as [number, number, number],
      windDirection: [0.2, 0.6, 0.05] as [number, number, number],
      enableWind: true,
    };
  }, []);

  if (!visible) return null;

  return (
    <SmokeScene
      className={className}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 420], fov: 42, near: 1, far: 2000 }}
      smoke={smoke}
    />
  );
}

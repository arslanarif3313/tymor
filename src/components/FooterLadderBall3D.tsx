"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Mesh, MeshPhysicalMaterial } from "three";

type FooterLadderBall3DProps = {
  diameter: number;
  variant: "yellow" | "red";
  backgroundVariant: "black" | "gradient";
  reducedMotion: boolean;
  pathProgress: MotionValue<number>;
};

function heatPulse(p: number, center: number, width: number): number {
  const z = (p - center) / width;
  return Math.max(0, 1 - z * z);
}

function SceneContent({
  variant,
  backgroundVariant,
  reducedMotion,
  pathProgress,
}: Omit<FooterLadderBall3DProps, "diameter">) {
  const meshRef = useRef<Mesh>(null);
  const hotEmissiveRef = useRef(new THREE.Color());
  const heatSmoothedRef = useRef(0);

  const isGrad = backgroundVariant === "gradient";
  const isRed = variant === "red";

  const hot = useMemo(() => {
    if (isRed) {
      return {
        color: new THREE.Color("#c42a38"),
        emissive: new THREE.Color("#ff4d5c"),
        emissiveIntensity: 0.55,
        roughness: 0.34,
        metalness: 0.52,
        envMapIntensity: 1.35,
        clearcoat: 0.95,
        clearcoatRoughness: 0.12,
        sheen: 0.55,
      };
    }
    if (isGrad) {
      return {
        color: new THREE.Color("#2a9e9e"),
        emissive: new THREE.Color("#6ef0f0"),
        emissiveIntensity: 0.45,
        roughness: 0.36,
        metalness: 0.5,
        envMapIntensity: 1.28,
        clearcoat: 0.92,
        clearcoatRoughness: 0.14,
        sheen: 0.5,
      };
    }
    return {
      color: new THREE.Color("#c84e00"),
      emissive: new THREE.Color("#fa6400"),
      emissiveIntensity: 0.52,
      roughness: 0.34,
      metalness: 0.52,
      envMapIntensity: 1.35,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      sheen: 0.55,
    };
  }, [isGrad, isRed]);

  const cool = useMemo(() => {
    if (isRed) {
      return {
        emissiveIntensity: 0.1,
        roughness: 0.78,
        metalness: 0.38,
        envMapIntensity: 0.48,
        clearcoat: 0.18,
        clearcoatRoughness: 0.62,
        sheen: 0.18,
      };
    }
    if (isGrad) {
      return {
        emissiveIntensity: 0.08,
        roughness: 0.76,
        metalness: 0.36,
        envMapIntensity: 0.45,
        clearcoat: 0.2,
        clearcoatRoughness: 0.58,
        sheen: 0.16,
      };
    }
    return {
      emissiveIntensity: 0.09,
      roughness: 0.8,
      metalness: 0.4,
      envMapIntensity: 0.5,
      clearcoat: 0.16,
      clearcoatRoughness: 0.65,
      sheen: 0.15,
    };
  }, [isGrad, isRed]);

  const orangeRest = useMemo(() => new THREE.Color("#fa6400"), []);
  const hotTint = useMemo(() => new THREE.Color("#d42818"), []);
  const redHot = useMemo(() => new THREE.Color("#ff0000"), []); // Pure RED at peak
  const deepRed = useMemo(() => new THREE.Color("#cc0000"), []); // Deep red for transition
  const emPulse = useMemo(() => new THREE.Color("#ff1a0a"), []);
  const emPulseAlt = useMemo(() => new THREE.Color("#ff3a28"), []);
  const emRedHot = useMemo(() => new THREE.Color("#ff2200"), []); // Intense red emission
  const emOrange = useMemo(() => new THREE.Color("#fa6400"), []); // Orange emission

  const envIntensityHot = isGrad ? 0.78 : 0.62;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as MeshPhysicalMaterial;

    const p = Math.min(1, Math.max(0, pathProgress.get()));

    // Heat phases (aligned to new smoother timing with 18s duration):
    // 0.0-0.68: Building heat (enter, drops, rolls, G jump, shelf roll)
    // 0.68-0.84: Big jump from X - heating up to MAX (RED at 0.84 apex)
    // 0.84-0.94: Descending and landing - still hot but cooling
    // 0.94-1.0: Bouncing and settling - cooling down to orange

    // Optimized: Fewer heatPulse calculations for better performance
    // Only calculate key moments that matter for visual effect
    let tHeat = 0;
    if (p < 0.60) {
      // Early phase - minimal heat
      tHeat = Math.max(tHeat, heatPulse(p, 0.20, 0.08) * 0.5); // Jump from G
      tHeat = Math.max(tHeat, heatPulse(p, 0.36, 0.06) * 0.6); // Land shelf
    } else if (p < 0.84) {
      // Heating phase
      tHeat = Math.max(tHeat, heatPulse(p, 0.68, 0.06) * 0.9); // Takeoff from X
      tHeat = Math.max(tHeat, heatPulse(p, 0.76, 0.06) * 1.0); // Big jump ascending
    } else if (p < 0.90) {
      // Peak heat
      tHeat = 1.2; // MAX HEAT (RED)
    } else {
      // Cooling phase
      tHeat = Math.max(tHeat, heatPulse(p, 0.94, 0.06) * 0.7); // Land LIFE
    }

    // Smooth the heat value change over time
    const targetHeat = Math.min(1, tHeat);
    const k = Math.min(1, delta * 2.5); // Slightly slower for smoother transitions
    heatSmoothedRef.current += (targetHeat - heatSmoothedRef.current) * k;
    const heatBoost = heatSmoothedRef.current;

    // Cooling phase calculation for material properties
    const trCooling = p > 0.84 ? Math.min(1, (p - 0.84) / 0.16) : 0;
    const tCool = 1 - Math.pow(1 - trCooling, 1.8);

    hotEmissiveRef.current.copy(hot.emissive);

    if (!isGrad && !isRed) {
      // Yellow/Orange variant: transitions to RED at peak, then back to orange
      // Define heat phases based on path progress (aligned to new 0.84 peak)
      const heatingPhase = p >= 0.68 && p < 0.84; // Heating up to peak
      const peakPhase = p >= 0.84 && p < 0.88; // At peak (RED)
      const coolingPhase = p >= 0.88 && p < 0.94; // Cooling down
      const settledPhase = p >= 0.94; // Settled at orange

      if (peakPhase) {
        // At peak - pure RED with intense emission
        mat.color.copy(redHot);
        hotEmissiveRef.current.copy(emRedHot);
        // Boost emissive intensity at peak
        mat.emissiveIntensity = 1.2;
      } else if (coolingPhase) {
        // Cooling down after peak - transition from red to orange
        const coolProgress = Math.min(1, (p - 0.88) / 0.06);
        mat.color.copy(redHot).lerp(orangeRest, coolProgress);
        hotEmissiveRef.current.copy(emRedHot).lerp(emOrange, coolProgress);
        mat.emissiveIntensity = THREE.MathUtils.lerp(1.2, hot.emissiveIntensity, coolProgress);
      } else if (settledPhase) {
        // Fully cooled to orange
        mat.color.copy(orangeRest);
        hotEmissiveRef.current.copy(emOrange);
        mat.emissiveIntensity = cool.emissiveIntensity;
      } else if (heatingPhase) {
        // Heating up - transitioning from orange to red
        const heatProgress = (p - 0.68) / 0.16;
        mat.color.copy(orangeRest).lerp(deepRed, heatProgress);
        hotEmissiveRef.current.copy(emOrange).lerp(emRedHot, heatProgress);
        mat.emissiveIntensity = THREE.MathUtils.lerp(hot.emissiveIntensity, 1.0, heatProgress);
      } else {
        // Building heat before big jump (pre-heat)
        mat.color.copy(orangeRest).lerp(hotTint, heatBoost * 0.4);
        hotEmissiveRef.current.lerp(emPulse, heatBoost * 0.3);
      }
    } else {
      mat.color.copy(hot.color).lerp(hotTint, heatBoost * 0.28);
      hotEmissiveRef.current.lerp(emPulseAlt, heatBoost * 0.36);
    }

    mat.emissive.copy(hotEmissiveRef.current);
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      hot.emissiveIntensity,
      cool.emissiveIntensity,
      tCool,
    );
    mat.roughness = THREE.MathUtils.lerp(hot.roughness, cool.roughness, tCool);
    mat.metalness = THREE.MathUtils.lerp(hot.metalness, cool.metalness, tCool);
    mat.envMapIntensity = THREE.MathUtils.lerp(
      hot.envMapIntensity,
      cool.envMapIntensity,
      tCool,
    );
    mat.clearcoat = THREE.MathUtils.lerp(hot.clearcoat, cool.clearcoat, tCool);
    mat.clearcoatRoughness = THREE.MathUtils.lerp(
      hot.clearcoatRoughness,
      cool.clearcoatRoughness,
      tCool,
    );
    mat.sheen = THREE.MathUtils.lerp(hot.sheen, cool.sheen, tCool);

    if (!reducedMotion) {
      const spin = (0.55 + (1 - tCool) * 0.45) * delta;
      mesh.rotation.y += spin * 0.62;
      mesh.rotation.x += spin * 0.11;
      mesh.rotation.z += spin * 0.04;
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[5.5, 6.2, 7]}
        intensity={2.1}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-4.5, -2.5, 3]}
        intensity={0.42}
        color="#ffd4b8"
      />
      <spotLight
        position={[2.8, 5.2, 5.5]}
        angle={0.42}
        penumbra={0.92}
        intensity={2.2}
        color="#fffaf5"
        castShadow
      />
      <Suspense fallback={null}>
        <Environment
          preset="studio"
          environmentIntensity={envIntensityHot}
          background={false}
        />
      </Suspense>

      <group>
        <mesh ref={meshRef} castShadow receiveShadow>
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhysicalMaterial
            color={hot.color}
            emissive={hot.emissive}
            emissiveIntensity={hot.emissiveIntensity}
            roughness={hot.roughness}
            metalness={hot.metalness}
            envMapIntensity={hot.envMapIntensity}
            clearcoat={hot.clearcoat}
            clearcoatRoughness={hot.clearcoatRoughness}
            sheen={hot.sheen}
            sheenRoughness={0.35}
            sheenColor="#ffffff"
            specularIntensity={1.25}
            specularColor="#ffffff"
          />
        </mesh>
        <pointLight
          position={[0, 0, 1.15]}
          intensity={2.8}
          color={hot.emissive}
          distance={4.2}
          decay={2}
        />
        <pointLight
          position={[0, -0.4, 0.9]}
          intensity={1.1}
          color="#ffecd4"
          distance={3}
          decay={2}
        />
      </group>

      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.55}
        scale={14}
        blur={2.4}
        far={4}
        color="#000000"
      />
    </>
  );
}

function PostFX({ reducedMotion }: { reducedMotion: boolean }) {
  const { gl } = useThree();
  if (reducedMotion) return null;
  const attrs = gl.getContextAttributes?.() ?? null;
  if (!attrs) return null;

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.42}
        luminanceSmoothing={0.55}
        intensity={0.85}
        mipmapBlur
        radius={0.42}
      />
    </EffectComposer>
  );
}

export default function FooterLadderBall3D({
  diameter,
  variant,
  backgroundVariant,
  reducedMotion,
  pathProgress,
}: FooterLadderBall3DProps) {
  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  return (
    <Canvas
      className="footer-ladder-ball-canvas"
      style={{
        width: diameter,
        height: diameter,
        display: "block",
      }}
      dpr={dpr}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 2.65], fov: 38 }}
      shadows
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <SceneContent
        variant={variant}
        backgroundVariant={backgroundVariant}
        reducedMotion={reducedMotion}
        pathProgress={pathProgress}
      />
      <PostFX reducedMotion={reducedMotion} />
    </Canvas>
  );
}

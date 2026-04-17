"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { useSpring, useTransform, useMotionValue } from "framer-motion";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import type { Mesh, MeshPhysicalMaterial } from "three";

type FooterLadderBall3DProps = {
  diameter: number;
  variant: "yellow" | "red";
  backgroundVariant: "black" | "gradient";
  reducedMotion: boolean;
  pathProgress: MotionValue<number>;
  isImpacting?: boolean;
};

function heatPulse(p: number, center: number, width: number): number {
  const z = (p - center) / width;
  return Math.max(0, 1 - z * z);
}

// Impact detection for squash and stretch
// Uses [1.4, 0.6, 1.4] squash on impact and springs back to [1, 1, 1] within 150ms
function useImpactAnimation(isImpacting: boolean, reducedMotion: boolean) {
  const scaleY = useMotionValue(1);
  const scaleXZ = useMotionValue(1);
  
  useEffect(() => {
    if (reducedMotion) return;
    
    if (isImpacting) {
      // Squash on impact: Y compresses to 0.6, X/Z expand to 1.4
      scaleY.set(0.6);
      scaleXZ.set(1.4);
    } else {
      // Spring back to normal [1, 1, 1] within 150ms
      scaleY.set(1);
      scaleXZ.set(1);
    }
  }, [isImpacting, scaleY, scaleXZ, reducedMotion]);
  
  // High stiffness for quick 150ms recovery
  const smoothScaleY = useSpring(scaleY, { stiffness: 300, damping: 20, mass: 0.5 });
  const smoothScaleXZ = useSpring(scaleXZ, { stiffness: 300, damping: 20, mass: 0.5 });
  
  return { scaleY: smoothScaleY, scaleXZ: smoothScaleXZ };
}

function SceneContent({
  variant,
  backgroundVariant,
  reducedMotion,
  pathProgress,
  isImpacting,
}: FooterLadderBall3DProps) {
  const meshRef = useRef<Mesh>(null);
  const contactShadowsRef = useRef<any>(null);
  const heatSmoothedRef = useRef(0);
  const smoothIntensityRef = useRef(0);
  const { scaleY, scaleXZ } = useImpactAnimation(isImpacting ?? false, reducedMotion);

  const isGrad = backgroundVariant === "gradient";
  const isRed = variant === "red";

  const hot = useMemo(() => {
    if (isRed) {
      return {
        color: new THREE.Color("#c42a38"),
        emissive: new THREE.Color("#ff4d5c"),
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.6,
        envMapIntensity: 1.4,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        sheen: 1.0,
        sheenColor: new THREE.Color("#ffffff"),
      };
    }
    if (isGrad) {
      return {
        color: new THREE.Color("#2a9e9e"),
        emissive: new THREE.Color("#6ef0f0"),
        emissiveIntensity: 0.5,
        roughness: 0.15,
        metalness: 0.6,
        envMapIntensity: 1.35,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        sheen: 1.0,
        sheenColor: new THREE.Color("#ffffff"),
      };
    }
    return {
      color: new THREE.Color("#c84e00"),
      emissive: new THREE.Color("#fa6400"),
      emissiveIntensity: 0.55,
      roughness: 0.15,
      metalness: 0.6,
      envMapIntensity: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      sheen: 1.0,
      sheenColor: new THREE.Color("#ffffff"),
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

  const orangeColor = useMemo(() => new THREE.Color("#fa6400"), []);
  const envIntensityHot = isGrad ? 0.78 : 0.62;

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = mesh.material as MeshPhysicalMaterial;

    // Apply squash/stretch scale from Framer Motion springs
    mesh.scale.set(scaleXZ.get(), scaleY.get(), scaleXZ.get());

    const p = Math.min(1, Math.max(0, pathProgress.get()));

    // Intensity-based animation - keep color at #fa6400, vary emissive intensity
    // Jump phases: increase intensity during leaps and impacts
    let intensityBoost = 0;
    if (p < 0.35) {
      // BRING phase - moderate intensity
      intensityBoost = Math.max(intensityBoost, heatPulse(p, 0.08, 0.08) * 0.8); // BRING impact
      intensityBoost = Math.max(intensityBoost, heatPulse(p, 0.24, 0.06) * 0.6); // G impact
    } else if (p < 0.82) {
      // HOLOBOX phase - high intensity for the gap landing
      intensityBoost = Math.max(intensityBoost, heatPulse(p, 0.48, 0.08) * 1.0); // Gap landing
      intensityBoost = Math.max(intensityBoost, heatPulse(p, 0.74, 0.06) * 0.8); // X impact
    } else {
      // TO LIFE phase - peak intensity for final leap
      intensityBoost = Math.max(intensityBoost, heatPulse(p, 0.82, 0.08) * 1.2); // LIFE impact
    }

    // Smooth intensity changes
    const targetIntensity = Math.min(1.2, intensityBoost);
    const k = Math.min(1, delta * 3.0);
    heatSmoothedRef.current += (targetIntensity - heatSmoothedRef.current) * k;
    const smoothIntensity = heatSmoothedRef.current;
    smoothIntensityRef.current = smoothIntensity;

    // Keep color strictly at #fa6400, vary emissive intensity only
    mat.color.copy(orangeColor);
    mat.emissive.copy(orangeColor);
    mat.emissiveIntensity = THREE.MathUtils.lerp(0.3, 1.2, smoothIntensity);

    // Material properties stay constant for polished aluminum look
    mat.roughness = 0.1;
    mat.metalness = 0.7;
    mat.clearcoat = 1.0;
    mat.sheen = 0.8;

    if (!reducedMotion) {
      const spin = (0.55 + (1 - smoothIntensity) * 0.45) * delta;
      mesh.rotation.y += spin * 0.62;
      mesh.rotation.x += spin * 0.11;
      mesh.rotation.z += spin * 0.04;
    }

    // Update contact shadows imperatively
    const cs = contactShadowsRef.current;
    if (cs) {
      cs.opacity = Math.min(0.8, Math.max(0.15, smoothIntensity * 0.8));
      cs.blur = Math.min(4.0, Math.max(1.2, 2.4 - smoothIntensity * 2.0));
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
        {/* Animated mesh with squash/stretch spring physics */}
        <mesh 
          ref={meshRef} 
          castShadow 
          receiveShadow
        >
          <sphereGeometry args={[1, 128, 128]} />
          <meshPhysicalMaterial
            color="#fa6400"
            emissive="#fa6400"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.7}
            envMapIntensity={1.4}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            sheen={0.8}
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
        ref={contactShadowsRef}
        position={[0, -1.02, 0]}
        opacity={0.45}
        scale={14}
        blur={2.0}
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
  isImpacting,
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
        isImpacting={isImpacting}
        diameter={diameter}
      />
      <PostFX reducedMotion={reducedMotion} />
    </Canvas>
  );
}

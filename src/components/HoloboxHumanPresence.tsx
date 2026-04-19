"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { motion, useSpring, MotionValue } from "framer-motion";
import { Bloom, EffectComposer, ChromaticAberration } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";

const PREMIUM_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

type HoloboxHumanPresenceProps = {
  isActive: boolean;
  variant: "yellow" | "red";
  backgroundVariant: "black" | "gradient";
  reducedMotion: boolean;
  onPresenceComplete?: () => void;
};

// ==========================================
// HUMAN SILHOUETTE - Premium holographic human
// ==========================================
function HumanSilhouette({ 
  opacity, 
  breathingPhase,
  variant 
}: { 
  opacity: MotionValue<number>; 
  breathingPhase: MotionValue<number>;
  variant: "yellow" | "red";
}) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Custom hologram shader
  const hologramShader = useMemo(() => {
    const isRed = variant === "red";
    const hologramColor = isRed ? new THREE.Color("#ff5a6a") : new THREE.Color("#fa6400");
    
    return {
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: hologramColor },
      uBreathing: { value: 0 },
      uScanlineIntensity: { value: 0.3 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uBreathing;
      varying vec2 vUv;
      varying float vHeight;
      
      void main() {
        vUv = uv;
        vec3 pos = position;
        
        // Subtle breathing - chest expansion
        float breath = sin(uBreathing * 6.28318) * 0.015;
        pos.x += breath * (1.0 - uv.y * 0.5); // More at chest, less at head
        
        // Micro head movement
        float headSway = sin(uTime * 0.5) * 0.002;
        pos.x += headSway * (1.0 - uv.y);
        
        vHeight = pos.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform vec3 uColor;
      uniform float uScanlineIntensity;
      varying vec2 vUv;
      varying float vHeight;
      
      void main() {
        // Scanlines
        float scanline = sin(vHeight * 150.0 + uTime * 2.0) * 0.5 + 0.5;
        float scanlineMask = smoothstep(0.3, 0.7, scanline);
        
        // Vertical fade
        float verticalFade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
        
        // Hologram flicker
        float flicker = sin(uTime * 8.0) * 0.03 + 0.97;
        
        // Edge glow
        float edgeGlow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 2.0);
        
        float finalOpacity = uOpacity * verticalFade * flicker * (0.7 + scanlineMask * 0.3);
        vec3 finalColor = uColor * (1.0 + edgeGlow * 0.5);
        
        gl_FragColor = vec4(finalColor, finalOpacity * 0.85);
      }
    `,
  };
  }, [variant]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uOpacity.value = opacity.get();
      materialRef.current.uniforms.uBreathing.value = breathingPhase.get();
    }
    
    if (meshRef.current) {
      // Micro body sway
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0.2, 0]} scale={[0.4, 0.9, 0.25]}>
      {/* Human form - simplified silhouette */}
      <mesh>
        <capsuleGeometry args={[0.5, 1.2, 4, 8]} />
        <shaderMaterial ref={materialRef} {...hologramShader} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <shaderMaterial {...hologramShader} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.35, 0.4, 4, 8]} />
        <shaderMaterial {...hologramShader} />
      </mesh>
    </group>
  );
}

// ==========================================
// HOLOBOX ENVIRONMENT - Physical glass box
// ==========================================
function HoloboxEnvironment({ 
  activationProgress,
  glowIntensity 
}: { 
  activationProgress: MotionValue<number>;
  glowIntensity: MotionValue<number>;
}) {
  const boxRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#1a1a1a"),
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.2,
    thickness: 0.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
  }), []);

  const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#fa6400"),
    metalness: 0.8,
    roughness: 0.2,
    emissive: new THREE.Color("#fa6400"),
    emissiveIntensity: 0.2,
  }), []);

  useFrame(() => {
    const progress = activationProgress.get();
    const glow = glowIntensity.get();
    
    if (boxRef.current) {
      boxRef.current.scale.setScalar(0.1 + progress * 0.9);
      boxRef.current.rotation.y = progress * 0.1;
    }
    
    if (frameRef.current) {
      const mat = frameRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.2 + glow * 0.8;
    }
    
    if (glowRef.current) {
      glowRef.current.intensity = glow * 3.0;
    }
  });

  return (
    <group ref={boxRef} scale={0.1}>
      {/* Glass panels */}
      <mesh position={[0, 0, 0.6]} material={glassMaterial}>
        <planeGeometry args={[1.2, 2.0]} />
      </mesh>
      <mesh position={[0, 0, -0.6]} material={glassMaterial}>
        <planeGeometry args={[1.2, 2.0]} />
      </mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[1.2, 2.0]} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={glassMaterial}>
        <planeGeometry args={[1.2, 2.0]} />
      </mesh>
      
      {/* Frame edges */}
      <group ref={frameRef}>
        {/* Vertical edges */}
        <mesh position={[0.6, 0, 0.6]}>
          <boxGeometry args={[0.02, 2.0, 0.02]} />
          <primitive object={frameMaterial} />
        </mesh>
        <mesh position={[-0.6, 0, 0.6]}>
          <boxGeometry args={[0.02, 2.0, 0.02]} />
          <primitive object={frameMaterial} />
        </mesh>
        <mesh position={[0.6, 0, -0.6]}>
          <boxGeometry args={[0.02, 2.0, 0.02]} />
          <primitive object={frameMaterial} />
        </mesh>
        <mesh position={[-0.6, 0, -0.6]}>
          <boxGeometry args={[0.02, 2.0, 0.02]} />
          <primitive object={frameMaterial} />
        </mesh>
        
        {/* Top frame */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.22, 0.04, 1.22]} />
          <primitive object={frameMaterial} />
        </mesh>
        
        {/* Bottom frame */}
        <mesh position={[0, -1.0, 0]}>
          <boxGeometry args={[1.22, 0.04, 1.22]} />
          <primitive object={frameMaterial} />
        </mesh>
      </group>
      
      {/* Inner glow light */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        intensity={0}
        color="#fa6400"
        distance={3}
        decay={2}
      />
      
      {/* Ambient inner light */}
      <pointLight
        position={[0, -0.3, 0.3]}
        intensity={0.5}
        color="#ffecd4"
        distance={2}
        decay={2}
      />
    </group>
  );
}

// ==========================================
// ACTIVATION BALL - The glowing sphere that triggers
// ==========================================
function ActivationBall({ 
  pathProgress,
  onImpact,
  variant 
}: { 
  pathProgress: MotionValue<number>;
  onImpact?: () => void;
  variant: "yellow" | "red";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasImpacted, setHasImpacted] = useState(false);
  
  const ballColor = variant === "red" ? new THREE.Color("#ff5a6a") : new THREE.Color("#fa6400");
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    const p = pathProgress.get();
    
    // Ball descends from top
    const y = 3.0 - p * 3.5;
    meshRef.current.position.y = y;
    
    // Rotation slows as it descends
    meshRef.current.rotation.y += (1 - p) * 0.02;
    
    // Glow intensifies near impact
    const impactProximity = Math.max(0, 1 - Math.abs(y + 0.5) * 2);
    const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
    mat.emissiveIntensity = 0.3 + impactProximity * 1.5;
    
    // Trigger impact
    if (y <= -0.5 && !hasImpacted) {
      setHasImpacted(true);
      onImpact?.();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 3.0, 0]} castShadow>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshPhysicalMaterial
        color={ballColor}
        emissive={ballColor}
        emissiveIntensity={0.3}
        roughness={0.1}
        metalness={0.7}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

// ==========================================
// IMPACT RIPPLE - Energy spread on activation
// ==========================================
function ImpactRipple({ trigger }: { trigger: boolean }) {
  const rippleRef = useRef<THREE.Mesh>(null);
  const [isActive, setIsActive] = useState(false);
  const rippleStartTime = useRef<number>(0);
  
  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      rippleStartTime.current = performance.now();
    }
  }, [trigger, isActive]);

  useFrame(() => {
    if (!rippleRef.current || !isActive) return;
    
    const elapsed = (performance.now() - rippleStartTime.current) / 1000;
    const duration = 1.5;
    
    if (elapsed > duration) {
      setIsActive(false);
      return;
    }
    
    const progress = elapsed / duration;
    const scale = progress * 4.0;
    const opacity = (1 - progress) * 0.3;
    
    rippleRef.current.scale.setScalar(scale);
    const mat = rippleRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacity;
  });

  if (!isActive) return null;

  return (
    <mesh ref={rippleRef} position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.3, 0.5, 32]} />
      <meshBasicMaterial 
        color="#fa6400" 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ==========================================
// SCENE CONTENT - Main composition
// ==========================================
function SceneContent({
  isActive,
  variant,
  onPresenceComplete,
}: HoloboxHumanPresenceProps) {
  const [phase, setPhase] = useState<"entry" | "impact" | "build" | "reveal" | "presence">("entry");
  const [impactTriggered, setImpactTriggered] = useState(false);
  
  // Animation values
  const entryProgress = useSpring(0, { stiffness: 50, damping: 30 });
  const boxActivation = useSpring(0, { stiffness: 40, damping: 25 });
  const humanOpacity = useSpring(0, { stiffness: 30, damping: 20 });
  const glowIntensity = useSpring(0, { stiffness: 60, damping: 20 });
  const breathingPhase = useSpring(0, { stiffness: 20, damping: 10 });
  
  // Continuous breathing
  useEffect(() => {
    if (phase !== "presence") return;
    
    let startTime = performance.now();
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      breathingPhase.set(Math.sin(elapsed * 0.8) * 0.5 + 0.5);
      requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [phase, breathingPhase]);

  // Sequence control
  useEffect(() => {
    if (!isActive) return;
    
    const sequence = async () => {
      // Phase 1: Ball entry (0-1.5s)
      setPhase("entry");
      entryProgress.set(1);
      
      // Wait for impact
      await new Promise(r => setTimeout(r, 1500));
      
      // Phase 2: Impact moment
      setPhase("impact");
      glowIntensity.set(1);
      
      await new Promise(r => setTimeout(r, 300));
      
      // Phase 3: Box builds
      setPhase("build");
      boxActivation.set(1);
      glowIntensity.set(0.3);
      
      await new Promise(r => setTimeout(r, 1200));
      
      // Phase 4: Human reveal
      setPhase("reveal");
      humanOpacity.set(1);
      
      await new Promise(r => setTimeout(r, 2000));
      
      // Phase 5: Continuous presence
      setPhase("presence");
      onPresenceComplete?.();
    };
    
    sequence();
  }, [isActive, entryProgress, boxActivation, humanOpacity, glowIntensity, onPresenceComplete]);

  // Handle impact from ball
  const handleImpact = () => {
    setImpactTriggered(true);
  };

  return (
    <>
      {/* Premium lighting setup */}
      <ambientLight intensity={0.08} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <directionalLight
        position={[-3, -2, 2]}
        intensity={0.3}
        color="#ffecd4"
      />
      <spotLight
        position={[2, 4, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.8}
        color="#fff8f0"
        castShadow
      />
      
      <Suspense fallback={null}>
        <Environment
          preset="studio"
          environmentIntensity={0.6}
          background={false}
        />
      </Suspense>

      {/* Activation ball */}
      {phase === "entry" && (
        <ActivationBall 
          pathProgress={entryProgress}
          onImpact={handleImpact}
          variant={variant}
        />
      )}
      
      {/* Impact ripple */}
      <ImpactRipple trigger={impactTriggered} />
      
      {/* Holobox environment */}
      <HoloboxEnvironment 
        activationProgress={boxActivation}
        glowIntensity={glowIntensity}
      />
      
      {/* Human hologram */}
      {(phase === "reveal" || phase === "presence") && (
        <HumanSilhouette 
          opacity={humanOpacity}
          breathingPhase={breathingPhase}
          variant={variant}
        />
      )}
      
      {/* Contact shadows */}
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={3}
        color="#000000"
      />
    </>
  );
}

// ==========================================
// POST PROCESSING - Premium effects
// ==========================================
function PostFX({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null;
  
  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.3}
        luminanceSmoothing={0.6}
        intensity={0.7}
        mipmapBlur
        radius={0.4}
      />
      <ChromaticAberration
        offset={[0.001, 0.001]}
      />
    </EffectComposer>
  );
}

// ==========================================
// MAIN COMPONENT - Holobox Human Presence
// ==========================================
export default function HoloboxHumanPresence({
  isActive,
  variant,
  backgroundVariant,
  reducedMotion,
  onPresenceComplete,
}: HoloboxHumanPresenceProps) {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;
  
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: PREMIUM_EASE }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
        }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <SceneContent
          isActive={isActive}
          variant={variant}
          backgroundVariant={backgroundVariant}
          reducedMotion={reducedMotion}
          onPresenceComplete={onPresenceComplete}
        />
        <PostFX reducedMotion={reducedMotion} />
      </Canvas>
    </motion.div>
  );
}

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollBus } from "../../lib/scrollBus";

const THEMES = [
  { 
    color: new THREE.Color("#ffb300"), 
    fog: new THREE.Color("#1a1000"),
    bgInner: "#2a1b00", bgMid: "#120a00", bgOuter: "#000000"
  }, // Yellow Theme
  { 
    color: new THREE.Color("#e91e63"), 
    fog: new THREE.Color("#1a0008"),
    bgInner: "#2a0011", bgMid: "#120008", bgOuter: "#000000"
  }, // Black/Pink Theme
  { 
    color: new THREE.Color("#03a9f4"), 
    fog: new THREE.Color("#00111a"),
    bgInner: "#001f33", bgMid: "#000a12", bgOuter: "#000000"
  }, // Blue Theme
  {
    color: new THREE.Color("#e91e63"), 
    fog: new THREE.Color("#00111a"),
    bgInner: "#001f33", bgMid: "#000a12", bgOuter: "#000000"
  }, // Blue Star Seven (Blue bg, pink leaves)
  {
    color: new THREE.Color("#03a9f4"), 
    fog: new THREE.Color("#1a1000"),
    bgInner: "#2a1b00", bgMid: "#120a00", bgOuter: "#000000"
  }, // Yellow Star Seven (Yellow bg, blue leaves)
];

function SceneContent({ bgRef }: { bgRef: React.RefObject<HTMLDivElement> }) {
  const textures = useTexture([
    "/assets/labels/yellow.webp",
    "/assets/labels/black.webp",
    "/assets/labels/blue.webp",
    "/assets/labels/white-star.webp",
    "/assets/labels/yellow-star.webp"
  ]);

  textures.forEach(t => {
    t.wrapS = THREE.RepeatWrapping;
  });

  const group = useRef<THREE.Group>(null);
  const jarMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const capMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const fogRef = useRef<THREE.Fog>(null);
  
  const orbs = useMemo(() => [
    { r: 3.2, speed: 0.5, size: 0.32, offset: 0 },
    { r: 3.7, speed: -0.36, size: 0.24, offset: 2 },
    { r: 2.9, speed: 0.62, size: 0.2, offset: 4 },
    { r: 4.1, speed: -0.28, size: 0.28, offset: 1.2 },
    { r: 3.4, speed: 0.44, size: 0.18, offset: 5.1 },
  ], []);
  const orbsGroup = useRef<THREE.Group>(null);

  const lathePoints = useMemo(() => {
    const points = [];
    const segments = 60;
    for (let i = 0; i <= segments; i++) {
      const v = i / segments; // 0 to 1
      let r = 1.0;
      
      if (v < 0.05) {
        // Bottom bevel
        r = 0.95 + (v / 0.05) * 0.05;
      } else if (v < 0.8) {
        // Straight body, slight linear taper to 1.08
        r = 1.0 + ((v - 0.05) / 0.75) * 0.08; 
      } else if (v < 0.82) {
        // Neck indent/gap (inward to 1.05)
        r = 1.08 - ((v - 0.8) / 0.02) * 0.03;
      } else {
        // Lid side (jumps out and tapers to 1.17)
        r = 1.15 + ((v - 0.82) / 0.18) * 0.02;
        if (v > 0.95) {
          // rounded top edge
          r -= Math.pow((v - 0.95) / 0.05, 2) * 0.05;
        }
      }
      points.push(new THREE.Vector2(r, (v - 0.5) * 1.8)); // height 1.8
    }
    return points;
  }, []);

  // Animation states
  const activeThemeIndex = useRef(0);
  const targetThemeIndex = useRef(0);
  const spinPhase = useRef<"normal" | "accelerating" | "decelerating">("normal");
  const spinVelocity = useRef(0.8);
  const currentRotation = useRef(0);
  const rotationSinceSwap = useRef(0);

  useFrame((state, delta) => {
    const p = scrollBus.progress;
    
    // 1. Determine Target Theme
    let desiredIndex = targetThemeIndex.current;
    if (p < 0.02) {
      // In Hero: Auto-cycle theme when we complete a full slow rotation
      if (spinPhase.current === "normal" && rotationSinceSwap.current >= Math.PI * 2) {
        desiredIndex = (activeThemeIndex.current + 1) % 5;
        rotationSinceSwap.current = 0;
      }
    } else {
      // Scrolled down: Sync to section
      const sectionCount = 5;
      desiredIndex = Math.min(sectionCount - 1, Math.floor(p * sectionCount)) % 5;
      rotationSinceSwap.current = 0; // reset
    }

    if (desiredIndex !== targetThemeIndex.current) {
      targetThemeIndex.current = desiredIndex;
      if (spinPhase.current === "normal") spinPhase.current = "accelerating";
    }

    // 2. High-Speed Spin Physics
    if (spinPhase.current === "accelerating") {
      spinVelocity.current += delta * 150; // Spin up EXTREMELY fast!
      if (spinVelocity.current > 70) { // Max speed much higher (was 20)
        // At max speed, swap texture
        activeThemeIndex.current = targetThemeIndex.current;
        if (jarMaterial.current) {
          jarMaterial.current.map = textures[activeThemeIndex.current];
          jarMaterial.current.needsUpdate = true;
        }
        spinPhase.current = "decelerating";
      }
    } else if (spinPhase.current === "decelerating") {
      spinVelocity.current -= delta * 120; // Brake quickly
      if (spinVelocity.current <= 0.8) { // Increased base speed
        spinVelocity.current = 0.8;
        spinPhase.current = "normal";
      }
    }

    currentRotation.current += spinVelocity.current * delta;
    if (spinPhase.current === "normal") {
      rotationSinceSwap.current += spinVelocity.current * delta;
    }

    const theme = THEMES[activeThemeIndex.current];

    // 3. Update Colors smoothly
    if (orbsGroup.current) {
      orbsGroup.current.children.forEach((child: any) => {
        if (child.material) {
          child.material.color.lerp(theme.color, 0.05);
          child.material.emissive.lerp(theme.color.clone().multiplyScalar(0.4), 0.05);
        }
      });
    }
    if (capMaterial.current) {
      capMaterial.current.color.lerp(theme.color, 0.05);
    }
    if (fogRef.current) fogRef.current.color.lerp(theme.fog, 0.05);
    
    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at center, ${theme.bgInner} 0%, ${theme.bgMid} 50%, ${theme.bgOuter} 100%)`;
      bgRef.current.style.transition = "background 1s ease";
    }

    // 4. Update Transforms (Position, Scale, Rotation)
    if (group.current) {
      // Zig-Zag Position
      const targetX = Math.sin(p * Math.PI * 4) * 3.5; 
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
      
      const floatY = (Math.sin(state.clock.elapsedTime * 2) * 0.1);
      const scrollRot = p * Math.PI * 8; 
      
      group.current.rotation.y = currentRotation.current + scrollRot;
      // Added significant static tilt (x and z) plus dynamic wobble
      group.current.rotation.x = 0.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      group.current.rotation.z = 0.08 + Math.cos(state.clock.elapsedTime * 0.3) * 0.04;
      group.current.position.y = -0.5 + floatY;
      
      // Dynamic Scale: Larger in Hero, slightly smaller on scroll
      const baseScale = 0.95; 
      const minScale = 0.65;
      const targetScale = Math.max(minScale, baseScale - p * 1.5); // shrinks quickly as they leave hero
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05));
    }
    
    // Orbit Orbs animation
    if (orbsGroup.current) {
      const t = state.clock.elapsedTime;
      orbsGroup.current.children.forEach((child, i) => {
        const o = orbs[i];
        if (!o) return;
        child.position.x = Math.cos(t * o.speed + o.offset) * o.r;
        child.position.z = Math.sin(t * o.speed + o.offset) * o.r;
        child.position.y = Math.sin(t * 0.7 + o.offset) * 0.5;
      });
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#1a1000", 9, 20]} />
      
      <group ref={group} position={[0, -0.5, 0]}>
        {/* Top Flat Cap to seal the jar */}
        <mesh position={[0, 0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <circleGeometry args={[1.12, 64]} />
          <meshStandardMaterial ref={capMaterial} color={THEMES[0].color} roughness={0.3} metalness={0.1} />
        </mesh>
        
        {/* Continuous Jar Body + Lid Side */}
        <mesh position={[0, 0, 0]} castShadow>
          <latheGeometry args={[lathePoints, 64]} />
          <meshStandardMaterial ref={jarMaterial} map={textures[0]} roughness={0.15} metalness={0.05} />
        </mesh>
      </group>
      
      <group ref={orbsGroup}>
        {orbs.map((o, i) => (
          <mesh key={i}>
            <sphereGeometry args={[o.size, 32, 32]} />
            <meshStandardMaterial 
              color="#ffb300"
              metalness={0.9} 
              roughness={0.1} 
              emissive="#ffb300"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function HeroScene() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const bgRef = useRef<HTMLDivElement>(null);

  if (reduced) {
    return (
      <div className="fixed inset-0 -z-10 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="h-[46vmin] w-[46vmin] rounded-full bg-[radial-gradient(circle_at_35%_30%,#ecd9ac,#b98a3e_60%,#5c441d)] opacity-80 blur-[1px]" />
      </div>
    );
  }

  return (
    <>
      {/* Background Layer: Stays behind all HTML sections */}
      <div ref={bgRef} className="fixed inset-0 -z-20 pointer-events-none bg-black" aria-hidden="true" />
      
      {/* 3D Canvas Layer: Floats behind text (z-20) but over backgrounds, and NEVER blocks clicks */}
      <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden="true">
        <Canvas
          style={{ pointerEvents: "none" }}
          dpr={[1, isMobile ? 1.4 : 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 7], fov: 50 }}
        >
          <ambientLight intensity={0.35} />
          <spotLight position={[6, 8, 6]} angle={0.5} intensity={160} color="#ffffff" />
          <pointLight position={[-6, -3, 4]} intensity={50} color="#ffffff" />
          <pointLight position={[0, 5, -6]} intensity={30} color="#ffffff" />
          <Suspense fallback={null}>
            <SceneContent bgRef={bgRef} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

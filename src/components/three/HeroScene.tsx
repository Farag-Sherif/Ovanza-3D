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

function SpiderWaxJar(props: any) {
  const [sideTex, topTex] = useTexture([
    "/assets/spider-wax/side-label.png",
    "/assets/spider-wax/top-label.png"
  ]);

  return (
    <group {...props}>
      <mesh position={[0, 0.341, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 64]} />
        <meshStandardMaterial map={topTex} roughness={0.5} transparent={true} />
      </mesh>
      <mesh position={[0, 0.305, 0]} rotation={[0, Math.PI / 8, 0]}>
        <cylinderGeometry args={[0.33, 0.5, 0.07, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 64]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.10, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.1, 64]} />
        <meshStandardMaterial color="#1a5a8f" roughness={0.2} metalness={0.2} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.42, 64]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.502, 0.502, 0.4, 64]} />
        <meshStandardMaterial map={sideTex} roughness={0.5} transparent={true} />
      </mesh>
    </group>
  );
}

function StarSevenWaxJar(props: any) {
  const [topTex, bodyTex, lidSideTex] = useTexture([
    "/assets/star-seven/top.png",
    "/assets/star-seven/body.png",
    "/assets/star-seven/lid-side.jpg"
  ]);

  return (
    <group {...props}>
      {/* Top Lid Surface */}
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 64]} />
        <meshStandardMaterial map={topTex} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Lid Rim (Side) */}
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 64, 1, true]} />
        <meshStandardMaterial map={lidSideTex} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Metal Seam / Inner Rim */}
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.675, 0.675, 0.02, 64, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.21, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.55, 64, 1, true]} />
        <meshStandardMaterial map={bodyTex} roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Bottom Base */}
      <mesh position={[0, -0.485, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.68, 64]} />
        <meshStandardMaterial color="#eb1933" roughness={0.4} metalness={0.1} />
      </mesh>
    </group>
  );
}

function SceneContent({ bgRef }: { bgRef: React.RefObject<HTMLDivElement> }) {
  const group = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Fog>(null);
  
  const orbs = useMemo(() => [
    { r: 3.2, speed: 0.5, size: 0.8, offset: 0 },
    { r: 3.7, speed: -0.36, size: 0.6, offset: 2 },
    { r: 2.9, speed: 0.62, size: 0.5, offset: 4 },
    { r: 4.1, speed: -0.28, size: 0.7, offset: 1.2 },
    { r: 3.4, speed: 0.44, size: 0.45, offset: 5.1 },
  ], []);
  const orbsGroup = useRef<THREE.Group>(null);

  // Animation states
  const activeThemeIndex = useRef(0);
  const targetThemeIndex = useRef(0);
  const spinPhase = useRef<"normal" | "accelerating" | "decelerating">("normal");
  const spinVelocity = useRef(0.8);
  const currentRotation = useRef(0);
  const rotationSinceSwap = useRef(0);

  useFrame((state, delta) => {
    const p = scrollBus.progress;
    
    // 1. Determine Target Theme (Backgrounds only now)
    let desiredIndex = targetThemeIndex.current;
    if (p < 0.02) {
      if (spinPhase.current === "normal" && rotationSinceSwap.current >= Math.PI * 2) {
        desiredIndex = (activeThemeIndex.current + 1) % 5;
        rotationSinceSwap.current = 0;
      }
    } else {
      const sectionCount = 5;
      desiredIndex = Math.min(sectionCount - 1, Math.floor(p * sectionCount)) % 5;
      rotationSinceSwap.current = 0;
    }

    if (desiredIndex !== targetThemeIndex.current) {
      targetThemeIndex.current = desiredIndex;
      if (spinPhase.current === "normal") spinPhase.current = "accelerating";
    }

    // 2. High-Speed Spin Physics
    if (spinPhase.current === "accelerating") {
      spinVelocity.current += delta * 150; 
      if (spinVelocity.current > 70) { 
        activeThemeIndex.current = targetThemeIndex.current;
        spinPhase.current = "decelerating";
      }
    } else if (spinPhase.current === "decelerating") {
      spinVelocity.current -= delta * 120;
      if (spinVelocity.current <= 0.8) {
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
    if (fogRef.current) fogRef.current.color.lerp(theme.fog, 0.05);
    
    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at center, ${theme.bgInner} 0%, ${theme.bgMid} 50%, ${theme.bgOuter} 100%)`;
      bgRef.current.style.transition = "background 1s ease";
    }

    // 4. Update Transforms
    if (group.current) {
      const targetX = Math.sin(p * Math.PI * 4) * 3.5; 
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);
      
      const floatY = (Math.sin(state.clock.elapsedTime * 2) * 0.1);
      const scrollRot = p * Math.PI * 8; 
      
      group.current.rotation.y = currentRotation.current + scrollRot;
      group.current.rotation.x = 0.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      group.current.rotation.z = 0.08 + Math.cos(state.clock.elapsedTime * 0.3) * 0.04;
      group.current.position.y = -0.5 + floatY;
      
      const baseScale = 2.0; 
      const minScale = 1.3;
      const targetScale = Math.max(minScale, baseScale - p * 2.5); 
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
        child.rotation.y = t * 0.5 + o.offset;
        child.rotation.x = Math.sin(t + o.offset) * 0.2 + 0.2;
        child.rotation.z = Math.cos(t + o.offset) * 0.1;
      });
    }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#1a1000", 9, 20]} />
      
      <group ref={group} position={[0, -0.5, 0]}>
        <StarSevenWaxJar />
      </group>
      
      <group ref={orbsGroup}>
        {orbs.map((o, i) => (
          <SpiderWaxJar key={i} scale={o.size} />
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
      <div ref={bgRef} className="fixed inset-0 -z-20 pointer-events-none bg-black" aria-hidden="true" />
      <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden="true">
        <Canvas
          style={{ pointerEvents: "none" }}
          dpr={[1, isMobile ? 1.4 : 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 7], fov: 50 }}
        >
          <ambientLight intensity={0.6} />
          <spotLight position={[6, 8, 6]} angle={0.5} intensity={180} color="#ffffff" />
          <pointLight position={[-6, -3, 4]} intensity={80} color="#ffffff" />
          <pointLight position={[0, 5, -6]} intensity={50} color="#ffffff" />
          <Suspense fallback={null}>
            <SceneContent bgRef={bgRef} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

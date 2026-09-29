import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollBus } from "../../lib/scrollBus";

/* Ã¢â€â‚¬Ã¢â€â‚¬ 5 themes matching the 5 jar variants (4 Star Seven + 1 Spider Wax) Ã¢â€â‚¬Ã¢â€â‚¬ */
const JAR_COUNT = 5;
const THEMES = [
  {
    // Red jar
    fog: new THREE.Color("#4a0015"),
    bgInner: "#8b1a2b", bgMid: "#4a0015", bgOuter: "#1a0008",
  },
  {
    // Black jar
    fog: new THREE.Color("#1a1a1a"),
    bgInner: "#333333", bgMid: "#1a1a1a", bgOuter: "#080808",
  },
  {
    // Blue jar
    fog: new THREE.Color("#0a3a5c"),
    bgInner: "#1565c0", bgMid: "#0a3a5c", bgOuter: "#041520",
  },
  {
    // Yellow jar
    fog: new THREE.Color("#5c4a00"),
    bgInner: "#c49000", bgMid: "#5c4a00", bgOuter: "#1a1400",
  },
  {
    // Spider Wax (Blue/Coconut)
    fog: new THREE.Color("#0d2e4f"),
    bgInner: "#1a5b9c", bgMid: "#0d2e4f", bgOuter: "#040e1a",
  },
];

/* Ã¢â€â‚¬Ã¢â€â‚¬ Bottom-base colors matching each jar variant Ã¢â€â‚¬Ã¢â€â‚¬ */
const BOTTOM_COLORS = [
  new THREE.Color("#eb1933"), // Red
  new THREE.Color("#1a1a1a"), // Black
  new THREE.Color("#1565c0"), // Blue
  new THREE.Color("#f9a825"), // Yellow
];

/* Ã¢â€â‚¬Ã¢â€â‚¬ Module-level bus: SceneContent writes, StarSevenWaxJar reads Ã¢â€â‚¬Ã¢â€â‚¬ */
const jarColorBus = { activeIndex: 0 };

/* Ã¢â€â‚¬Ã¢â€â‚¬ How long to hold each color before triggering a spin swap Ã¢â€â‚¬Ã¢â€â‚¬ */
const COLOR_HOLD_SECONDS = 4;

/* Ã¢â€â‚¬Ã¢â€â‚¬ Texture paths for each jar color variant [top, body, lid-side] Ã¢â€â‚¬Ã¢â€â‚¬ */
const JAR_TEXTURE_PATHS = [
  /* 0 = Red */
  ["/assets/star-seven/top.png", "/assets/star-seven/body.png", "/assets/star-seven/lid-side.jpg"],
  /* 1 = Black */
  ["/assets/star-seven/Hair WAX premium metal-03.png", "/assets/star-seven/Hair WAX premium metal-05.png", "/assets/star-seven/Hair WAX premium metal-04.png"],
  /* 2 = Blue */
  ["/assets/star-seven/Hair WAX premium metal-06.png", "/assets/star-seven/Hair WAX premium metal-08.png", "/assets/star-seven/Hair WAX premium metal-07.png"],
  /* 3 = Yellow */
  ["/assets/star-seven/Hair WAX premium metal-10.png", "/assets/star-seven/Hair WAX premium metal-09.png", "/assets/star-seven/Hair WAX premium metal-11.png"],
] as const;

/* ================================================================ */

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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Small orbiting Spider Wax jar Ã¢â€â‚¬Ã¢â€â‚¬ */
/* Hides itself when its colorIndex matches the big jar's active color */
function SmallSpiderWaxJar({ colorIndex, ...props }: { colorIndex: number } & Record<string, any>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const shouldHide = jarColorBus.activeIndex === colorIndex;
    const target = shouldHide ? 0.001 : 1;
    const s = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(s, target, 0.08));
  });

  return (
    <group {...props}>
      <group ref={groupRef}>
        <SpiderWaxJar />
      </group>
    </group>
  );
}

/* Ã¢â€â‚¬Ã¢â€â‚¬ Small orbiting Star Seven jar with a fixed color variant Ã¢â€â‚¬Ã¢â€â‚¬ */
/* Hides itself when its colorIndex matches the big jar's active color */
function SmallStarSevenJar({ colorIndex, ...props }: { colorIndex: number } & Record<string, any>) {
  const [topTex, bodyTex, lidSideTex] = useTexture(
    JAR_TEXTURE_PATHS[colorIndex] as unknown as string[]
  );
  const bottomColor = BOTTOM_COLORS[colorIndex];
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Hide when this color matches the currently displayed big jar
    const shouldHide = jarColorBus.activeIndex === colorIndex;
    const target = shouldHide ? 0.001 : 1;
    const s = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(s, target, 0.08));
  });

  return (
    <group {...props}>
      <group ref={groupRef}>
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

        {/* Metal Seam */}
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
          <meshStandardMaterial color={bottomColor} roughness={0.4} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
}
function JarVariantLayer({
  topTex,
  bodyTex,
  lidSideTex,
  bottomColor,
  variantIndex,
  materialStore,
}: {
  topTex: THREE.Texture;
  bodyTex: THREE.Texture;
  lidSideTex: THREE.Texture;
  bottomColor: THREE.Color;
  variantIndex: number;
  materialStore: React.RefObject<Record<number, THREE.MeshStandardMaterial[]>>;
}) {
  const topMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const lidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const bottomMatRef = useRef<THREE.MeshStandardMaterial>(null);

  /* Register material refs on mount */
  useFrame(() => {
    const store = materialStore.current;
    if (store && !store[variantIndex]) {
      if (topMatRef.current && lidMatRef.current && bodyMatRef.current && bottomMatRef.current) {
        store[variantIndex] = [topMatRef.current, lidMatRef.current, bodyMatRef.current, bottomMatRef.current];
      }
    }
  });

  return (
    <>
      {/* Top Lid Surface */}
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 64]} />
        <meshStandardMaterial
          ref={topMatRef}
          map={topTex}
          roughness={0.2}
          metalness={0.1}
          transparent
          depthWrite={false}
          opacity={0}
        />
      </mesh>

      {/* Lid Rim (Side) */}
      <mesh position={[0, 0.185, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 64, 1, true]} />
        <meshStandardMaterial
          ref={lidMatRef}
          map={lidSideTex}
          roughness={0.2}
          metalness={0.1}
          transparent
          depthWrite={false}
          opacity={0}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.21, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.55, 64, 1, true]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          map={bodyTex}
          roughness={0.2}
          metalness={0.1}
          transparent
          depthWrite={false}
          opacity={0}
        />
      </mesh>

      {/* Bottom Base */}
      <mesh position={[0, -0.485, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.68, 64]} />
        <meshStandardMaterial
          ref={bottomMatRef}
          color={bottomColor}
          roughness={0.4}
          metalness={0.1}
          transparent
          depthWrite={false}
          opacity={0}
        />
      </mesh>
    </>
  );
}

/* ================================================================ */
/* StarSevenWaxJar Ã¢â‚¬â€ reads jarColorBus.activeIndex to swap layers    */
/* ================================================================ */
function StarSevenWaxJar(props: any) {
  /* Load ALL 4 color-variant texture sets */
  const [
    topRed, bodyRed, lidRed,
    topBlack, bodyBlack, lidBlack,
    topBlue, bodyBlue, lidBlue,
    topYellow, bodyYellow, lidYellow,
  ] = useTexture([
    /* Red (original) */
    "/assets/star-seven/top.png",
    "/assets/star-seven/body.png",
    "/assets/star-seven/lid-side.jpg",
    /* Black */
    "/assets/star-seven/Hair WAX premium metal-03.png",
    "/assets/star-seven/Hair WAX premium metal-05.png",
    "/assets/star-seven/Hair WAX premium metal-04.png",
    /* Blue */
    "/assets/star-seven/Hair WAX premium metal-06.png",
    "/assets/star-seven/Hair WAX premium metal-08.png",
    "/assets/star-seven/Hair WAX premium metal-07.png",
    /* Yellow */
    "/assets/star-seven/Hair WAX premium metal-10.png",
    "/assets/star-seven/Hair WAX premium metal-09.png",
    "/assets/star-seven/Hair WAX premium metal-11.png",
  ]);

  /* Shared mutable store keyed by variant index Ã¢â€ â€™ material array */
  const materialStore = useRef<Record<number, THREE.MeshStandardMaterial[]>>({});

  /* Drive opacity based on jarColorBus (set by SceneContent) */
  useFrame(() => {
    const store = materialStore.current;
    if (!store) return;

    const active = jarColorBus.activeIndex;

    for (let i = 0; i < JAR_COUNT; i++) {
      const mats = store[i];
      if (!mats) continue;

      const target = i === active ? 1 : 0;
      for (const mat of mats) {
        // Fast lerp Ã¢â‚¬â€ the spin is fast so the swap looks instant
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, target, 0.25);
        mat.depthWrite = mat.opacity > 0.5;
      }
    }
  });

  return (
    <group {...props}>
      {/* Metal Seam / Inner Rim (shared, always visible) */}
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.675, 0.675, 0.02, 64, 1, true]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Red layer */}
      <JarVariantLayer topTex={topRed} bodyTex={bodyRed} lidSideTex={lidRed} bottomColor={BOTTOM_COLORS[0]} variantIndex={0} materialStore={materialStore} />
      {/* Black layer */}
      <JarVariantLayer topTex={topBlack} bodyTex={bodyBlack} lidSideTex={lidBlack} bottomColor={BOTTOM_COLORS[1]} variantIndex={1} materialStore={materialStore} />
      {/* Blue layer */}
      <JarVariantLayer topTex={topBlue} bodyTex={bodyBlue} lidSideTex={lidBlue} bottomColor={BOTTOM_COLORS[2]} variantIndex={2} materialStore={materialStore} />
      {/* Yellow layer */}
      <JarVariantLayer topTex={topYellow} bodyTex={bodyYellow} lidSideTex={lidYellow} bottomColor={BOTTOM_COLORS[3]} variantIndex={3} materialStore={materialStore} />
    </group>
  );
}

/* ================================================================ */
/* MainJarSwitcher Ã¢â‚¬â€ swaps between Star Seven and Spider Wax         */
/* ================================================================ */
function MainJarSwitcher(props: any) {
  const starSevenRef = useRef<THREE.Group>(null);
  const spiderWaxRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const isSpider = jarColorBus.activeIndex === 4;
    
    if (starSevenRef.current) {
      const s1 = starSevenRef.current.scale.x;
      starSevenRef.current.scale.setScalar(THREE.MathUtils.lerp(s1, isSpider ? 0.001 : 1, 0.25));
    }
    
    if (spiderWaxRef.current) {
      const s2 = spiderWaxRef.current.scale.x;
      // Scale SpiderWax up by ~1.36 to match Star Seven's physical presence
      spiderWaxRef.current.scale.setScalar(THREE.MathUtils.lerp(s2, isSpider ? 1.36 : 0.001, 0.25));
    }
  });

  return (
    <group {...props}>
      <group ref={starSevenRef}>
        <StarSevenWaxJar />
      </group>
      <group ref={spiderWaxRef} scale={0.001}>
        <SpiderWaxJar />
      </group>
    </group>
  );
}

/* ================================================================ */
/* SceneContent Ã¢â‚¬â€ orchestrates spin, jar-color swap, & background    */
/* ================================================================ */
function SceneContent({ bgRef }: { bgRef: React.RefObject<HTMLDivElement> }) {
  const group = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Fog>(null);
  
  /* Ã¢â€â‚¬Ã¢â€â‚¬ Orbit configs: tilted elliptical paths for cinematic depth Ã¢â€â‚¬Ã¢â€â‚¬ */
  const orbs = useMemo(() => [
    //        rx   rz   speed  size  phase          tiltX    yBase  bobAmp bobFreq spinSpd
    { rx: 2.7, rz: 2.3, speed: 0.22,  size: 0.65, phase: 0,            tiltX: 0.35,  yBase: 0,    bobAmp: 0.35, bobFreq: 0.7,  spinSpeed: 0.35  },
    { rx: 3.1, rz: 2.4, speed:-0.16,  size: 0.5,  phase: Math.PI*0.5,  tiltX:-0.45,  yBase: 0.4,  bobAmp: 0.25, bobFreq: 0.9,  spinSpeed:-0.25  },
    { rx: 2.6, rz: 2.7, speed: 0.28,  size: 0.45, phase: Math.PI,      tiltX: 0.55,  yBase:-0.3,  bobAmp: 0.4,  bobFreq: 0.55, spinSpeed: 0.30  },
    { rx: 3.2, rz: 2.1, speed:-0.13,  size: 0.55, phase: Math.PI*1.5,  tiltX:-0.25,  yBase: 0.7,  bobAmp: 0.3,  bobFreq: 0.8,  spinSpeed:-0.2   },
    { rx: 2.6, rz: 2.6, speed: 0.20,  size: 0.45, phase: Math.PI*0.8,  tiltX: 0.4,   yBase:-0.5,  bobAmp: 0.35, bobFreq: 0.65, spinSpeed: 0.28  },
  ], []);
  const orbsGroup = useRef<THREE.Group>(null);

  // Animation states
  const activeThemeIndex = useRef(0);
  const targetThemeIndex = useRef(0);
  const spinPhase = useRef<"normal" | "accelerating" | "decelerating">("normal");
  const spinVelocity = useRef(0.8);
  const currentRotation = useRef(0);
  const holdTimer = useRef(0);             // counts seconds in "normal" phase

  useFrame((state, delta) => {
    const p = scrollBus.progress;
    
    // Ã¢â€â‚¬Ã¢â€â‚¬ 1. Determine when to trigger the next color swap Ã¢â€â‚¬Ã¢â€â‚¬
    if (p < 0.02) {
      // Auto-cycle while at the top of the page
      if (spinPhase.current === "normal") {
        holdTimer.current += delta;
        if (holdTimer.current >= COLOR_HOLD_SECONDS) {
          // Time's up Ã¢â‚¬â€ pick the next color and start spinning
          targetThemeIndex.current = (activeThemeIndex.current + 1) % JAR_COUNT;
          spinPhase.current = "accelerating";
          holdTimer.current = 0;
        }
      }
    } else {
      // While scrolling, map scroll position Ã¢â€ â€™ jar color
      const desiredIndex = Math.min(JAR_COUNT - 1, Math.floor(p * JAR_COUNT));
      if (desiredIndex !== activeThemeIndex.current && spinPhase.current === "normal") {
        targetThemeIndex.current = desiredIndex;
        spinPhase.current = "accelerating";
        holdTimer.current = 0;
      }
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ 2. High-speed spin physics Ã¢â€â‚¬Ã¢â€â‚¬
    if (spinPhase.current === "accelerating") {
      spinVelocity.current += delta * 150;
      if (spinVelocity.current > 70) {
        // Peak speed reached Ã¢â€ â€™ swap the color NOW (invisible because spinning so fast)
        activeThemeIndex.current = targetThemeIndex.current;
        jarColorBus.activeIndex = activeThemeIndex.current;
        spinPhase.current = "decelerating";
      }
    } else if (spinPhase.current === "decelerating") {
      spinVelocity.current -= delta * 120;
      if (spinVelocity.current <= 0.8) {
        spinVelocity.current = 0.8;
        spinPhase.current = "normal";
        holdTimer.current = 0;            // reset hold timer for the next cycle
      }
    }

    currentRotation.current += spinVelocity.current * delta;

    // Ã¢â€â‚¬Ã¢â€â‚¬ 3. Background & fog Ã¢â‚¬â€ lerp to match the active jar color Ã¢â€â‚¬Ã¢â€â‚¬
    const theme = THEMES[activeThemeIndex.current];

    if (fogRef.current) fogRef.current.color.lerp(theme.fog, 0.05);
    
    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at center, ${theme.bgInner} 0%, ${theme.bgMid} 50%, ${theme.bgOuter} 100%)`;
      bgRef.current.style.transition = "background 1s ease";
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ 4. Transform the jar group Ã¢â€â‚¬Ã¢â€â‚¬
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
    
    // Ã¢â€â‚¬Ã¢â€â‚¬ 5. Premium orbit animation Ã¢â€â‚¬Ã¢â€â‚¬
    if (orbsGroup.current) {
        const t = state.clock.elapsedTime;
        
        // Calculate target positions
        const targets = orbs.map((o) => {
          const angle = t * o.speed + o.phase;
          const flatX = Math.cos(angle) * o.rx;
          const flatZ = Math.sin(angle) * o.rz;
          const cosT = Math.cos(o.tiltX);
          const sinT = Math.sin(o.tiltX);
          const tiltedY = flatZ * sinT + o.yBase;
          const tiltedZ = flatZ * cosT;
          const bob = Math.sin(t * o.bobFreq + o.phase * 2) * o.bobAmp;
          return new THREE.Vector3(flatX, tiltedY + bob, tiltedZ);
        });

        // Push overlapping targets apart (repulsion)
        const MIN_DISTANCE = 1.35; 
        for (let i = 0; i < targets.length; i++) {
          for (let j = i + 1; j < targets.length; j++) {
            const p1 = targets[i];
            const p2 = targets[j];
            const dist = p1.distanceTo(p2);
            if (dist < MIN_DISTANCE) {
              const push = (MIN_DISTANCE - dist) * 0.5;
              const dir = new THREE.Vector3().subVectors(p1, p2).normalize();
              if (dir.lengthSq() === 0) dir.set(1, 0, 0);
              p1.addScaledVector(dir, push);
              p2.addScaledVector(dir, -push);
            }
          }
        }

        orbsGroup.current.children.forEach((child, i) => {
          const o = orbs[i];
          if (!o || !targets[i]) return;
          child.position.lerp(targets[i], 0.04);
          child.rotation.y = t * o.spinSpeed + o.phase;
          child.rotation.x = Math.sin(t * 0.25 + o.phase) * 0.1 + 0.12;
          child.rotation.z = Math.cos(t * 0.2 + o.phase) * 0.05;
        });
      }
  });

  return (
    <>
      <fog ref={fogRef} attach="fog" args={["#1a0008", 9, 20]} />
      
      <group ref={group} position={[0, -0.5, 0]}>
        <MainJarSwitcher />
      </group>
      
      <group ref={orbsGroup}>
        {/* orb[0] = SpiderWaxJar (colorIndex 4) */}
        <SmallSpiderWaxJar colorIndex={4} scale={orbs[0].size} />
        {/* orb[1-4] = Star Seven color variants (hide when matching big jar) */}
        <SmallStarSevenJar colorIndex={0} scale={orbs[1].size} />
        <SmallStarSevenJar colorIndex={1} scale={orbs[2].size} />
        <SmallStarSevenJar colorIndex={2} scale={orbs[3].size} />
        <SmallStarSevenJar colorIndex={3} scale={orbs[4].size} />
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






import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { scrollBus } from "../../lib/scrollBus";

/* ── 5 themes matching the 5 3D container models ── */
const JAR_COUNT = 5;
const THEMES = [
  {
    // 0: Red Wax Tin (red wax.blend)
    fog: new THREE.Color("#4a0015"),
    bgInner: "#8b1a2b", bgMid: "#4a0015", bgOuter: "#1a0008",
  },
  {
    // 1: Black Wax Tin (wax black.blend)
    fog: new THREE.Color("#1a1a1a"),
    bgInner: "#333333", bgMid: "#1a1a1a", bgOuter: "#080808",
  },
  {
    // 2: Blue Styling / Cream Jar (without up.blend)
    fog: new THREE.Color("#0a3a5c"),
    bgInner: "#1565c0", bgMid: "#0a3a5c", bgOuter: "#041520",
  },
  {
    // 3: Golden Magic Aftershave Colonia Bottle (COLONIA.blend1)
    fog: new THREE.Color("#5c4a00"),
    bgInner: "#c49000", bgMid: "#5c4a00", bgOuter: "#1a1400",
  },
  {
    // 4: Pump Gel Dispenser Bottle (untitled.blend1)
    fog: new THREE.Color("#0d2e4f"),
    bgInner: "#1a5b9c", bgMid: "#0d2e4f", bgOuter: "#040e1a",
  },
];

/* ── Module-level bus: SceneContent writes, Switcher & Orbs read ── */
const jarColorBus = { activeIndex: 0 };

/* ── How long to hold each container before triggering a spin swap ── */
const COLOR_HOLD_SECONDS = 4;

/* ── Helper to extract leaf mesh geometries + material slot names from a GLB ── */
function useModelParts(url: string) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const parts: { geometry: THREE.BufferGeometry; matName: string }[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
        parts.push({
          geometry: mesh.geometry,
          matName: mat?.name || "",
        });
      }
    });
    return parts;
  }, [scene]);
}

/* ── Configure textures for glTF UVs (flipY = false, sRGB) ── */
function useGltfTextures(paths: string[]) {
  const textures = useTexture(paths);
  useEffect(() => {
    const list = Array.isArray(textures) ? textures : [textures];
    for (const tex of list) {
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    }
  }, [textures]);
  return textures;
}

/* ================================================================ */
/* 1. Red Wax Metal Tin (from red wax.blend)                        */
/* ================================================================ */
function RedWaxModel(props: any) {
  const parts = useModelParts("/assets/models/red-wax.glb");
  const [topTex, bodyTex, lidSideTex, bottomTex] = useGltfTextures([
    "/assets/wax-red/top.png",
    "/assets/wax-red/body.png",
    "/assets/wax-red/lid-side.png",
    "/assets/wax-red/bottom.png",
  ]);

  return (
    <group {...props} rotation={[0, -0.584, 0]}>
      {parts.map((p, idx) => {
        if (p.matName === "Material.020") {
          // Lid top circular label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={topTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.019") {
          // Lid side rim label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={lidSideTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.022") {
          // Body wrap label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={bodyTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.021") {
          // Body bottom circular label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={bottomTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.024") {
          // Silver metallic seam rings
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial color="#e4e4e7" roughness={0.2} metalness={0.85} />
            </mesh>
          );
        }
        // Red metallic tin body & lid bevels (Material.018, Material.023)
        return (
          <mesh key={idx} geometry={p.geometry}>
            <meshStandardMaterial color="#d40c18" roughness={0.26} metalness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ================================================================ */
/* 2. Black Wax Metal Tin (from wax black.blend)                    */
/* ================================================================ */
function BlackWaxModel(props: any) {
  const parts = useModelParts("/assets/models/black-wax.glb");
  const [topTex, bodyTex, lidSideTex, bottomTex] = useGltfTextures([
    "/assets/wax-black/top.png",
    "/assets/wax-black/body.png",
    "/assets/wax-black/lid-side.png",
    "/assets/wax-black/bottom.png",
  ]);

  return (
    <group {...props} rotation={[0, -0.354, 0]}>
      {parts.map((p, idx) => {
        if (p.matName === "Material.042") {
          // Lid top circular label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={topTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.041") {
          // Lid side rim label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={lidSideTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.044") {
          // Body wrap label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={bodyTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.043") {
          // Body bottom circular label
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={bottomTex} roughness={0.22} metalness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.046") {
          // Silver metallic seam rings
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial color="#e4e4e7" roughness={0.2} metalness={0.85} />
            </mesh>
          );
        }
        // Black metallic tin body & lid bevels (Material.040, Material.045)
        return (
          <mesh key={idx} geometry={p.geometry}>
            <meshStandardMaterial color="#141414" roughness={0.26} metalness={0.45} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ================================================================ */
/* 3. Sculpted Wide Styling / Cream Jar (from without up.blend)     */
/* ================================================================ */
function WithoutUpJarModel(props: any) {
  const parts = useModelParts("/assets/models/without-up.glb");
  const [topTex, sideTex] = useGltfTextures([
    "/assets/jar-cream/top-blue.jpg",
    "/assets/jar-cream/side-blue.jpg",
  ]);

  return (
    <group {...props} rotation={[0, -0.134, 0]}>
      {parts.map((p, idx) => {
        if (p.matName === "Material.003") {
          // Sculpted top cap ("up")
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={topTex} roughness={0.2} metalness={0.15} />
            </mesh>
          );
        }
        if (p.matName === "Material.004") {
          // Outer wrap label ("Cylinder.001")
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={sideTex} roughness={0.2} metalness={0.15} />
            </mesh>
          );
        }
        if (p.matName === "Material.005") {
          // Inner sculpted gel/cream swirl ("cream")
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.2}
                roughness={0.12}
                metalness={0.05}
              />
            </mesh>
          );
        }
        // Sculpted jar container body ("Cylinder" - Material.002)
        return (
          <mesh key={idx} geometry={p.geometry}>
            <meshStandardMaterial color="#1565c0" roughness={0.22} metalness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ================================================================ */
/* 4. Aftershave Colonia Spray Bottle (from COLONIA.blend1)         */
/* ================================================================ */
function ColoniaBottleModel(props: any) {
  const parts = useModelParts("/assets/models/colonia-bottle.glb");
  const [labelTex, bandTex] = useGltfTextures([
    "/assets/colonia/label-03.png",
    "/assets/colonia/band.png",
  ]);

  useEffect(() => {
    bandTex.wrapS = THREE.RepeatWrapping;
    bandTex.offset.x = -0.55;
    bandTex.needsUpdate = true;
  }, [bandTex]);

  return (
    <group {...props} rotation={[0, Math.PI, 0]}>
      {parts.map((p, idx) => {
        if (p.matName === "Material.006") {
          // Golden amber cologne liquid inside ("LIQUID")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={1}>
              <meshStandardMaterial
                color="#f59e0b"
                emissive="#b45309"
                emissiveIntensity={0.28}
                roughness={0.1}
                metalness={0.1}
                transparent
                opacity={0.88}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.019") {
          // Internal dip tube ("BézierCurve.005")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={1}>
              <meshStandardMaterial color="#fef08a" roughness={0.2} transparent opacity={0.55} />
            </mesh>
          );
        }
        if (p.matName === "Material.009") {
          // Internal white stem connector ("Cylinder.029")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={1}>
              <meshStandardMaterial color="#f5f5f5" roughness={0.25} />
            </mesh>
          );
        }
        if (p.matName === "Material.002") {
          // Clear glass bottle body ("Cylinder.002")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={2}>
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.08}
                metalness={0.15}
                transparent
                opacity={0.28}
                depthWrite={false}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.005") {
          // Translucent overcap ("Cylinder.001")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={2}>
              <meshStandardMaterial
                color="#e5e7eb"
                roughness={0.12}
                metalness={0.1}
                transparent
                opacity={0.32}
                depthWrite={false}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.004") {
          // Front cologne wrap label ("lable.001")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={4}>
              <meshStandardMaterial
                map={labelTex}
                roughness={0.2}
                metalness={0.15}
                transparent
                alphaTest={0.05}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.008") {
          // Shoulder band with Star Seven logo ("Cylinder.003")
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial map={bandTex} roughness={0.25} metalness={0.3} />
            </mesh>
          );
        }
        if (p.matName === "Material.003") {
          // Matte black shoulder cover ("out.001")
          return (
            <mesh key={idx} geometry={p.geometry}>
              <meshStandardMaterial color="#171717" roughness={0.3} metalness={0.25} />
            </mesh>
          );
        }
        // Ribbed atomizer collar & spray nozzle ("Cylinder", "UP" - Material.001)
        return (
          <mesh key={idx} geometry={p.geometry}>
            <meshStandardMaterial color="#0a0a0a" roughness={0.18} metalness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ================================================================ */
/* 5. Shaving Gel Dispenser Bottle (from untitled.blend1)           */
/* ================================================================ */
function PumpBottleModel(props: any) {
  const parts = useModelParts("/assets/models/pump-bottle.glb");
  const [shavingTex] = useGltfTextures(["/assets/shaving/label-01.png"]);

  return (
    <group {...props} rotation={[0, 3.05, 0]}>
      {parts.map((p, idx) => {
        if (p.matName === "Material.008") {
          // Inner gel volume ("jel.002")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={1}>
              <meshStandardMaterial
                color="#0284c7"
                emissive="#0369a1"
                emissiveIntensity={0.22}
                roughness={0.12}
                metalness={0.05}
                transparent
                opacity={0.86}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.013") {
          // Internal curved dip tube ("BézierCurve")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={1}>
              <meshStandardMaterial color="#bae6fd" roughness={0.2} transparent opacity={0.55} />
            </mesh>
          );
        }
        if (p.matName === "Material.007") {
          // Clear bottle body ("body")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={2}>
              <meshStandardMaterial
                color="#e0f2fe"
                roughness={0.08}
                metalness={0.15}
                transparent
                opacity={0.28}
                depthWrite={false}
              />
            </mesh>
          );
        }
        if (p.matName === "Material.012") {
          // Wrap-around shaving gel bottle label ("laple")
          return (
            <mesh key={idx} geometry={p.geometry} renderOrder={4}>
              <meshStandardMaterial
                map={shavingTex}
                roughness={0.2}
                metalness={0.1}
                transparent
                alphaTest={0.05}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        }
        // Sculpted black pump head, nozzle spout, and neck collar (Material.001, Material.005)
        return (
          <mesh key={idx} geometry={p.geometry}>
            <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── Target scales for each of the 5 models when featured in the center ── */
const HERO_MODEL_SCALES = [
  1.0,  // 0: Red Wax Tin
  1.0,  // 1: Black Wax Tin
  1.0,  // 2: Without-Up Styling Jar
  0.88, // 3: Colonia Spray Bottle
  0.92, // 4: Pump Dispenser Bottle
];

/* ── Small orbiting container for any of the 5 models ── */
/* Hides itself when its modelIndex matches the center featured model */
function SmallOrbitingContainer({
  modelIndex,
  children,
  ...props
}: {
  modelIndex: number;
  children: React.ReactNode;
} & Record<string, any>) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const shouldHide = jarColorBus.activeIndex === modelIndex;
    const target = shouldHide ? 0.001 : 1;
    const s = groupRef.current.scale.x;
    const next = THREE.MathUtils.lerp(s, target, 0.08);
    groupRef.current.scale.setScalar(next);
    groupRef.current.visible = next > 0.01;
  });

  return (
    <group {...props}>
      <group ref={groupRef}>{children}</group>
    </group>
  );
}

/* ================================================================ */
/* MainJarSwitcher — switches between all 5 3D models on spin swap  */
/* ================================================================ */
function MainJarSwitcher(props: any) {
  const ref0 = useRef<THREE.Group>(null);
  const ref1 = useRef<THREE.Group>(null);
  const ref2 = useRef<THREE.Group>(null);
  const ref3 = useRef<THREE.Group>(null);
  const ref4 = useRef<THREE.Group>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4];

  useFrame(() => {
    const active = jarColorBus.activeIndex;
    for (let i = 0; i < JAR_COUNT; i++) {
      const grp = refs[i].current;
      if (!grp) continue;
      const target = i === active ? HERO_MODEL_SCALES[i] : 0.001;
      const next = THREE.MathUtils.lerp(grp.scale.x, target, 0.25);
      grp.scale.setScalar(next);
      grp.visible = next > 0.01;
    }
  });

  return (
    <group {...props}>
      <group ref={ref0} scale={HERO_MODEL_SCALES[0]}>
        <RedWaxModel />
      </group>
      <group ref={ref1} scale={0.001} visible={false}>
        <BlackWaxModel />
      </group>
      <group ref={ref2} scale={0.001} visible={false}>
        <WithoutUpJarModel />
      </group>
      <group ref={ref3} scale={0.001} visible={false}>
        <ColoniaBottleModel />
      </group>
      <group ref={ref4} scale={0.001} visible={false}>
        <PumpBottleModel />
      </group>
    </group>
  );
}

/* ================================================================ */
/* SceneContent — orchestrates spin, model swap, & background       */
/* ================================================================ */
function SceneContent({ bgRef }: { bgRef: React.RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.Fog>(null);

  /* ── Orbit configs: tilted elliptical paths for cinematic depth ── */
  const orbs = useMemo(
    () => [
      //        rx   rz   speed  size  phase          tiltX    yBase  bobAmp bobFreq spinSpd
      { rx: 2.7, rz: 2.3, speed: 0.22, size: 0.58, phase: 0,           tiltX: 0.35, yBase: 0,    bobAmp: 0.35, bobFreq: 0.7,  spinSpeed: 0.35 },
      { rx: 3.1, rz: 2.4, speed:-0.16, size: 0.55, phase: Math.PI*0.5, tiltX:-0.45, yBase: 0.4,  bobAmp: 0.25, bobFreq: 0.9,  spinSpeed:-0.25 },
      { rx: 2.6, rz: 2.7, speed: 0.28, size: 0.52, phase: Math.PI,     tiltX: 0.55, yBase:-0.3,  bobAmp: 0.4,  bobFreq: 0.55, spinSpeed: 0.30 },
      { rx: 3.2, rz: 2.1, speed:-0.13, size: 0.50, phase: Math.PI*1.5, tiltX:-0.25, yBase: 0.7,  bobAmp: 0.3,  bobFreq: 0.8,  spinSpeed:-0.20 },
      { rx: 2.6, rz: 2.6, speed: 0.20, size: 0.50, phase: Math.PI*0.8, tiltX: 0.40, yBase:-0.5,  bobAmp: 0.35, bobFreq: 0.65, spinSpeed: 0.28 },
    ],
    []
  );
  const orbsGroup = useRef<THREE.Group>(null);

  // Animation states
  const activeThemeIndex = useRef(0);
  const targetThemeIndex = useRef(0);
  const spinPhase = useRef<"normal" | "accelerating" | "decelerating">("normal");
  const spinVelocity = useRef(0.8);
  const currentRotation = useRef(0);
  const holdTimer = useRef(0); // counts seconds in "normal" phase

  useFrame((state, delta) => {
    const p = scrollBus.progress;

    // ── 1. Determine when to trigger the next container swap ──
    if (p < 0.02) {
      // Auto-cycle while at the top of the page
      if (spinPhase.current === "normal") {
        holdTimer.current += delta;
        if (holdTimer.current >= COLOR_HOLD_SECONDS) {
          targetThemeIndex.current = (activeThemeIndex.current + 1) % JAR_COUNT;
          spinPhase.current = "accelerating";
          holdTimer.current = 0;
        }
      }
    } else {
      // While scrolling, map scroll position → active 3D container
      const desiredIndex = Math.min(JAR_COUNT - 1, Math.floor(p * JAR_COUNT));
      if (desiredIndex !== activeThemeIndex.current && spinPhase.current === "normal") {
        targetThemeIndex.current = desiredIndex;
        spinPhase.current = "accelerating";
        holdTimer.current = 0;
      }
    }

    // ── 2. High-speed spin physics ──
    if (spinPhase.current === "accelerating") {
      spinVelocity.current += delta * 150;
      if (spinVelocity.current > 70) {
        // Peak speed reached → swap the 3D container NOW
        activeThemeIndex.current = targetThemeIndex.current;
        jarColorBus.activeIndex = activeThemeIndex.current;
        spinPhase.current = "decelerating";
      }
    } else if (spinPhase.current === "decelerating") {
      spinVelocity.current -= delta * 120;
      if (spinVelocity.current <= 0.8) {
        spinVelocity.current = 0.8;
        spinPhase.current = "normal";
        holdTimer.current = 0;
      }
    }

    currentRotation.current += spinVelocity.current * delta;

    // ── 3. Background & fog — lerp to match the active container theme ──
    const theme = THEMES[activeThemeIndex.current];

    if (fogRef.current) fogRef.current.color.lerp(theme.fog, 0.05);

    if (bgRef.current) {
      bgRef.current.style.background = `radial-gradient(circle at center, ${theme.bgInner} 0%, ${theme.bgMid} 50%, ${theme.bgOuter} 100%)`;
      bgRef.current.style.transition = "background 1s ease";
    }

    // ── 4. Transform the main container group ──
    if (group.current) {
      const targetX = Math.sin(p * Math.PI * 4) * 3.5;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.05);

      const floatY = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      const scrollRot = p * Math.PI * 8;

      group.current.rotation.y = currentRotation.current + scrollRot;
      group.current.rotation.x = 0.15 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
      group.current.rotation.z = 0.08 + Math.cos(state.clock.elapsedTime * 0.3) * 0.04;
      group.current.position.y = -0.35 + floatY;

      const baseScale = 2.0;
      const minScale = 1.3;
      const targetScale = Math.max(minScale, baseScale - p * 2.5);
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.05));
    }

    // ── 5. Premium orbit animation ──
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

      <group ref={group} position={[0, -0.35, 0]}>
        <MainJarSwitcher />
      </group>

      {/* All 5 distinct 3D models orbiting in the background */}
      <group ref={orbsGroup}>
        <SmallOrbitingContainer modelIndex={0} scale={orbs[0].size}>
          <RedWaxModel />
        </SmallOrbitingContainer>
        <SmallOrbitingContainer modelIndex={1} scale={orbs[1].size}>
          <BlackWaxModel />
        </SmallOrbitingContainer>
        <SmallOrbitingContainer modelIndex={2} scale={orbs[2].size}>
          <WithoutUpJarModel />
        </SmallOrbitingContainer>
        <SmallOrbitingContainer modelIndex={3} scale={orbs[3].size}>
          <ColoniaBottleModel />
        </SmallOrbitingContainer>
        <SmallOrbitingContainer modelIndex={4} scale={orbs[4].size}>
          <PumpBottleModel />
        </SmallOrbitingContainer>
      </group>
    </>
  );
}

/* Preload all 5 GLB models */
useGLTF.preload("/assets/models/red-wax.glb");
useGLTF.preload("/assets/models/black-wax.glb");
useGLTF.preload("/assets/models/without-up.glb");
useGLTF.preload("/assets/models/colonia-bottle.glb");
useGLTF.preload("/assets/models/pump-bottle.glb");

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
          <ambientLight intensity={0.75} />
          <spotLight position={[6, 8, 6]} angle={0.5} intensity={190} color="#ffffff" />
          <pointLight position={[-6, -3, 4]} intensity={90} color="#ffffff" />
          <pointLight position={[0, 5, -6]} intensity={60} color="#ffffff" />
          <Suspense fallback={null}>
            <SceneContent bgRef={bgRef} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

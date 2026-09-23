import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { scrollBus, initScrollBus } from "../../lib/scrollBus";

/* ------------------------------------------------------------------ */
/* Gold particle field — drifts like film frames while scrolling       */
/* ------------------------------------------------------------------ */
function ParticleFrames({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // layered bands → looks like stacked "frames" of film
      const band = Math.floor(i / (count / 5));
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18 + (band - 2) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      scl[i] = Math.random();
    }
    return [pos, scl];
  }, [count]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const p = scrollBus.progress;
    // scroll = playhead: particles stream upward like frames
    pts.rotation.y = t * 0.02 + p * Math.PI * 1.5;
    pts.position.y = p * 10;
    const mat = pts.material as THREE.PointsMaterial;
    mat.size = 0.05 + 0.02 * Math.sin(t * 0.8);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4a95c"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Wireframe rings — rotate to the next "frame" per section            */
/* ------------------------------------------------------------------ */
function FrameRings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollBus.progress;
    if (a.current) {
      a.current.rotation.x = Math.PI / 2.6 + p * Math.PI;
      a.current.rotation.z = t * 0.05 + p * 2;
    }
    if (b.current) {
      b.current.rotation.y = t * 0.04 - p * Math.PI * 1.2;
      b.current.rotation.x = -0.4 + p * 1.5;
    }
  });

  return (
    <>
      <mesh ref={a} position={[0, 0, -6]}>
        <torusGeometry args={[7.5, 0.015, 8, 128]} />
        <meshBasicMaterial color="#b98a3e" transparent opacity={0.35} />
      </mesh>
      <mesh ref={b} position={[0, 0, -8]}>
        <torusGeometry args={[10.5, 0.01, 8, 128]} />
        <meshBasicMaterial color="#d4a95c" transparent opacity={0.18} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Floating gold monoliths (glass bars) per section feel               */
/* ------------------------------------------------------------------ */
function Monoliths() {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh position={[-7.5, 1.5, -5]} rotation={[0.4, 0.6, 0]}>
        <boxGeometry args={[0.5, 4.4, 0.5]} />
        <meshStandardMaterial
          color="#d4a95c"
          metalness={0.95}
          roughness={0.25}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
}

function Rig() {
  useFrame((state) => {
    const p = scrollBus.progress;
    // camera dollies + drifts as the user scrolls = "next frame"
    state.camera.position.z = 10 - p * 2.2;
    state.camera.position.y = -p * 1.4;
    state.camera.rotation.z = Math.sin(p * Math.PI) * 0.02;
  });
  return null;
}

/* ------------------------------------------------------------------ */
export default function BackgroundCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (!reduced) {
      setEnabled(true);
      return initScrollBus();
    }
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, isMobile ? 1.3 : 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 10], fov: 55 }}
      >
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 6, 6]} intensity={40} color="#ecd9ac" />
        <pointLight position={[-6, -4, 2]} intensity={26} color="#b98a3e" />
        <ParticleFrames count={isMobile ? 500 : 1400} />
        <FrameRings />
        {!isMobile && <Monoliths />}
        <Rig />
        <fog attach="fog" args={["#0d0b09", 12, 26]} />
      </Canvas>
      {/* vignette + grain overlay for cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(13,11,9,0.75)_100%)]" />
    </div>
  );
}

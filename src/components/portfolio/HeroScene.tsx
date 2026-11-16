import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture } from "three";
import type { Group, Mesh, PerspectiveCamera, PointLight, Points } from "three";
import { heroOrbitSkills, skills } from "@/components/portfolio/data";

const SKILL_GROUP_NAMES = new Set(skills.map((g) => g.group));
function isSkillGroupLabel(label: string) {
  return SKILL_GROUP_NAMES.has(label);
}

const PARTICLE_COUNT = 420;
const SPARKLE_COUNT = 120;
/** Global slowdown for hero motion (skill orbit uses its own rates below). */
const SCENE_SPEED = 0.42;
const SKILL_RING_SPEED = [0.07, -0.06, 0.055] as const;

function makeSkillLabelTexture(label: string) {
  const w = 300;
  const h = 76;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new CanvasTexture(canvas);

  ctx.clearRect(0, 0, w, h);
  const pad = 10;
  const rx = 20;
  const bw = w - pad * 2;
  const bh = h - pad * 2;
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(pad, pad, bw, bh, rx);
  } else {
    ctx.rect(pad, pad, bw, bh);
  }
  ctx.fillStyle = "rgba(24, 22, 58, 0.82)";
  ctx.fill();
  ctx.strokeStyle = "rgba(129, 140, 248, 0.75)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const isGroup = isSkillGroupLabel(label);
  ctx.fillStyle = isGroup ? "#c7d2fe" : "#eef2ff";
  let fontSize = isGroup ? 22 : 20;
  const maxText = w - 48;
  while (fontSize > 12) {
    ctx.font = `600 ${fontSize}px Manrope, system-ui, sans-serif`;
    if (ctx.measureText(label).width <= maxText) break;
    fontSize -= 1;
  }
  if (isGroup) {
    ctx.strokeStyle = "rgba(167, 139, 250, 0.9)";
    ctx.lineWidth = 1.5;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, w / 2, h / 2);

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/** Single skill badge (always faces the camera). */
function SkillBadge({ label }: { label: string }) {
  const map = useMemo(() => makeSkillLabelTexture(label), [label]);
  useEffect(() => () => map.dispose(), [map]);
  const isGroup = isSkillGroupLabel(label);
  const scale = isGroup ? ([1.2, 0.32, 1] as const) : ([1.08, 0.28, 1] as const);
  return (
    <sprite scale={scale}>
      <spriteMaterial map={map} transparent depthTest depthWrite={false} />
    </sprite>
  );
}

function splitSkillsIntoRings(labels: string[], ringCount: number) {
  const size = Math.ceil(labels.length / ringCount);
  return Array.from({ length: ringCount }, (_, i) => labels.slice(i * size, (i + 1) * size)).filter(
    (chunk) => chunk.length > 0,
  );
}

/** Three rings carrying every skill + category label, rotating slowly. */
function SkillOrbit({ paused }: { paused: boolean }) {
  const ringA = useRef<Group>(null);
  const ringB = useRef<Group>(null);
  const ringC = useRef<Group>(null);
  const wrapper = useRef<Group>(null);

  const [labelsA, labelsB, labelsC] = useMemo(() => splitSkillsIntoRings(heroOrbitSkills, 3), []);
  const rings = useMemo(
    () =>
      [
        { ref: ringA, labels: labelsA, radius: 2.85, wobble: 0.18, tilt: [0.28, 0, 0] as const },
        {
          ref: ringB,
          labels: labelsB,
          radius: 3.35,
          wobble: 0.22,
          tilt: [0.52, 0.75, 0.15] as const,
        },
        {
          ref: ringC,
          labels: labelsC,
          radius: 3.85,
          wobble: 0.26,
          tilt: [0.38, -0.55, 0.22] as const,
        },
      ] as const,
    [labelsA, labelsB, labelsC],
  );

  useFrame((state, delta) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    const refs = [ringA, ringB, ringC];
    refs.forEach((r, i) => {
      if (r.current) r.current.rotation.y += delta * SKILL_RING_SPEED[i];
    });
    if (wrapper.current) {
      wrapper.current.rotation.x = 0.3 + Math.sin(t * 0.18) * 0.05;
    }
  });

  const placeOnRing = (labels: string[], radius: number, yWobble: number) =>
    labels.map((label, i) => {
      const angle = (i / labels.length) * Math.PI * 2;
      const y = Math.sin(angle * 2) * yWobble;
      const z = Math.sin(angle) * radius * 0.48;
      const key = `${label}-${i}`;
      return (
        <group key={key} position={[Math.cos(angle) * radius, y, z]}>
          <SkillBadge label={label} />
        </group>
      );
    });

  return (
    <group ref={wrapper}>
      {rings.map(({ ref, labels, radius, wobble, tilt }, idx) => (
        <group key={idx} ref={ref} rotation={tilt}>
          {placeOnRing(labels, radius, wobble)}
        </group>
      ))}
    </group>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Soft starfield behind the hero shapes. */
function ParticleField({ paused }: { paused: boolean }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (paused || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y += delta * 0.055 * SCENE_SPEED;
    ref.current.rotation.x = Math.sin(t * 0.15 * SCENE_SPEED) * 0.08;
    ref.current.position.y = Math.sin(t * 0.35 * SCENE_SPEED) * 0.12;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a5b4fc"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Brighter, faster drift layer in front of the starfield. */
function SparkleField({ paused }: { paused: boolean }) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(SPARKLE_COUNT * 3);
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const r = 2.5 + Math.random() * 4;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = Math.sin(a) * r * 0.5;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (paused || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y -= delta * 0.12 * SCENE_SPEED;
    ref.current.rotation.z = Math.cos(t * 0.5 * SCENE_SPEED) * 0.04;
    const mat = ref.current.material;
    if (mat && !Array.isArray(mat) && "opacity" in mat) {
      mat.opacity = 0.35 + Math.sin(t * 2 * SCENE_SPEED) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#e0e7ff"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Thin orbital rings with scale and wobble. */
function HaloRings({ paused }: { paused: boolean }) {
  const ring1 = useRef<Mesh>(null);
  const ring2 = useRef<Mesh>(null);
  const ring3 = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.55 * SCENE_SPEED;
      ring1.current.rotation.y += delta * 0.2 * SCENE_SPEED;
      const s = 1 + Math.sin(t * 1.3 * SCENE_SPEED) * 0.06;
      ring1.current.scale.setScalar(2.55 * s);
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.4 * SCENE_SPEED;
      ring2.current.rotation.z = Math.sin(t * 0.9 * SCENE_SPEED) * 0.35;
      ring2.current.scale.setScalar(2.05 + Math.cos(t * 1.7 * SCENE_SPEED) * 0.05);
    }
    if (ring3.current) {
      ring3.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.6 * SCENE_SPEED) * 0.15;
      ring3.current.rotation.z += delta * 0.65 * SCENE_SPEED;
    }
  });

  const ringMat = (opacity: number) => (
    <meshBasicMaterial color="#818cf8" transparent opacity={opacity} depthWrite={false} />
  );

  return (
    <group>
      <mesh ref={ring1} rotation={[0.6, 0.2, 0.1]}>
        <torusGeometry args={[1, 0.014, 6, 128]} />
        {ringMat(0.4)}
      </mesh>
      <mesh ref={ring2} rotation={[1.1, 0.5, -0.3]}>
        <torusGeometry args={[1, 0.01, 6, 96]} />
        {ringMat(0.28)}
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.008, 4, 80]} />
        {ringMat(0.22)}
      </mesh>
    </group>
  );
}

/** Tiny shapes on drifting paths around the scene. */
function DriftOrbiters({ paused }: { paused: boolean }) {
  const root = useRef<Group>(null);

  useFrame((state, delta) => {
    if (paused || !root.current) return;
    const t = state.clock.elapsedTime;
    root.current.children.forEach((child, i) => {
      const speed = (0.45 + i * 0.12) * SCENE_SPEED;
      const radius = 2.8 + i * 0.45;
      const phase = i * 1.4;
      child.position.x = Math.cos(t * speed + phase) * radius;
      child.position.z = Math.sin(t * speed * 1.15 + phase) * radius * 0.45;
      child.position.y = Math.sin(t * speed * 1.35 + phase * 2) * (0.65 + i * 0.15);
      child.rotation.x += delta * (1.2 + i * 0.2) * SCENE_SPEED;
      child.rotation.y += delta * (0.9 + i * 0.15) * SCENE_SPEED;
    });
  });

  const orbs = [
    { geo: <tetrahedronGeometry args={[0.14, 0]} />, color: "#a5b4fc", emissive: "#4338ca" },
    { geo: <octahedronGeometry args={[0.11]} />, color: "#7dd3fc", emissive: "#0891b2" },
  ] as const;

  return (
    <group ref={root}>
      {orbs.map((o, i) => (
        <mesh key={i}>
          {o.geo}
          <meshStandardMaterial
            color={o.color}
            emissive={o.emissive}
            emissiveIntensity={0.55}
            metalness={0.25}
            roughness={0.35}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

/** Subtle camera parallax toward the pointer. */
function CameraRig({ paused }: { paused: boolean }) {
  useFrame((state) => {
    if (paused) return;
    const cam = state.camera as PerspectiveCamera;
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.32;
    const scroll =
      typeof window === "undefined" ? 0 : Math.min(window.scrollY / window.innerHeight, 1);
    cam.position.x += (targetX - cam.position.x) * 0.045;
    cam.position.y += (targetY - cam.position.y) * 0.045;
    cam.position.z = 6.5 - scroll * 0.6;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/** Point light eases toward the cursor for depth and highlights. */
function MouseLight({ paused }: { paused: boolean }) {
  const light = useRef<PointLight>(null);
  useFrame((state) => {
    if (paused || !light.current) return;
    const targetX = state.pointer.x * 3.5;
    const targetY = state.pointer.y * 2.5;
    light.current.position.x += (targetX - light.current.position.x) * 0.06;
    light.current.position.y += (targetY - light.current.position.y) * 0.06;
    const pulse = 12 + Math.sin(state.clock.elapsedTime * 1.2 * SCENE_SPEED) * 3;
    light.current.intensity += (pulse - light.current.intensity) * 0.08;
  });
  return <pointLight ref={light} position={[0, 0, 4]} color="#818cf8" />;
}

/** Small meshes orbit the core on two tilted rings. */
function OrbitSatellites({ paused }: { paused: boolean }) {
  const ringA = useRef<Group>(null);
  const ringB = useRef<Group>(null);

  useFrame((_, delta) => {
    if (paused) return;
    if (ringA.current) {
      ringA.current.rotation.z += delta * 0.45 * SCENE_SPEED;
      ringA.current.rotation.y += delta * 0.12 * SCENE_SPEED;
    }
    if (ringB.current) {
      ringB.current.rotation.x += delta * 0.35 * SCENE_SPEED;
      ringB.current.rotation.z -= delta * 0.2 * SCENE_SPEED;
    }
  });

  const bead = (color: string, emissive: string) => (
    <mesh>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.45}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  );

  return (
    <>
      <group ref={ringA} rotation={[Math.PI / 3.2, 0.4, 0]}>
        <group position={[2.35, 0, 0]}>{bead("#38bdf8", "#0ea5e9")}</group>
        <group position={[-2.35, 0, 0]}>{bead("#60a5fa", "#2563eb")}</group>
        <group position={[0, 2.35, 0]}>{bead("#c7d2fe", "#6366f1")}</group>
      </group>
      <group ref={ringB} rotation={[0.2, Math.PI / 4, Math.PI / 5]}>
        <group position={[1.85, 0, 0.6]}>{bead("#818cf8", "#4f46e5")}</group>
        <group position={[-1.85, 0, -0.4]}>{bead("#7dd3fc", "#0891b2")}</group>
      </group>
    </>
  );
}

/** Floating geometric shapes that lean toward the mouse. */
function Shapes({ paused }: { paused: boolean }) {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const wire = useRef<Mesh>(null);
  const wireInner = useRef<Mesh>(null);
  const torus = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05) * SCENE_SPEED;
    const g = group.current;
    if (!g) return;

    const scroll = typeof window === "undefined" ? 0 : window.scrollY / window.innerHeight;
    const follow = paused ? 0.5 : 2.2;

    g.rotation.y +=
      (state.pointer.x * 0.6 + Math.min(scroll, 1) * 0.8 - g.rotation.y) * dt * follow;
    g.rotation.x += (-state.pointer.y * 0.4 - g.rotation.x) * dt * follow;

    if (core.current) {
      core.current.rotation.x += dt * 0.35;
      core.current.rotation.y += dt * 0.45;
      if (!paused) {
        const s = 1 + Math.sin(state.clock.elapsedTime * 1.1 * SCENE_SPEED) * 0.04;
        core.current.scale.setScalar(s);
      }
    }

    if (wire.current) {
      wire.current.rotation.y -= dt * 0.32;
      wire.current.rotation.z += dt * 0.14;
      if (!paused) {
        const w = 1.85 + Math.sin(state.clock.elapsedTime * 0.9 * SCENE_SPEED) * 0.06;
        wire.current.scale.setScalar(w);
      }
    }

    if (wireInner.current) {
      wireInner.current.rotation.y += dt * 0.5;
      wireInner.current.rotation.x -= dt * 0.18;
    }

    if (torus.current) {
      torus.current.rotation.x += dt * 0.55;
      torus.current.rotation.z += dt * 0.35;
      if (!paused) {
        torus.current.position.y =
          1.1 + Math.sin(state.clock.elapsedTime * 1.25 * SCENE_SPEED) * 0.15;
      }
    }

    g.children.forEach((c, i) => {
      if (i === 0 || i === g.children.length - 1 || i === g.children.length - 2) return;
      if (!paused) {
        const bob =
          Math.sin(state.clock.elapsedTime * (0.75 + i * 0.08) * SCENE_SPEED + i) * dt * 0.22;
        c.position.y += bob;
        c.position.x += Math.cos(state.clock.elapsedTime * 0.5 * SCENE_SPEED + i * 1.7) * dt * 0.04;
      }
      c.rotation.x += dt * 0.18 * (i % 2 ? 1 : -0.5);
      c.rotation.z += dt * 0.26 * (i % 2 ? 1 : -1);
    });
  });

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#5b52e8" metalness={0.45} roughness={0.2} flatShading />
      </mesh>
      <mesh ref={torus} position={[2.1, 1.1, -0.5]}>
        <torusGeometry args={[0.45, 0.16, 24, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.2}
          metalness={0.35}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[-2.1, -1, 0.3]}>
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial color="#818cf8" roughness={0.35} flatShading />
      </mesh>
      <mesh position={[-1.7, 1.5, -1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#c7d2fe" roughness={0.2} metalness={0.15} />
      </mesh>
      <mesh position={[1.8, -1.4, 0.4]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.28} />
      </mesh>
      <mesh ref={wireInner} scale={1.45}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#bae6fd" wireframe transparent opacity={0.1} />
      </mesh>
      <mesh ref={wire} scale={1.85}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#7c7af5" wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Scene() {
  const reduced = useReducedMotion();
  const accent = useRef<PointLight>(null);

  useFrame((state) => {
    if (reduced || !accent.current) return;
    const t = state.clock.elapsedTime;
    accent.current.intensity = 8 + Math.sin(t * 1.8 * SCENE_SPEED) * 4;
    accent.current.position.x = Math.sin(t * 0.7 * SCENE_SPEED) * 3;
    accent.current.position.z = Math.cos(t * 0.5 * SCENE_SPEED) * 2 - 1;
  });

  return (
    <>
      <CameraRig paused={reduced} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 5]} intensity={1.5} color="#e0e7ff" />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#7dd3fc" />
      <pointLight ref={accent} position={[2, 1, -2]} color="#a78bfa" intensity={10} />
      <MouseLight paused={reduced} />
      <ParticleField paused={reduced} />
      <SparkleField paused={reduced} />
      <HaloRings paused={reduced} />
      <DriftOrbiters paused={reduced} />
      <OrbitSatellites paused={reduced} />
      <Shapes paused={reduced} />
      <SkillOrbit paused={reduced} />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}

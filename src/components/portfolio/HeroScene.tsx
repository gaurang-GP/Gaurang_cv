import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";

/** Floating geometric shapes that lean toward the mouse. */
function Shapes() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = group.current;
    if (!g) return;
    // Spin the whole scene as the page scrolls
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / window.innerHeight;
    g.rotation.y += (state.pointer.x * 0.6 + Math.min(scroll, 1) * 0.8 - g.rotation.y) * dt * 3;
    
    g.rotation.x += (-state.pointer.y * 0.4 - g.rotation.x) * dt * 3;
    if (core.current) {
      core.current.rotation.x += dt * 0.3;
      core.current.rotation.y += dt * 0.4;
    }
    g.children.forEach((c, i) => {
      if (i === 0) return;
      c.position.y += Math.sin(state.clock.elapsedTime * 0.8 + i) * dt * 0.15;
      c.rotation.z += dt * 0.2 * (i % 2 ? 1 : -1);
    });
  });
  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#4f6bed" metalness={0.35} roughness={0.25} flatShading />
      </mesh>
      <mesh position={[2.1, 1.1, -0.5]}>
        <torusGeometry args={[0.45, 0.16, 24, 64]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[-2.1, -1, 0.3]}>
        <octahedronGeometry args={[0.55]} />
        <meshStandardMaterial color="#818cf8" roughness={0.35} flatShading />
      </mesh>
      <mesh position={[-1.7, 1.5, -1]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#c7d2fe" roughness={0.2} />
      </mesh>
      <mesh position={[1.8, -1.4, 0.4]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#60a5fa" roughness={0.3} />
      </mesh>
      <mesh scale={1.75}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 5]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={20} color="#7dd3fc" />
      <Shapes />
    </Canvas>
  );
}

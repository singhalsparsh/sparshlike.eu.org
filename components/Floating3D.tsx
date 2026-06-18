'use client';

import { useRef, useMemo } from 'react';
import { useFrame, type Group } from '@react-three/fiber';
import { PresentationControls, Icosahedron, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

interface PoseState {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
}

interface Floating3DProps {
  poseRef: React.MutableRefObject<PoseState>;
}

export function Floating3D({ poseRef }: Floating3DProps) {
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Indigo palette
  const colors = useMemo(() => ({
    primary: new THREE.Color('#4f46e5'),
    secondary: new THREE.Color('#6366f1'),
    accent: new THREE.Color('#818cf8'),
    glow: new THREE.Color('#a5b4fc'),
    dark: new THREE.Color('#1e1b4b'),
  }), []);

  // Shared material for the main torus knot
  const knotMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: colors.primary,
        metalness: 0.4,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.3,
        emissive: colors.accent,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 1,
      }),
    [colors]
  );

  // Wireframe ring material
  const ringMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: colors.secondary,
        metalness: 0.6,
        roughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: colors.accent,
        emissiveIntensity: 0.08,
      }),
    [colors]
  );

  // Orbiting particle material
  const particleMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: colors.accent,
        emissive: colors.glow,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.5,
      }),
    [colors]
  );

  // Glow ring behind the main object
  const glowRingMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.accent,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      }),
    [colors]
  );

  useFrame(({ clock }) => {
    if (!groupRef.current || !innerRef.current) return;

    const t = clock.elapsedTime;

    // Slow float rotation
    groupRef.current.rotation.y = Math.sin(t * 0.08) * 0.3;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;

    // Inner group rotation (faster, opposite direction)
    innerRef.current.rotation.y = t * 0.2;
    innerRef.current.rotation.z = Math.sin(t * 0.15) * 0.1;

    // Bob
    groupRef.current.position.y = Math.sin(t * 0.3) * 0.08;

    // Pulse knot emissive
    if (knotRef.current) {
      const mat = knotRef.current.material as THREE.MeshPhysicalMaterial;
      mat.emissiveIntensity = 0.15 + Math.sin(t * 0.8) * 0.1;
    }

    // Spin ring wireframe
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.z = t * 0.2;
    }

    // Apply pose
    const pose = poseRef.current;
    const baseY = groupRef.current.position.y;
    groupRef.current.position.set(pose.x, baseY, pose.z);
    groupRef.current.scale.setScalar(pose.scale);

    const finalOpacity = pose.opacity;
    knotMat.opacity = finalOpacity;
    ringMat.opacity = finalOpacity * 0.3;
    particleMat.opacity = finalOpacity * 0.5;
    glowRingMat.opacity = finalOpacity * 0.06;
    knotMat.transparent = finalOpacity < 1;
    ringMat.transparent = finalOpacity < 1;
    particleMat.transparent = finalOpacity < 1;
    glowRingMat.transparent = finalOpacity < 1;
    knotMat.needsUpdate = true;
    ringMat.needsUpdate = true;
    particleMat.needsUpdate = true;
  });

  return (
    <PresentationControls
      global
      rotation={[0, 0, 0]}
      polar={[-0.5, 0.5]}
      azimuth={[-0.8, 0.8]}
      config={{ mass: 2, tension: 400 }}
      snap={{ mass: 4, tension: 1500 }}
    >
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Outer glow ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[2.0, 2.3, 64]} />
          <primitive object={glowRingMat} attach="material" />
        </mesh>

        {/* Inner rotating group */}
        <group ref={innerRef}>
          {/* Main torus knot (centerpiece) */}
          <TorusKnot
            ref={knotRef}
            args={[0.8, 0.25, 128, 16, 3, 4]}
            position={[0, 0, 0]}
          >
            <primitive object={knotMat} attach="material" />
          </TorusKnot>

          {/* Orbiting wireframe ring */}
          <mesh ref={ringRef} position={[0, 0, 0]}>
            <torusGeometry args={[1.3, 0.03, 24, 48]} />
            <primitive object={ringMat} attach="material" />
          </mesh>

          {/* Second ring at 60deg */}
          <mesh rotation={[Math.PI / 3, 0, 0]} position={[0, 0, 0]}>
            <torusGeometry args={[1.3, 0.02, 24, 48]} />
            <primitive object={ringMat} attach="material" />
          </mesh>
        </group>

        {/* Small orbiting particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 1.8;
          return (
            <mesh
              key={`orb-${i}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 2) * 0.2,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.025, 8, 8]} />
              <primitive object={particleMat} attach="material" />
            </mesh>
          );
        })}

        {/* Floating smaller icosahedrons */}
        {[
          { pos: [1.5, 0.6, 0.3], s: 0.08 },
          { pos: [-1.2, -0.5, 1.0], s: 0.06 },
          { pos: [0.8, -0.7, -1.2], s: 0.07 },
          { pos: [-1.4, 0.8, -0.5], s: 0.05 },
        ].map(({ pos, s }, i) => (
          <Icosahedron key={`ico-${i}`} args={[s, 0]} position={pos as [number, number, number]}>
            <meshPhysicalMaterial
              color={colors.secondary}
              metalness={0.7}
              roughness={0.2}
              emissive={colors.accent}
              emissiveIntensity={0.1}
              transparent
              opacity={0.4}
            />
          </Icosahedron>
        ))}
      </group>
    </PresentationControls>
  );
}

"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PresentationControls,
  Sparkles,
} from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { buildSigilShapes } from "./sigil-shapes";

const COIN_DEPTH = 0.55;
const COIN_BEVEL_T = 0.04;
const COIN_BEVEL_S = 0.03;
const coinOpts = {
  depth: COIN_DEPTH,
  bevelEnabled: true,
  bevelThickness: COIN_BEVEL_T,
  bevelSize: COIN_BEVEL_S,
  bevelSegments: 2,
  steps: 1,
};

function SigilModel() {
  const shapes = useMemo(() => buildSigilShapes(), []);

  const starGeos = useMemo(
    () =>
      shapes.star.map(
        (s) => new THREE.ExtrudeGeometry(s, coinOpts).translate(0, 0, -COIN_DEPTH / 2)
      ),
    [shapes.star]
  );
  const eyeGeo = useMemo(
    () => new THREE.ExtrudeGeometry(shapes.eye, coinOpts).translate(0, 0, -COIN_DEPTH / 2),
    [shapes.eye]
  );
  const pupilGeo = useMemo(
    () => new THREE.ExtrudeGeometry(shapes.pupil, coinOpts).translate(0, 0, -COIN_DEPTH / 2),
    [shapes.pupil]
  );

  return (
    <group>
      {starGeos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial
            color="#520808"
            emissive="#ff0606"
            emissiveIntensity={2.6}
            roughness={0.45}
            metalness={0.15}
          />
        </mesh>
      ))}
      <mesh geometry={eyeGeo}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff8f8f"
          emissiveIntensity={0.25}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>
      <mesh geometry={pupilGeo}>
        <meshStandardMaterial color="#050505" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

function SpinGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.45;
  });
  return <group ref={ref}>{children}</group>;
}

export default function SigilScene() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 6]} intensity={2.2} color="#ff3939" />
      <directionalLight position={[-4, -1, 3]} intensity={0.7} color="#ffffff" />
      <directionalLight position={[0, 3, -4]} intensity={1.6} color="#ff0606" />

      <SpinGroup>
        <PresentationControls
          snap
          polar={[-0.3, 0.3]}
          azimuth={[-0.8, 0.8]}
          damping={0.2}
          cursor
        >
          <Float speed={1.4} rotationIntensity={0} floatIntensity={0.6} floatingRange={[-0.06, 0.06]}>
            <SigilModel />
          </Float>
        </PresentationControls>
      </SpinGroup>

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.55}
        scale={11}
        blur={2.4}
        far={3.5}
        color="#ff0606"
      />

      <Sparkles
        count={45}
        scale={[5.5, 4.5, 2]}
        size={2.2}
        speed={0.4}
        opacity={0.5}
        color="#ff0606"
      />

      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2} color="#ff0606" position={[0, 0, 4]} scale={[8, 6]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[-4, 2, 0]} scale={[6, 6]} />
        <Lightformer form="rect" intensity={1.2} color="#ff3939" position={[4, -2, 0]} scale={[6, 6]} />
      </Environment>

      <EffectComposer multisampling={4}>
        <Bloom
          mipmapBlur
          intensity={0.9}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.25}
          radius={0.55}
        />
        <Vignette darkness={1.05} offset={0.25} />
      </EffectComposer>
    </>
  );
}

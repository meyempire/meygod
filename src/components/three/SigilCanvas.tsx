"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import SigilScene from "./SigilScene";

export default function SigilCanvas({ onLive }: { onLive: () => void }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 12], fov: 36 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.0;
        onLive();
      }}
    >
      <SigilScene />
    </Canvas>
  );
}

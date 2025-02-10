import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";

function ThreeScene(){
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[0, 0, 5]} />
      <mesh scale={[3, 3, 3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}

window.renderThreeScene = (elementId) => {
  const container = document.getElementById(elementId);
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ThreeScene />
    </StrictMode>
  );
};
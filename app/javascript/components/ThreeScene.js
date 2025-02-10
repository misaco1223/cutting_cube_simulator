import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

function ThreeScene(){
  return (
    <Canvas />
  );
}

window.renderThreeScene = (elementId) => {
  const container = document.getElementById(elementId);
  if (!container) {
    console.error(`Element with ID "${elementId}" が見つかりません。`);
    return;
  }
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <ThreeScene />
    </StrictMode>
  );
};
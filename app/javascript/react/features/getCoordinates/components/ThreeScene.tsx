import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import InteractiveCube from "./ui/InteractiveCube";

window.renderInteractiveCube = (elementId) => {
  const container = document.getElementById(elementId);
  if (container !== null) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <Canvas>
          <InteractiveCube />
        </Canvas>
      </StrictMode>
    );
    
  }
};
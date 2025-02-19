import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import InteractiveCube from "./components/ui/InteractiveCube";

window.renderInteractiveCube = (elementId) => {
  const container = document.getElementById(elementId);
  if (container !== null) {
    const root = createRoot(container);
    root.render(
      <StrictMode>
        <InteractiveCube />
      </StrictMode>
    );
  }
};
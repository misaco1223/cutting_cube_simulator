declare global {
  interface Window {
    renderInteractiveCube: (elementId: string) => void;
    renderEditPointsForm: (elementId: string) => void;
  }
}
export {};
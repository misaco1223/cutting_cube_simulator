import * as THREE from "three";


export interface ClickableEdgesProps {
  onClick: (clickedPoint: THREE.Vector3) => void;
}

export interface InteractiveCubeProps {
  onClick: (clickedPoint: THREE.Vector3) => void;
}

export interface EditPointsFormProps {
  points: { x: number; y: number; z: number }[]; // 例: 点のデータ
  onUpdatePoints: (points: { x: number; y: number; z: number }[]) => void;
  index: number;
  axis: "x" | "y" | "z";
  value: string;
}
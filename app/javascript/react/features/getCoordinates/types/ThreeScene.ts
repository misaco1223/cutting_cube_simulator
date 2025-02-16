import * as THREE from "three";


export interface ClickableEdgesProps {
  onClick: (clickedPoint: THREE.Vector3) => void;
}

export interface EditPointsFormProps {
  points: THREE.Vector3[];
  onUpdatePoints: (points: THREE.Vector3[]) => void;
}

export const vertices = [
  new THREE.Vector3(-1.5, -1.5, -1.5), // H
  new THREE.Vector3( 1.5, -1.5, -1.5), // G
  new THREE.Vector3( 1.5,  1.5, -1.5), // C
  new THREE.Vector3(-1.5,  1.5, -1.5), // D
  new THREE.Vector3(-1.5, -1.5,  1.5), // E
  new THREE.Vector3( 1.5, -1.5,  1.5), // F
  new THREE.Vector3( 1.5,  1.5,  1.5), // B
  new THREE.Vector3(-1.5,  1.5,  1.5), // A
];
  
export const labels = ['H', 'G', 'C', 'D', 'E', 'F', 'B', 'A'];

export interface PointInfo {
  point: THREE.Vector3;
  isVertex: boolean;
  vertexLabel: string;
}
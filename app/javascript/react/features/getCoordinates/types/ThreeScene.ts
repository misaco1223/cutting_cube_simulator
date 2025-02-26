import * as THREE from "three";


export interface ClickableEdgesProps {
  onClick: (clickedPoint: THREE.Vector3) => void;
}

export interface EditPointsFormProps {
  points: THREE.Vector3[];
  onUpdatePoints: (points: THREE.Vector3[]) => void;
}

export interface SendPointsButtonProps {
  points: THREE.Vector3[];
}

export const vertices = [
  new THREE.Vector3(-1, -1, -1), // H
  new THREE.Vector3( 1, -1, -1), // G
  new THREE.Vector3( 1,  1, -1), // C
  new THREE.Vector3(-1,  1, -1), // D
  new THREE.Vector3(-1, -1,  1), // E
  new THREE.Vector3( 1, -1,  1), // F
  new THREE.Vector3( 1,  1,  1), // B
  new THREE.Vector3(-1,  1,  1), // A
];
  
export const vertexLabels = ['H', 'G', 'C', 'D', 'E', 'F', 'B', 'A'];

export type Edge = [THREE.Vector3, THREE.Vector3];

export const edges: Edge[] = [
  [vertices[7], vertices[6]], // AB
  [vertices[6], vertices[5]], // BF
  [vertices[4], vertices[5]], // EF
  [vertices[7], vertices[4]], // AE
  [vertices[2], vertices[3]], // CD
  [vertices[2], vertices[1]], // CG
  [vertices[1], vertices[0]], // GH
  [vertices[0], vertices[3]], // HD
  [vertices[7], vertices[3]], // AD
  [vertices[6], vertices[2]], // BC
  [vertices[5], vertices[1]], // FG
  [vertices[4], vertices[0]], // EH
];

export const edgeLabels = [
  "AB", "BF", "EF", "AE",
  "CD", "CG", "GH", "HD",
  "AD", "BC", "FG", "EH"
];

export interface PointInfo {
  point: THREE.Vector3;
  isVertex: boolean; //頂点or辺を表示するために使用
  vertexLabel?: string;
  edgeLabel: string;
  edgeRatio: { //頂点の場合も比を表示するため
    left: string;
    right: string;
  }
}
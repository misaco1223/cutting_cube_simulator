import * as THREE from "three";


export interface ClickableEdgesProps {
  onClick: (clickedPoint: THREE.Vector3) => void;
}

export interface EditPointsFormProps {
  points: THREE.Vector3[];
  onUpdatePoints: (points: THREE.Vector3[]) => void;
}

import * as THREE from "three";
import { edgeLabels, edges} from '../types/ThreeScene';

export const calculateRatioToPoint = (left: string, right: string, edgeLabel: string) => {

  const numLeft = parseFloat(left);
  const numRight = parseFloat(right);

  const t = numLeft / (numLeft + numRight);

  
  const edgeIndex = edgeLabels.indexOf(edgeLabel);

  const [start, end] = edges[edgeIndex];

  // 新しい座標を計算
  const newX = start.x + t * (end.x - start.x);
  const newY = start.y + t * (end.y - start.y);
  const newZ = start.z + t * (end.z - start.z);

  const newPoint = new THREE.Vector3(newX,newY,newZ)
  // console.log("辺の比から新しい点を計算しました", newPoint)

  return { point: newPoint};
};

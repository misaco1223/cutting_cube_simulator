import * as THREE from "three";

export const isPointOnEdge = (point: THREE.Vector3, edge: [THREE.Vector3, THREE.Vector3]) => {
    const tTolerance = 0.05;
    const cTolerance = 0.000001;
  
    const [start, end] = edge;

    const edgeVector = new THREE.Vector3().subVectors(end, start);
    const pointVector = new THREE.Vector3().subVectors(point, start);
  
    // tパラメータの計算
    let t = pointVector.dot(edgeVector) / edgeVector.dot(edgeVector);
  
    // tの調整
    if (t < tTolerance) {
      t = 0;
    } else if (t > 1 - tTolerance) {
      t = 1;
    }
  
    // Collinear (共線) の判定
    const crossProduct = new THREE.Vector3().crossVectors(edgeVector, pointVector);
    const isCollinear = crossProduct.length() < cTolerance;
  
    // tが0から1の範囲にあり、かつCollinearなら辺上にある
    return { isCollinear, t };
  };
  
import * as THREE from "three";
import { edges, edgeLabels } from "../types/ThreeScene";
import { gcd }  from "./gcd";

export const checkEdge = (point: THREE.Vector3)=> {
  const tolerance = 0.1;

  for (let i = 0; i < edges.length; i++) {
    const [start, end] = edges[i];
    const edgeVector = new THREE.Vector3().subVectors(end, start);
    const pointVector = new THREE.Vector3().subVectors(point, start);

    const edgeLength = edgeVector.length();
    const pointLength = pointVector.length();

    const dotProduct = edgeVector.dot(pointVector);
    const cosTheta = dotProduct / (edgeLength * pointLength);

    const t = pointVector.dot(edgeVector) / edgeVector.dot(edgeVector);
    
    if (Math.abs(cosTheta - 1) < tolerance && t > 0 && t < 1 ){
 
      const numerator = 1 - t; // endから点まで
      const denominator = t;  // startから点まで

      // 最大公約数で約分
      const divisor = gcd(Math.round(numerator * 1000), Math.round(denominator * 1000));

      const simplifiedNumerator = Math.round(numerator * 1000) / divisor;
      const simplifiedDenominator = Math.round(denominator * 1000) / divisor;

      const ratio = `${simplifiedDenominator}:${simplifiedNumerator}`;

      return { edgeLabel: edgeLabels[i], edgeRatio: ratio };
    }
  }
  console.log("辺が見つかりませんでした");
  return { edgeLabel: undefined, edgeRatio: undefined};
};

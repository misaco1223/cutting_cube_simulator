import * as THREE from "three";
import { edges, edgeLabels, vertices, vertexLabels, PointInfo } from "../types/ThreeScene";
import { gcd }  from "./gcd";

export const checkPointInfo = (point: THREE.Vector3): PointInfo => {
  const vTolerance = 0.1;
  const tTolerance = 0.05;
  const cTolerance = 0.000001;

  for (let i = 0; i < edges.length; i++) {

    const foundVertexIndex = vertices.findIndex(
      (vertex) =>
      Math.abs(vertex.x - point.x) < vTolerance &&
      Math.abs(vertex.y - point.y) < vTolerance &&
      Math.abs(vertex.z - point.z) < vTolerance
    );

    const [start, end] = edges[i];
    const edgeVector = new THREE.Vector3().subVectors(end, start);
    const pointVector = new THREE.Vector3().subVectors(point, start);

    let t = pointVector.dot(edgeVector) / edgeVector.dot(edgeVector);
    if (t < tTolerance) {
      t = 0;
    } else if (t > 1 - tTolerance) {
      t = 1;
    }

    const denominator = t;  // startから点まで
    const numerator = 1 - t; // endから点まで

    const crossProduct = new THREE.Vector3().crossVectors(edgeVector, pointVector);
    const isCollinear = crossProduct.length() < cTolerance;

    console.log("i:", i, "foundVertexIndex:", foundVertexIndex, "t:", t, "辺:", edgeLabels[i], "延長線上の点である", isCollinear)
    
    if (foundVertexIndex !== -1){
      console.log("t:", t, "辺:", edgeLabels[i] , "頂点:", vertexLabels[foundVertexIndex] ,"頂点と認識されました") 
      return {
        point: vertices[foundVertexIndex],
        isVertex: true,
        vertexLabel: vertexLabels[foundVertexIndex],
        edgeLabel: edgeLabels[i],
        edgeRatio: {
          left: `${denominator}`,
          right: `${numerator}`
        }
      };
    } else if ( isCollinear && foundVertexIndex == -1 ){
        console.log("t:", t,  "辺:", edgeLabels[i] , "辺上の点と認識されました") 

        const divisor = gcd(Math.round(numerator * 1000), Math.round(denominator * 1000));
        
        const simplifiedDenominator = Math.round(denominator * 1000) / divisor;
        const simplifiedNumerator = Math.round(numerator * 1000) / divisor;

        return { 
          point,
          isVertex: false,
          vertexLabel: undefined,
          edgeLabel: edgeLabels[i],
          edgeRatio: {
            left: `${simplifiedDenominator}`,
            right: `${simplifiedNumerator}`
          }
        }
      } 
    };
  console.log("辺が見つかりませんでした");
  return {
    point,
    isVertex: true,
    edgeLabel: "",
    edgeRatio: {
        left: ``,
        right: ``
      }
  };
};

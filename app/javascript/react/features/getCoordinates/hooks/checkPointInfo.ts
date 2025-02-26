import * as THREE from "three";
import { edges, edgeLabels, vertices, vertexLabels, PointInfo } from "../types/ThreeScene";
import { gcd }  from "./gcd";
import { isPointOnEdge } from "./isPointOnEdge"

export const checkPointInfo = (point: THREE.Vector3): PointInfo => {
  const vTolerance = 0.1;

  for (let i = 0; i < edges.length; i++) {

    const foundVertexIndex = vertices.findIndex(
      (vertex) =>
      Math.abs(vertex.x - point.x) < vTolerance &&
      Math.abs(vertex.y - point.y) < vTolerance &&
      Math.abs(vertex.z - point.z) < vTolerance
    );

    const { isCollinear, t } = isPointOnEdge(point, edges[i]);

    // tの調整
    const denominator = t;  // startから点まで
    const numerator = 1 - t; 
    
    if (foundVertexIndex !== -1){
      return {
        point: vertices[foundVertexIndex],
        isVertex: true,
        vertexLabel: vertexLabels[foundVertexIndex],
        edgeLabel: edgeLabels[i],
        edgeRatio: {
          left: `${denominator}`,
          right: `${numerator}`
        },
      };
    } else if ( isCollinear && foundVertexIndex == -1 ){
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

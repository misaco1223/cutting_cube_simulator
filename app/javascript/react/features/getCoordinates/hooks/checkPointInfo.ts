import * as THREE from "three";
import { edges, edgeLabels, vertices, vertexLabels, PointInfo, midpoints} from "../types/ThreeScene";
import { gcd }  from "./gcd";
import { isPointOnEdge } from "./isPointOnEdge"

export const checkPointInfo = (point: THREE.Vector3): PointInfo => {
  const vTolerance = 0.25;

  for (let i = 0; i < edges.length; i++) {

    const foundVertexIndex = vertices.findIndex(
      (vertex) =>
      Math.abs(vertex.x - point.x) < vTolerance &&
      Math.abs(vertex.y - point.y) < vTolerance &&
      Math.abs(vertex.z - point.z) < vTolerance
    );

    const foundMidpointIndex = midpoints.findIndex(
      (midpoint) =>
      Math.abs(midpoint.x - point.x) < vTolerance &&
      Math.abs(midpoint.y - point.y) < vTolerance &&
      Math.abs(midpoint.z - point.z) < vTolerance
    );

    const { isCollinear, t } = isPointOnEdge(point, edges[i]);

    // tの調整
    const denominator = t;  // startから点まで
    const numerator = 1 - t; 
    
    if (foundVertexIndex !== -1) {
      return {
        point: vertices[foundVertexIndex],
        isVertex: true,
        vertexLabel: vertexLabels[foundVertexIndex],
        isMidpoint: false,
        edgeLabel: edgeLabels[i],
        edgeRatio: {
          left: `${denominator}`,
          right: `${numerator}`
        },
      };
    } else if ( foundMidpointIndex !== -1 ){
      return { 
        point: midpoints[foundMidpointIndex],
        isVertex: false,
        vertexLabel:undefined,
        isMidpoint: true,
        edgeLabel: edgeLabels[foundMidpointIndex],
        edgeRatio: {
          left: "1",
          right: "1"
        }
      }
    } else if ( isCollinear && foundVertexIndex == -1 ){
        const divisor = gcd(Math.round(numerator * 1000), Math.round(denominator * 1000));
        
        const simplifiedDenominator = Math.round(denominator * 1000) / divisor;
        const simplifiedNumerator = Math.round(numerator * 1000) / divisor;

        return { 
          point,
          isVertex: false,
          vertexLabel: undefined,
          isMidpoint: false,
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
    isMidpoint: true,
    edgeLabel: "",
    edgeRatio: {
        left: ``,
        right: ``
      }
  };
};

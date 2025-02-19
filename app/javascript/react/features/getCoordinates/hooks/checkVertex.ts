import * as THREE from "three";
import { vertices, vertexLabels } from "../types/ThreeScene";
import { checkEdge } from "./checkEdge";
import { PointInfo } from "../types/ThreeScene";

export const checkVertex = (point: THREE.Vector3): PointInfo => {
  const tolerance = 0.1;
  
  const foundIndex = vertices.findIndex(
    (vertex) =>
    Math.abs(vertex.x - point.x) < tolerance &&
    Math.abs(vertex.y - point.y) < tolerance &&
    Math.abs(vertex.z - point.z) < tolerance
  );
  
  if (foundIndex !== -1) {
    return {
      point: vertices[foundIndex],
      isVertex: true,
      vertexLabel: vertexLabels[foundIndex],
      edgeLabel: undefined,
      edgeRatio: undefined
    };
  } else {
    const {edgeLabel, edgeRatio} = checkEdge(point);
    return {
      point,
      isVertex: false,
      vertexLabel: undefined,
      edgeLabel: edgeLabel,
      edgeRatio: edgeRatio
    };
  }
};

import { useState,useCallback } from "react";
import * as THREE from "three";
import { vertices, labels, PointInfo } from "../types/ThreeScene";

export const useCheckVertex = () => {
  const [pointsInfo, setPointsInfo] = useState<PointInfo[]>([]);

  const checkVertex = useCallback((points: THREE.Vector3[]) => {
    const tolerance = 0.1;
    const updatedPointsInfo = points.map((point) =>{
      const foundIndex = vertices.findIndex(
        (vertex) =>
          Math.abs(vertex.x - point.x) < tolerance &&
          Math.abs(vertex.y - point.y) < tolerance &&
          Math.abs(vertex.z - point.z) < tolerance
      );

      if (foundIndex !== -1){
        return{
          point: vertices[foundIndex],
          isVertex: true,
          vertexLabel: labels[foundIndex]
        };
      }else{
        return{
          point,
          isVertex: false,
          vertexLabel: ''
        };
      }
    });

    setPointsInfo(updatedPointsInfo);
  },[]);

  return { pointsInfo, checkVertex };
}


import { useState, useCallback } from "react";
import * as THREE from "three";
import { checkVertex } from "./checkVertex";
import { PointInfo } from "../types/ThreeScene";

export const useCheckPointsInfo = () => {
  const [pointsInfo, setPointsInfo] = useState<PointInfo[]>([]);

  const handleCheckPointInfo = useCallback((points: THREE.Vector3[]) => {
    const updatedPointsInfo = points.map((point) => {
      const pointInfo = checkVertex(point);
      return {
        point: pointInfo.point,
        isVertex: pointInfo.isVertex,
        edgeLabel: pointInfo.edgeLabel,
        edgeRatio: pointInfo.edgeRatio,
        vertexLabel: pointInfo.vertexLabel,
      };
    });
    setPointsInfo(updatedPointsInfo);
  }, []);

  return { pointsInfo, checkPointInfo: handleCheckPointInfo };
};

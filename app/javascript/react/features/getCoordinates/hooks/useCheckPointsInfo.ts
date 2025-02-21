import { useState, useCallback } from "react";
import * as THREE from "three";
import { checkPointInfo } from "./checkPointInfo";
import { PointInfo } from "../types/ThreeScene";

export const useCheckPointsInfo = () => {
  const [pointsInfo, setPointsInfo] = useState<PointInfo[]>([]);

  const handleCheckPointInfo = useCallback((points: THREE.Vector3[]) => {
    const updatedPointsInfo = points.map((point) => {
      const pointInfo = checkPointInfo(point);
      return {
        point: pointInfo.point,
        isVertex: pointInfo.isVertex,
        vertexLabel: pointInfo.vertexLabel,
        edgeLabel: pointInfo.edgeLabel,
        edgeRatio: pointInfo.edgeRatio,
      };
    });
    setPointsInfo(updatedPointsInfo);
  }, []);

  return { pointsInfo, checkPointInfo: handleCheckPointInfo };
};

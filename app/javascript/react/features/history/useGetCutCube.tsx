import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetCutCube = () => {
  const [glbUrls, setGlbUrls] = useState<string[]>([]);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[][]>([]);
  const [title, setTitle] = useState<string[]>([]);
  const [memo, setMemo] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);

  const fetchCutCube = async () => {
    try {
      const response = await fetch(`/api/cut_cube`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.cut_cube) {
        setGlbUrls(data.cut_cube.glb_urls);

        const transformedPoints = data.cut_cube.cut_points.map((points: number[][]) => {
          return points.map((point: number[]) => 
            new THREE.Vector3(point[0], point[2], -point[1]));
        });
        setCutPoints(transformedPoints);

        setTitle(data.cut_cube.title);
        setMemo(data.cut_cube.memo);
        setCreatedAt(data.cut_cube.created_at);
      }
    } catch (error) {
      console.error("cut_cubeの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchCutCube();  
  }, []);

  return { glbUrls, cutPoints, createdAt, title, memo};
};

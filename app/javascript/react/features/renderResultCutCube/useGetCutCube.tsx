import { useState, useEffect } from "react";
import * as THREE from "three"

export const useGetCutCube = (id: string | undefined) => {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[] | null>(null);

  useEffect(() => {
    const fetchCutCube = async (id: string | undefined) => {
      if (!id) return;
      try {
        const response = await fetch(`/api/cut_cube/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("通信に失敗しました");

        const data = await response.json();
        if (data.glb_url) {
          setGlbUrl(data.glb_url);
        }
        if (data.cut_points) {
          const transformedPoints = data.cut_points.map((point: number[]) => {
            return new THREE.Vector3(
              point[0],
              point[2],
              -point[1]
            );
          });
          setCutPoints(transformedPoints); // cutPointsに格納
        }
      } catch (error) {
        console.error("cut_cubeの取得に失敗しました", error);
      }
    };

    fetchCutCube(id);
  }, [id]);

  return { glbUrl, cutPoints };
};

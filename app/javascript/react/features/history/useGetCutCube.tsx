import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetCutCube = () => {
  const [cutCubeIds, setCutCubeIds] = useState<string[]>([]);
  const [glbUrls, setGlbUrls] = useState<string[]>([]);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[][]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [memos, setMemos] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);
  const [isStorageUser, setIsStorageUser] = useState(false);

  const loadHistoryFromStorage = () => {
    const storedCutCubes = JSON.parse(localStorage.getItem("cutCube") || "[]");
    console.log("storedCutCubesの個数は", storedCutCubes.length)
    if (storedCutCubes.length > 0) {
      storedCutCubes.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt));

      setCutCubeIds(storedCutCubes.map((cutCube: any) => String(cutCube.id)));
      setGlbUrls(storedCutCubes.map((cutCube: any) => cutCube.glbUrl));

      const transformedPoints = storedCutCubes.map((cutCube: any) =>
        cutCube.cutPoints.map((point: number[]) => new THREE.Vector3(point[0], point[2], -point[1]))
      );
      setCutPoints(transformedPoints);

      setTitles(storedCutCubes.map((cutCube: any) => cutCube.title));
      setMemos(storedCutCubes.map((cutCube: any) => cutCube.memo));
      setCreatedAt(storedCutCubes.map((cutCube: any) => cutCube.createdAt));
    }
  };

  const fetchCutCube = async () => {
    try {
      const response = await fetch(`/api/cut_cube`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.cut_cubes) {
        setCutCubeIds(data.cut_cubes.ids);
        setGlbUrls(data.cut_cubes.glb_urls);

        const transformedPoints = data.cut_cubes.cut_points.map((points: number[][]) => {
          return points.map((point: number[]) => 
            new THREE.Vector3(point[0], point[2], -point[1]));
        });
        setCutPoints(transformedPoints);

        setTitles(data.cut_cubes.titles);
        setMemos(data.cut_cubes.memos);
        setCreatedAt(data.cut_cubes.created_at);
      } else {
        console.log("データなし");
      }
    } catch (error) {
      console.error("cut_cubeの取得に失敗しました", error);
      loadHistoryFromStorage();
      setIsStorageUser(true);
    }
  };

  useEffect(() => {
    fetchCutCube();  
  }, []);

  return { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos, isStorageUser};
};

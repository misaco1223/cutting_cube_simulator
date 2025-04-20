import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetCutCube = (id: string|undefined) => {
  const [glbUrl, setGlbUrl] = useState<string|null>(null);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[] | null>(null);
  const [title, setTitle] = useState<string|null>(null);
  const [memo, setMemo] = useState<string|null>(null);
  const [createdAt, setCreatedAt] = useState<string|null>(null);
  const [bookmarkId, setBookmarkId] = useState<string|null>(null);

  useEffect(() => {
    const fetchCutCube = async (id: string | undefined) => {
      if (!id) return;
      try {
        const response = await fetch(`/api/cut_cubes/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("通信に失敗しました");

        const data = await response.json();
        if (data.cut_cube) {
          setGlbUrl(data.cut_cube.glb_url);
          const transformedPoints = data.cut_cube.cut_points.map((point: number[]) => {
            return new THREE.Vector3(
              point[0],
              point[2],
              -point[1]
            );
          });
          setCutPoints(transformedPoints);
          setTitle(data.cut_cube.title);
          setMemo(data.cut_cube.memo);
          setCreatedAt(data.cut_cube.created_at);
          setBookmarkId(data.bookmark_id);
        }
      } catch (error) {
        // console.error("cut_cubeの取得に失敗しました", error);
      }
    };

    fetchCutCube(id);
  }, [id]);

  return { glbUrl, cutPoints, title, memo, createdAt, bookmarkId, setBookmarkId};
};

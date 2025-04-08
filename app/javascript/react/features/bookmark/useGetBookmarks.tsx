import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetBookmarks = () => {
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [cutCubeIds, setCutCubeIds] = useState<string[]>([]);
  const [glbUrls, setGlbUrls] = useState<string[]>([]);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[][]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [memos, setMemos] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);

  const fetchCutCube = async () => {
    try {
      const response = await fetch(`/api/bookmarks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.bookmarks) {
        console.log("bookmarkデータは,", data.bookmarks);
        setBookmarkIds(data.bookmarks.bookmark_ids);
        setCutCubeIds(data.bookmarks.cut_cube_ids);
        setGlbUrls(data.bookmarks.glb_urls);

        const transformedPoints = data.bookmarks.cut_points.map((points: number[][]) => {
          return points.map((point: number[]) => 
            new THREE.Vector3(point[0], point[2], -point[1]));
        });
        setCutPoints(transformedPoints);

        setTitles(data.bookmarks.titles);
        setMemos(data.bookmarks.memos);
        setCreatedAt(data.bookmarks.created_at);
      } else {
        console.log("データなし");
      }
    } catch (error) {
      console.error("bookmarkの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchCutCube();  
  }, []);

  return { bookmarkIds, cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos};
};
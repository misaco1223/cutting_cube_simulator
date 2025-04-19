import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetMyBoards = () => {
  const [boardIds, setBoardIds] = useState<string[]>([]);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[][]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);
  const [published, setPublished] = useState<boolean[]>([]);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [tags, setTags] = useState<string[][]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const fetchMyBoards = async () => {
    try {
      const response = await fetch(`/api/boards/my_boards_index`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.boards) {
        console.log("データは,", data.boards);
        setBoardIds(data.boards.board_ids);

        const transformedPoints = data.boards.cut_points.map((points: number[][]) => {
          return points.map((point: number[]) => 
            new THREE.Vector3(point[0], point[2], -point[1]));
        });
        setCutPoints(transformedPoints);

        setQuestions(data.boards.questions);
        setCreatedAt(data.boards.created_at);
        setPublished(data.boards.published);
        setTags(data.boards.tags);
        setLikeCounts(data.boards.like_counts);
        setIsLoaded(true);
      } else {
        console.log("データなし");
      }
    } catch (error) {
      console.error("cut_cubeの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchMyBoards();  
  }, []);

  return { boardIds, cutPoints, createdAt, questions, published, setPublished, tags, isLoaded, likeCounts};
};
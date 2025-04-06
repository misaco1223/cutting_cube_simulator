import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetBoards = (filter: string | null) => {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [boardIds, setBoardIds] = useState<string[]>([]);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[][]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [createdAt, setCreatedAt] = useState<string[]>([]);
  const [tags, setTags] = useState<string[][]|null>(null);

  const getTagIdFromFilter = (filter: string | null): number | null => {
    switch (filter) {
      case "基礎":
        return 1;
      case "応用":
        return 2;
      case "5年":
        return 3;
      case "6年前期":
        return 4;
      case "6年後期":
        return 5;
      default:
        return null;
    }
  };

  const fetchBoards = async (filter:string | null) => {
    const tagId = getTagIdFromFilter(filter);

    let url = `/api/boards`
    if (tagId) {
      url = `/api/boards?tag_id=${tagId}`;
    } else if (filter === "タグ別") {
      url = `/api/boards?filter=tag`;
    } else if (filter === "人気順") {
      url = `/api/boards?filter=popular`;
    } else if (filter === "いいね") {
      url = `/api/boards?filter=like`;
    } else if ( filter === "お気に入り"){
      url = `/api/boards?filter=favorite`;
    };

    try {
      const response = await fetch( url , {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.boards) {
        console.log("データは,", data.boards);
        setUserNames(data.boards.user_names);
        setBoardIds(data.boards.board_ids);

        const transformedPoints = data.boards.cut_points.map((points: number[][]) => {
          return points.map((point: number[]) => 
            new THREE.Vector3(point[0], point[2], -point[1]));
        });
        setCutPoints(transformedPoints);
      
        setQuestions(data.boards.questions);
        setCreatedAt(data.boards.created_at);
        setTags(data.boards.tags);
      } else {
        console.log("データなし");
      }
    } catch (error) {
      console.error("cut_cubeの取得に失敗しました", error);
    }
  };

  useEffect(() => {
    fetchBoards(filter);  
  }, [filter]);

  return { userNames, boardIds, cutPoints, createdAt, questions, tags };
};
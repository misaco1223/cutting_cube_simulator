import { useState, useEffect } from "react";
import * as THREE from "three";

export const useGetBoard = (id: string|undefined) => {
  const [userName, setUserName] = useState<string|null>(null);
  const [glbUrl, setGlbUrl] = useState<string|null>(null);
  const [cutPoints, setCutPoints] = useState<THREE.Vector3[] | null>(null);
  const [question, setQuestion] = useState<string|null>(null);
  const [answer, setAnswer] = useState<string|null>(null);
  const [explanation, setExplanation] = useState<string|null>(null);
  const [createdAt, setCreatedAt] = useState<string|null>(null);
  const [isOwner, setIsOwner] = useState<string|null>(null);
  const [published, setPublished] = useState<boolean>(false);

  useEffect(() => {
    const fetchBoard = async (id: string | undefined) => {
      if (!id) return;
      try {
        const response = await fetch(`/api/boards/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("通信に失敗しました");

        const data = await response.json();
        if (data.board) {
          setUserName(data.board.user_name);
          setGlbUrl(data.board.glb_url);
          const transformedPoints = data.board.cut_points.map((point: number[]) => {
            return new THREE.Vector3(
              point[0],
              point[2],
              -point[1]
            );
          });
          setCutPoints(transformedPoints);
          setQuestion(data.board.question);
          setAnswer(data.board.answer);
          setExplanation(data.board.explanation);
          setCreatedAt(data.board.created_at);
          setIsOwner(data.board.is_owner);
          setPublished(data.board.published);
        }
      } catch (error) {
        console.error("boardの取得に失敗しました", error);
      }
    };

    fetchBoard(id);
  }, [id]);

  return { userName, glbUrl, cutPoints, question, answer, explanation, createdAt, isOwner, published, setPublished};
};

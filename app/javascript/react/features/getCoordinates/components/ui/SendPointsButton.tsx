import React, {useCallback, useState} from "react";
import * as THREE from "three";
import { SendPointsButtonProps, faces } from "../../types/ThreeScene"
import { isPointOnEdge } from "../../hooks/isPointOnEdge"
import { useNavigate } from "react-router-dom";

const SendPointsButton = ({ points }: SendPointsButtonProps)=> {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendPointsToRails = useCallback(async() => {
    setIsLoading(true);
    const cutPoints = {
      id: crypto.randomUUID(),
      points: points.map((point: THREE.Vector3) => [
      point.x,
      -point.z,
      point.y,
    ])};

    const csrfToken = document
    .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.getAttribute("content");

    if (!csrfToken) {
      console.error("CSRFトークンが取得できませんでした");
      return;
    }

    try {
      const response = await fetch("/api/cut_cube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "credentials": "include",
        },
        body: JSON.stringify(cutPoints),
      });

      if (!response.ok) throw new Error("切断点の送信に失敗しました");

      const data = await response.json();
      console.log("切断点が送信されました:", data);
      setIsLoading(false);

      const cut_cube_id = data.cut_cube.id;
      const newCutCube = {
        id: cut_cube_id,
        glbUrl: data.cut_cube.glb_url,
        cutPoints: data.cut_cube.cut_points,
        title: data.cut_cube.title,
        memo: data.cut_cube.memo,
        createdAt: data.cut_cube.created_at,
      };
      try {
        const storedCutCubes = JSON.parse(localStorage.getItem("cutCube") || "[]");
        if (!storedCutCubes.some((cutCube: any) => cutCube.id === cut_cube_id)) {
          storedCutCubes.push(newCutCube);
          localStorage.setItem("cutCube", JSON.stringify(storedCutCubes));
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "QuotaExceededError") {
          console.error("LocalStorageの容量がオーバーしました");
        }
      }
      if (cut_cube_id) { navigate(`/result/${cut_cube_id}`); }
    } catch (error) {
      console.error("送信エラー:", error);
      setIsLoading(false); 
    }
  }, [points]);

  if (points.length < 3 )
    return <div className="ml-4 font-bold">切断点を3つ選択してください</div>;

  if (points.length > 3 )
    return <div className="text-red-500 font-bold ml-4">切断点は3つに絞ってください</div>;

  const isOnSameFace = faces.some((face) => {
    return points.every((point) =>
      face.some((edge) => {
        const { isCollinear } = isPointOnEdge(point, edge);
        return isCollinear;  // 点が辺上にあればtrueを返す
      })
    );
  });

  if (points.length === 3 && isOnSameFace)
    return <div className="text-red-500 font-bold ml-4">同じ面上の3点では切断できません</div>;

  return (
    <div>
      {isLoading ? (
        <p>切断中... しばらくお待ちください。</p>
      ) : (
        <button
          onClick={sendPointsToRails}
          className="relative overflow-hidden bg-gradient-to-b from-green-300 to-green-600 font-bold rounded-lg mt-2 ml-4 py-2 px-4 shadow-lg hover:from-green-300 hover:to-green-500 active:shadow-inner"
        >
          3点で切断する
          {/* 擬似的な光沢エフェクト */}
          <span className="absolute inset-0 bg-white opacity-20 mix-blend-overlay rounded-lg"></span>
        </button>
      )}
    </div>
  );
}

export default SendPointsButton;
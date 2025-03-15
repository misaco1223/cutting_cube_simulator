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
      point.y,
      point.z
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
      const cut_cube_id = JSON.parse(data.cut_cube_id);
      console.log("cut_cube_idは", cut_cube_id);
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
          className="button bg-green-700 bold text-white rounded mt-2 ml-4 py-2 px-4 hover:bg-green-700"
        >
          3点で切断する
        </button>
      )}
    </div>
  );
}

export default SendPointsButton;
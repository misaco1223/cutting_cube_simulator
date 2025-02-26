import React, {useCallback} from "react";
import * as THREE from "three";
import { SendPointsButtonProps, faces } from "../../types/ThreeScene"
import { isPointOnEdge } from "../../hooks/isPointOnEdge"

const SendPointsButton = ({ points }: SendPointsButtonProps)=> {

  if (points.length < 3 )
    return <div className="ml-4 font-bold">切断点を3つ選択してください</div>;

  if (points.length > 3 )
   return <div className="text-red-500 font-bold ml-4"> 切断点は3つに絞ってください</div>;
  
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
    

  const sendPointsToRails = useCallback(() => {

    const cutPoints = points.map((point: THREE.Vector3) => [
      point.x,
      point.y,
      point.z
    ]);
    console.log('送信する点は', points);

    const csrfToken = document
    .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
    ?.getAttribute("content");

    if (!csrfToken) {
      console.error("CSRFトークンが取得できませんでした");
      return;
    }

    fetch("/cut_points", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ cutPoints }),
    })
    .then((response) => {
      if (!response.ok) throw new Error("切断点の送信に失敗しました");
      return response.json();
    })
    .then((data) => {
      console.log("切断点が送信されました:", data);
    })
    .catch((error) => {
      console.error("送信エラー:", error);
    });
  }, [points]);

  return (
    <button 
      onClick={sendPointsToRails}
      className="button bg-green-700 bold text-white rounded mt-2 ml-4 py-2 px-4 hover:bg-green-700"
    >
      3点で切断する
    </button>
  );
}

export default SendPointsButton;
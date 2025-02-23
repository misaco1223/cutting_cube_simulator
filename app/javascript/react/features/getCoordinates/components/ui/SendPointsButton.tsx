import React, {useCallback} from "react";
import * as THREE from "three";
import { SendPointsButtonProps } from "../../types/ThreeScene"

const SendPointsButton = ({ points }: SendPointsButtonProps)=> {

  if (points.length < 3 )
    return <div className="ml-4 font-bold">切断点を3つ選択してください</div>;

  if (points.length > 3 )
   return <div className="text-red-500 ml-4"> "切断点は3つに絞ってください"</div>;

  const sendPointsToRails = useCallback(() => {
    console.log('送信する点は', points);

    const cutPoints = points.map((point: THREE.Vector3) => ({
      x: point.x,
      y: point.y,
      z: point.z
    }));

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
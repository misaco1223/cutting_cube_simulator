import React, {useCallback, useState} from "react";
import * as THREE from "three";
import { SendPointsButtonProps, faces } from "../../types/ThreeScene"
import { isPointOnEdge } from "../../hooks/isPointOnEdge"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const SendPointsButton = ({ points, isCollect }: SendPointsButtonProps)=> {
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
      const response = await fetch("/api/cut_cubes", {
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
      
          // localStorageの長さが5を超えていた場合、一番古いものを削除
          if (storedCutCubes.length > 5) {
            storedCutCubes.shift(); // 配列の最初の要素（最も古いデータ）を削除
          }
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

  const isOnSameFace = faces.some((face) => {
    return points.every((point) =>
      face.some((edge) => {
        const { isCollinear } = isPointOnEdge(point, edge);
        return isCollinear;  // 点が辺上にあればtrueを返す
      })
    );
  });

  return (
    <div>
      { points.length < 3 && <div className="font-bold">立方体から切断点を3つ選択してください</div> }
      { points.length > 3 && <div className="text-red-500">切断点は3つに絞ってください</div> }
      { points.length === 3 && isOnSameFace &&  <div className="ml-4 text-red-500">同じ面上の3点では切断できません</div>}
      { !isLoading && points.length === 3 && !isOnSameFace && (
        Object.values(isCollect).every((item) => item === true)
        ? ( <button 
              onClick={sendPointsToRails}
              className="bg-gray-800 hover:bg-red-500 text-white rounded px-6 py-2">
              3点で切断する
            </button>)
        : ( <div className="text-red-500">切断点を更新して最新の状態にしてください</div>
      ))}
      { isLoading && 
        <div className="flex space-x-4">
          <p>切断中... しばらくお待ちください。(最大15秒)</p>
          <FontAwesomeIcon icon={faSpinner} className="my-auto animate-spin text-blue-500" />
        </div>
      }
    </div>
  );
}

export default SendPointsButton;
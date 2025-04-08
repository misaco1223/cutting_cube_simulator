import { useEffect, useState } from "react";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faBookmark} from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../getCoordinates/hooks/useCheckPointsInfo"
import { useAuth } from "../../contexts/AuthContext"

const ResultCutCube = ({ id }: { id: string}) => {
  const { glbUrl, cutPoints, title, memo, createdAt, bookmarkId, setBookmarkId } = useGetCutCube(id);
  console.log("bookmarkIdは", bookmarkId);
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const { isLoggedIn } = useAuth();

  // 編集用の状態
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || "No Title");
  const [currentMemo, setCurrentMemo] = useState(memo || "No Memo");

  useEffect(() => {
    setCurrentTitle(title || "No Title");
    setCurrentMemo(memo || "No Memo");
  }, [title, memo]);

  useEffect(() => {
    if (!cutPoints) return;
    checkPointInfo(cutPoints);
  },[cutPoints]);

  if (!glbUrl || !cutPoints) return null;

  const tabLabels: Record<"all" | "geometry1" | "geometry2", string> = {
    all: "全体",
    geometry1: "緑の立体",
    geometry2: "青の立体",
  };

  const formattedDate = createdAt ? new Date(createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
    hour12: false,
  }).replace(/\//g, "-")
  : "";

  const handleCutCubeUpdate = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/cut_cubes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTitle, memo: currentMemo }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const storedCutCubes = JSON.parse(localStorage.getItem("cutCube") || "[]");
      const updatedCutCubes = storedCutCubes.map((cutCube: any) => {
        console.log("typeof cutCube.id:", typeof cutCube.id, "value:", cutCube.id); //出力 number
        console.log("typeof id:", typeof id, "value:", id);
        if (String(cutCube.id) === id) {
          return { ...cutCube, title: currentTitle, memo: currentMemo };
        }
        return cutCube;
      });
      localStorage.setItem("cutCube", JSON.stringify(updatedCutCubes));

    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  const handleCreateBookmark = async(id: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cut_cube_id: id})
      });
      const data = await response.json();
      setBookmarkId(data.bookmark_id);
      console.log("ブックマークを作成しました")
    } catch (error) {
      console.log(error);
    }
  }

  const handleRemoveBookmark = async(bookmarkId: string) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      setBookmarkId(null);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {/* タイトル・メモ編集エリア */}
      <div className="mt-4 mb-2 items-center space-y-4">
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                handleCutCubeUpdate();
              }}
              autoFocus
              className="text-2xl font-bold border-b border-gray-100 focus:outline-none focus:border-red-500"
            />
          ) : (
            <h1
              className="text-2xl font-bold cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {currentTitle}
            </h1>
          )}
          <FontAwesomeIcon
            icon={faPencil}
            size="xs"
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          />
        </div>

        <div className="flex items-center px-1 mt-2 space-x-2">
          {isEditingMemo ? (
            <textarea
              value={currentMemo}
              onChange={(e) => setCurrentMemo(e.target.value)}
              onBlur={() => {
                setIsEditingMemo(false);
                handleCutCubeUpdate();
              }}
              autoFocus
              className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500 w-full"
            />
          ) : (
            <p
              className="text-sm cursor-pointer"
              onClick={() => setIsEditingMemo(true)}
            >
              {currentMemo}
            </p>
          )}
          <FontAwesomeIcon
            icon={faPencil}
            size="xs"
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditingMemo(true)}
          />
        </div>
      </div>

      {/* 日付 */}
      <div className="mr-2 flex items-center space-x-2 justify-end">
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      {/*ボタン*/}
      <div className="mt-4 mb-2 flex space-x-4 justify-end"  role="tablist">
        {/*ブックマークボタン*/}
        {isLoggedIn && id && (
          !bookmarkId
          ? ( <button 
                onClick={() => handleCreateBookmark(id)} 
              >
                <span className="text-xs text-gray-600 mr-2">コレクションに追加</span>
                <FontAwesomeIcon icon={faBookmark} className="hover:text-yellow-500"/>
              </button>)
          : ( <button
                onClick={() => handleRemoveBookmark(bookmarkId)} 
              >
                <span className="text-xs text-gray-600 mr-2">コレクションから削除</span>
                <FontAwesomeIcon icon={faBookmark} className="text-yellow-500 hover:text-yellow-100" />
              </button>)
        )}
        {/* 切り替えボタン */}
        <div>
          {(["all", "geometry1", "geometry2"] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              className={`px-2 py-2 border-b-2 text-sm ${
                selectedGeometry === tab ? "border-blue-500 font-semibold" : ""
              }`}
              onClick={() => setSelectedGeometry(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
      </div>
  
      {/* 3Dモデル表示 */}
      <div>
        <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry}/>
      </div>

      {/* 座標表示 */}
      <div className="mt-4">
        {pointsInfo.map((pointInfo, index) => (
          <div key={index} className="w-full p-2 mb-2 rounded-sm border">
            <h3 className="w-full text-sm mb-2">切断点 {index + 1}</h3>
            <div className="w-full flex space-x-2 justify-between">
              <div className="w-full flex justify-start space-x-2 ">
                {pointInfo.isVertex
                ? ( <span className="font-semibold w-16 my-auto">頂点 {pointInfo.vertexLabel}</span> )
                : ( <>
                      <span className="font-semibold w-16 flex my-auto">辺 {pointInfo.edgeLabel}</span>
                      <div className="flex w-full">
                        <span className="my-auto">比</span>
                        <span className="text-sm border p-1 rounded w-20 mx-2 text-center">{pointInfo.edgeRatio.left}</span>
                        <span> : </span>
                        <span className="text-sm border p-1 rounded w-20 mx-2 text-center">{pointInfo.edgeRatio.right}</span>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultCutCube;

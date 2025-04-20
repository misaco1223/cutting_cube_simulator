import { useEffect, useState } from "react";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faBookmark, faPlus} from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../getCoordinates/hooks/useCheckPointsInfo";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const ResultCutCube = ({ id }: { id: string}) => {
  const { glbUrl, cutPoints, title, memo, createdAt, bookmarkId, setBookmarkId } = useGetCutCube(id);
  // console.log("bookmarkIdは", bookmarkId);
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const { isLoggedIn } = useAuth();
  const [ isOrbit, setIsOrbit ] = useState(true);

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
        // console.log("typeof cutCube.id:", typeof cutCube.id, "value:", cutCube.id); //出力 number
        // console.log("typeof id:", typeof id, "value:", id);
        if (String(cutCube.id) === id) {
          return { ...cutCube, title: currentTitle, memo: currentMemo };
        }
        return cutCube;
      });
      localStorage.setItem("cutCube", JSON.stringify(updatedCutCubes));

    } catch (error) {
      // console.error("更新エラー:", error);
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
      // console.log("ブックマークを作成しました")
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
    }
  }

  return (
    <div className="m-4 lg:w-3/4 mx-auto">
      {/* タイトル・メモ編集エリア */}
      <div className="p-2 mt-4 mb-2 items-center space-y-4">
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
              className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500 w-full whitespace-pre-line"
            />
          ) : (
            <p
              className="text-sm cursor-pointer whitespace-pre-line"
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
      <div className="flex justify-between"  role="tablist">
        {/*ブックマークボタン*/}
        <div className="flex justify-start space-x-6 px-4 py-2 items-end">
        {isLoggedIn && id && (
          <div className="relative group">
          <button onClick={() => (
            bookmarkId ? handleRemoveBookmark(bookmarkId) : handleCreateBookmark(id)
          )}>
            <FontAwesomeIcon 
              icon={faBookmark} 
              className={bookmarkId ? "text-yellow-500 hover:text-yellow-100" : "hover:text-yellow-500"} 
            />
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            {bookmarkId ? "コレクションをはずす" : "コレクションに追加"}
          </div>
        </div>
        )}
        {/*問題を作成する*/}
        {isLoggedIn && (
          <div className="relative group">
            <Link to={`/board/new?id=${id}`}>
              <FontAwesomeIcon icon={faPlus} className="text-red-600" />
            </Link>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              問題を作成する
            </div>
          </div>
        )}
        </div>

        {/* 切り替えボタン */}
        <div className="flex justify-end mt-4 mb-2">
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

      {/* 回転モード切り替えボタン
      <div className="flex justify-end">
      {isOrbit ? (
        <button onClick={()=> setIsOrbit(false)} className="flex mb-4 border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 回転モード中</span>
          <FontAwesomeIcon icon={faHand} className="mx-auto"/>
        </button>
      ):(
        <button onClick={()=> setIsOrbit(true)} className="flex mb-4 border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 固定モード中</span>
          <FontAwesomeIcon icon={faPause} className="mx-auto"/>
        </button>
      )}
      </div> */}
  
      {/* 3Dモデル表示 */}
      <div className={`h-[300px] ${isOrbit ? "cursor-grab" : ""}`}>
        <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry} isOrbit={isOrbit}/>
      </div>

      <div className="lg:flex lg:space-x-4 gap-2 mt-6 mb-2 mx-auto">
        {/* 座標表示 */}
        <div className="lg:w-1/2 border p-4">
          <h1>------ 切断点 ------</h1>
          {pointsInfo.map((pointInfo, index) => (
            <div key={index} className="w-full">
              {pointInfo.isVertex
              ? ( <div className="w-full flex space-x-1">
                    <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                    <span className="p-1 my-auto">頂点 {pointInfo.vertexLabel}</span>
                  </div>
              ):( <div className="w-full flex space-x-1">
                    <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                    <span className="p-1 my-auto">辺 {pointInfo.edgeLabel}</span>
                    <span className="text-sm my-auto rounded text-center">{pointInfo.edgeRatio.left}</span>
                    <span className="my-auto"> : </span>
                    <span className="text-sm my-auto rounded text-center">{pointInfo.edgeRatio.right}</span>
                  </div>
              )}
            </div>
          ))}
        </div>

        {/*体積比*/}
        <div className="lg:w-1/2 border p-4">
          <h1>------ 体積比 ------</h1>
          <span>準備中...</span>
        </div>
      </div>
    </div>
  );
};

export default ResultCutCube;

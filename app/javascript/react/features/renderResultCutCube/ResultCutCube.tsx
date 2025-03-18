import { useEffect, useState } from "react";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const ResultCutCube = ({ id }: { id: string | undefined }) => {
  const { glbUrl, cutPoints, title, memo, createdAt } = useGetCutCube(id);
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");

  // 編集用の状態
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title || "No Title");
  const [currentMemo, setCurrentMemo] = useState(memo || "No Memo");

  useEffect(() => {
    setCurrentTitle(title || "No Title");
    setCurrentMemo(memo || "No Memo");
  }, [title, memo]);

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
      const response = await fetch(`/api/cut_cube/${id}`, {
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

        <div className="flex items-center px-4 mt-4 space-x-2">
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

      {/* 切り替えボタン */}
      <div className="mt-4 mb-2 flex justify-end"  role="tablist">
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

      {/* 3Dモデル表示 */}
      <div>
        <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry}/>
      </div>
    </div>
  );
};

export default ResultCutCube;

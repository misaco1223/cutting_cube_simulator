import { useEffect, useState } from "react";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faBookmark, faPlus, faCaretDown, faXmark, faCircleRight} from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../getCoordinates/hooks/useCheckPointsInfo";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import CutFaceFlowChart from "./CutFaceFlowChart";
import { motion } from "framer-motion";
import toIntegerRatio from "./useToIntegerRatio";
import approximateFraction from "./useApproximateFraction";

const ResultCutCube = ({ id }: { id: string}) => {
  const { glbUrl, cutPoints, title, memo, createdAt, bookmarkId, setBookmarkId, cutFaceName, setCutFaceName, volumeRatio, edgeLength, setEdgeLength  } = useGetCutCube(id);
  // console.log("bookmarkIdは", bookmarkId);
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const { isLoggedIn } = useAuth();
  const [ isOrbit, setIsOrbit ] = useState(true);
  const [ isFaceDropOpen, setIsFaceDropOpen ] = useState(false);
  const [ isFaceFlowOpen, setIsFaceFlowOpen ] = useState(false);
  const faceNameTags = ["三角形", "正三角形", "二等辺三角形", "四角形", "ひし形", "正方形", "長方形", "平行四辺形", "台形", "等脚台形", "五角形", "六角形", "正六角形"];
  const [ integerRatio, setIntegerRatio ] = useState<string | null>(null);
  const [ volumes, setVolumes] = useState<[number,number][]|null>(null);

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
    if (!volumeRatio) return;
    const a = volumeRatio;
    const b = 1 - a;
    const [x, y] = toIntegerRatio(a, b);
    setIntegerRatio(`${x} : ${y}`);
  }, [volumeRatio]);

  useEffect(()=>{
    if (!edgeLength)return;
    handleCalculateVolumes(edgeLength);
    handleCutCubeUpdate();
  },[edgeLength])

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

  const handleCutCubeUpdate = async (faceName?: string) => {
    if (!id) return;
    if (faceName) {setCutFaceName(faceName)};

    try {
      const response = await fetch(`/api/cut_cubes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: currentTitle, memo: currentMemo, cut_face_name: faceName ?? cutFaceName, edge_length: edgeLength}),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

          const storedCutCubes = JSON.parse(localStorage.getItem("cutCube") || "[]");
      const updatedCutCubes = storedCutCubes.map((cutCube: any) => {
//         console.log("typeof cutCube.id:", typeof cutCube.id, "value:", cutCube.id); //出力 number
//         console.log("typeof id:", typeof id, "value:", id);
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

  const StyledFraction = ({ numerator, denominator }: { numerator: number; denominator: number }) => {
    if (denominator === 1) {
      return <span className="font-bold">{numerator}</span>;
    }

    const mixedNumber = Math.floor(numerator/ denominator);
    if (mixedNumber > 0) {
      const mixedNumerator = numerator % denominator;
      return (
        <div className="inline-flex">
        <span className="my-auto text-xs font-bold pr-1">{mixedNumber}</span>
        <span className="inline-flex flex-col items-center pb-2 text-xs font-bold">
          <span>{mixedNumerator}</span>
          <span className="w-full border-t border-black my-[1px]" />
          <span>{denominator}</span>
        </span>
        </div>
      );
    } else {
      return (
        <span className="inline-flex flex-col items-center pb-2 text-xs font-bold">
          <span>{numerator}</span>
          <span className="w-full border-t border-black my-[1px]" />
          <span>{denominator}</span>
        </span>
      );
    };
  };

  const handleCalculateVolumes = (length:number) => {
    if (!volumeRatio) return;
    const vol_1 = volumeRatio * (length **3);
    const vol_2 = length **3 - vol_1;
    // const round = (v: number) => Math.round(v * 1000) / 1000;
    // setVolumes([round(vol_1), round(vol_2)]);

    const [n1, d1] = approximateFraction(vol_1);
    const [n2, d2] = approximateFraction(vol_2);

    setVolumes([[n1, d1],[n2,d2]]);
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
              className="w-full text-2xl font-bold border-b border-gray-100 focus:outline-none focus:border-red-500"
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

      <div className="w-full grid md:grid-cols-3 md:gap-4 grid-cols-1 gap-2 mt-6 mb-2 mx-auto">
        {/* 座標表示エリア */}
        <div className="border p-4">
          <h1 className="font-semibold mb-2">切断点</h1>
          {pointsInfo.map((pointInfo, index) => (
            <div key={index} className="w-full text-gray-700">
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

        {/*切断面の形エリア*/}
        <div className="border p-4">
          <div className="relative group">
            <div className="flex space-x-4 my-auto">
              <h1 className="font-semibold">切断面の形</h1>
              <FontAwesomeIcon icon={faCircleRight} className="text-gray-500 cursor-pointer my-auto" onClick={()=>setIsFaceFlowOpen(!isFaceFlowOpen)}/>
            </div>
            <div className="absolute bottom-full z-40 left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              {isFaceFlowOpen ? "フローチャートを閉じる" : "切断面の形をフローチャートで決める"}
            </div>
          </div>
          {/*切断面の形フローチャート*/}
          { isFaceFlowOpen && (
            <motion.div drag className="absolute z-50 top-32 left-1/2 transform -translate-x-1/2 w-11/12 lg:w-1/3 md:w-1/2 bg-white border border-gray-300 shadow-xl rounded-md p-6 text-sm leading-relaxed">
              <span className="flex justify-between">
                <div className="text-gray-400 flex justify-start">切断面の形 フローチャート</div>
                <FontAwesomeIcon icon={faXmark} size="xl" onClick={()=>setIsFaceFlowOpen(false)} className="flex justify-end"/>
              </span>
              <div className="font-semibold mb-4">※ 切断面に対して真正面から見てください</div>
              <CutFaceFlowChart handleCutCubeUpdate={handleCutCubeUpdate} setIsFaceFlowOpen={setIsFaceFlowOpen}/>
            </motion.div>
            )
          }

          {/*現在の切断面の形*/}
          <div className="min-h-14 mt-2">
            <span className={`w-full px-4 py-1 ${cutFaceName ? "font-bold" : "text-sm font-medium text-gray-700" }`}>{cutFaceName? cutFaceName : "未設定"}</span>
          </div>
          {/* 切断面の形ドロップダウン */}
          <div className="relative w-full max-w-60 bg-gray-200 border border-gray-300 inline-block text-left">
            <div>
              <button
                type="button"
                onClick={() => setIsFaceDropOpen(!isFaceDropOpen)}
                className="inline-flex justify-between w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span className="justify-start">選択してください</span>
                <FontAwesomeIcon icon={faCaretDown} className={`ml-2 transition-transform ${isFaceDropOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <div className={`absolute right-0 w-full flex flex-col space-y-1 p-2 bg-white z-40 ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-40 ${isFaceDropOpen ? "" : "hidden"}`}>
              {/*タグから選択*/}
              {faceNameTags.map((faceTag, idx) => (
                <button
                  key={idx}
                  onClick={() => {handleCutCubeUpdate(faceTag); setIsFaceDropOpen(false);}}
                  className="w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {faceTag}
                </button>
              ))}

              {/* 手動入力欄 */}
              <div className="flex w-full items-center space-x-2 mt-2">
                <input
                  type="text"
                  onChange={(e) => setCutFaceName(e.target.value)}
                  className="min-w-0 flex-1 border p-1 text-center text-sm"
                />
                <button
                  onClick={()=> {handleCutCubeUpdate(); setIsFaceDropOpen(false);}}
                  className="min-w-0 text-sm px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 whitespace-nowrap"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*体積エリア*/}
        <div className="border p-4">
          <h1 className="font-semibold w-full">体積比</h1>
          <div className="mt-2">
          {integerRatio ?
            <>
            <span className="w-full min-h-14 px-4 py-1 font-bold mt-2">
              {integerRatio}<span className="text-sm px-4 font-medium text-gray-700">(緑:青)</span>
            </span>
            <div className="mt-4 text-gray-700">
              <span className="my-auto">立方体の1辺の長さを</span>
              <br/>
              <input
                type="number"
                value = {edgeLength || "未設定"}
                placeholder = "一辺の長さ"
                className="border text-center text-sm mx-auto rounded-sm p-1 w-24"
                onChange={(e) => setEdgeLength(Number(e.target.value))}
              />
              <span className="my-auto">cmとすると</span>
            </div>
            {/*体積表示*/}
            {volumes && volumes[0][0]!==0 && volumes[1][0]!==0 &&
            <div className="mt-4 text-gray-700">
              <h2>体積は</h2>
              <div className=" flex ml-4">
                <p className="my-auto mr-2">緑の立体・・・</p>
                <StyledFraction numerator={volumes[0][0]} denominator={volumes[0][1]}/>
                <span className="font-bold my-auto ml-2">㎤</span>
              </div>
              <div className="mt-2 flex ml-4">
                <p className="my-auto mr-2">青の立体・・・</p>
                <StyledFraction numerator={volumes[1][0]} denominator={volumes[1][1]} />
                <span className="font-bold my-auto ml-2">㎤</span>
              </div>
            </div>
            }
            </>
            : <span className="w-full px-4 py-1 text-sm font-medium text-gray-700">データがありません</span>
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCutCube;

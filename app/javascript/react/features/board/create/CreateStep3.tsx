import { useEffect, useState } from "react";
import BoardCubeModel from "./BoardCubeModel";
import CutCubeModel from "../../renderResultCutCube/CutCubeModel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faToggleOn, faToggleOff, faHand, faPause } from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

interface CreateStep3Props {
  cutCubeId: string | null;
  glbUrl: string | "";
  cutPoints: THREE.Vector3[] | [];
  question: string | "";
  answer: string | "";
  explanation: string | "";
  tags: string[];
  published: boolean;
  setPublished: (p: boolean) => void;
  onBack: () => void;
}

const CreateStep3 = ({ cutCubeId, glbUrl, cutPoints,question, answer, explanation, tags, published, setPublished, onBack }: CreateStep3Props) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const navigate = useNavigate();
  const [ isOrbitBoardCube, setIsOrbitBoardCube ] = useState(false);
  const [ isOrbitCutCube, setIsOrbitCutCube ] = useState(false);
  const [ isPointOpen, setIsPointOpen] = useState(false);

  const togglePoint = () => setIsPointOpen((prev)=> !prev);

  useEffect(() => {
    if (!cutPoints) return;
    checkPointInfo(cutPoints);
  },[cutPoints]);

  if (cutCubeId===null || glbUrl==="" || !cutPoints || question==="" || answer==="") return null;

  const tabLabels: Record<"all" | "geometry1" | "geometry2", string> = {
    all: "全体",
    geometry1: "緑の立体",
    geometry2: "青の立体",
  };

  const handleCreateBoard= async() => {
    const boardParams = {
      cut_cube_id: cutCubeId,
      question: replaceKeywords(question),
      answer: replaceKeywords(answer),
      explanation: replaceKeywords(explanation),
      published: published
    };

    try {
      const response = await fetch('/api/boards', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ board: boardParams, tags: tags }),
      });
        const data = await response.json();
        console.log("問題を作成しました");
        navigate("/mypage");
      } catch (error) {
        console.log(error);
      }
    }

    const formattedCutPoints = () => {
      if (!cutPoints) return [];
      const replaceCutPoints: string[] = [];
    
      pointsInfo.forEach((pointInfo) => {
        if (pointInfo.isVertex) {
          replaceCutPoints.push(`頂点${pointInfo.vertexLabel}`);
        } else {
          replaceCutPoints.push(
            `辺${pointInfo.edgeLabel}を${pointInfo.edgeRatio.left}:${pointInfo.edgeRatio.right}に分ける点`
          );
        }
      });
    
      return replaceCutPoints;
    };
    
    const replaceKeywords = (input: string): string => {
      return input.replace(/\[\[(.+?)\]\]/g, (_, key) => {
        if (key === "切断点") {
          const points = formattedCutPoints();
          return points.length > 0 ? points.join("、") : "[[切断点]]";
        } else {
          return `[[${key}]]`; // 他のキーワードはそのまま
        }
      });
    };

  return (
    <div className="w-full p-4 md:p-12">
      <div className="m-4">
        <h1 className="text-xl font-bold">プレビュー</h1>
      </div>

      {/*問題*/}
      <div className="mx-auto my-4 md:p-6 p-2 border-2 rounded-md shadow-lg">
        {/*タグ*/}
        {tags && (
          <div className="flex flex-wrap gap-2">
            { tags.map((tag,index) => (
              <span key={index} className="bg-orange-100 text-gray-700 font-bold text-xs px-4 py-2"> {tag} </span>
            ))}
          </div>
        )}

        {/* 問題文 */}
        <div className="mt-4 mb-2 p-2 items-center space-y-4">
          <h1 className="text-md font-bold mb-4">問題</h1>
          <span className="text-md font-semibold whitespace-pre-line">{replaceKeywords(question)}</span>
        </div>

        <div className="flex justify-between">
          {/* 切断点情報 */}
          <div className="m-2 text-sm flex justify-start">
              <div className="relative group">
                <button onClick={togglePoint} className="text-xs">
                  切断点を確認する <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isPointOpen ? "rotate-180" : ""}`}  />
                </button>
                <div className={`absolute z-50 w-64 bg-white border border-gray-300 shadow-xl p-4 ${isPointOpen ? "": "hidden"}`}>
                  {pointsInfo.map((pointInfo, index) => (
                    <div key={index} className="w-full px-4">
                      {pointInfo.isVertex
                      ? ( <div className="w-full flex space-x-2">
                              <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                              <span className="p-1 my-auto">頂点 {pointInfo.vertexLabel}</span>
                          </div>
                      ):( <div className="w-full flex space-x-2">
                              <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                              <span className="p-1 my-auto">辺 {pointInfo.edgeLabel}</span>
                              <span className="text-sm my-auto text-center">{pointInfo.edgeRatio.left}</span>
                              <span className="my-auto"> : </span>
                              <span className="text-sm my-auto text-center">{pointInfo.edgeRatio.right}</span>
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
          </div>
          {/* 切断前立体表示エリア */}
          <div className="flex justify-end m-2">
            {isOrbitBoardCube ? (
              <div className="relative group">
                <button onClick={()=> setIsOrbitBoardCube(false)} className="flex">
                  <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
                  <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  立体を固定する
                </div>
              </div>
              ):(
                <div className="relative group">
                  <button onClick={()=> setIsOrbitBoardCube(true)} className="flex">
                    <span className="mr-2 my-auto text-xs">立体: 回転モードOFF</span>
                    <FontAwesomeIcon icon={faToggleOff} size="lg" className="mx-auto"/>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    立体を回転する
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className={`h-[300px] ${isOrbitBoardCube ? "cursor-grab" : ""}`}>
          <BoardCubeModel cutPoints={cutPoints} isOrbit={isOrbitBoardCube}/>
        </div>
        
        {/* 回答、解説エリア アコーディオン*/}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
              <button type="button" className="flex items-center justify-between w-full mt-8 p-2 font-medium rtl:text-right bg-gray-300 border border-gray-500 focus:ring-gray-200 gap-3" 
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                aria-expanded={isAccordionOpen}
                aria-controls="accordion-collapse-body-1"
              >
                <span>答えを開く</span>
                <FontAwesomeIcon icon={faCaretDown} className={`transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
            className={`p-5 border border-t-0 border-gray-500  ${isAccordionOpen ? "" : "hidden"}`}
            aria-labelledby="accordion-collapse-heading-1"
          >
            {/* 答え */}
            <div className="my-4 items-center space-y-4">
              <h1 className="text-md font-bold mb-4">答え</h1>
              <span className="text-lg font-semibold">{replaceKeywords(answer)}</span>
            </div>

            {/* 切断後の立体表示 */}
            <div className="mb-2 md:flex justify-end space-x-4">
              {/* 回転モード切り替えボタン */}
              <div className="flex justify-end my-auto">
                {isOrbitBoardCube ? (
                <div className="relative group">
                  <button onClick={()=> setIsOrbitBoardCube(false)} className="flex">
                    <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
                    <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    立体を固定する
                  </div>
                </div>
                ):(
                  <div className="relative group">
                    <button onClick={()=> setIsOrbitBoardCube(true)} className="flex">
                      <span className="mr-2 my-auto text-xs">立体: 回転モードOFF</span>
                      <FontAwesomeIcon icon={faToggleOff} size="lg" className="mx-auto"/>
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      立体を回転する
                    </div>
                  </div>
                )}
              </div>

              {/* 切り替えボタン */}
              <div className="flex space-x-8 text-xs justify-end my-auto"  role="tablist">
                <div>
                  {(["all", "geometry1", "geometry2"] as const).map((tab) => (
                      <button
                      key={tab}
                      role="tab"
                      className={`p-1 border-b-2 ${
                          selectedGeometry === tab ? "border-blue-500 font-semibold" : ""
                      }`}
                      onClick={() => setSelectedGeometry(tab)}
                      >
                      {tabLabels[tab]}
                      </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={`h-[300px] ${isOrbitCutCube ? "cursor-grab" : ""}`}>
              <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry} isOrbit={isOrbitCutCube}/>
            </div>

            {/* 解説 */}
            <div className="mt-4 mb-2 items-center space-y-4">
              <h1 className="text-md font-bold mb-4">解説</h1>
              <span className="text-md whitespace-pre-line">{replaceKeywords(explanation)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 前へボタン、次へボタン */}
      <div className="m-4 flex justify-between">
        <div className="justify-start my-auto">
          <button onClick={onBack} className="px-4 py-2 bg-gray-300 text-black rounded-md">
            前へ
          </button>
        </div>
        <div className="justify-end flex space-x-6">
          {/* 公開トグルボタン */}
          <div className="flex space-x-4 items-center mx-4">
            <p className="text-sm">公開設定</p>
            <button className="flex m-4 flex-col space-y-1" onClick={() => setPublished(!published)}>
            {published ?
              (<>
                <FontAwesomeIcon icon={faToggleOn} size="xl" className="text-green-500" />
                <span className="text-xs text-gray-600">公開中</span>
              </>
              ):(
                <>
                  <FontAwesomeIcon icon={faToggleOff} size="xl" />
                  <span className="text-xs text-gray-600">非公開</span>
                </>
              )
            }
            </button>
          </div>
          <button onClick={handleCreateBoard} className="bg-blue-500 text-white px-4 py-2 my-auto rounded-md hover:bg-blue-600 transition">
            投稿
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStep3;

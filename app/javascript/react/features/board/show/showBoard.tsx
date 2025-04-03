import { useEffect, useState } from "react";
import BoardCubeModel from "../create/BoardCubeModel";
import CutCubeModel from "../../renderResultCutCube/CutCubeModel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"
import { useGetBoard } from "./useGetBoard";
import { faPencil, faStar } from "@fortawesome/free-solid-svg-icons";

const ShowBoard = ({ id }: { id: string }) => {
  const { userName, glbUrl, cutPoints, question, answer, explanation, createdAt, published, setPublished, isOwner } = useGetBoard(id);
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // 編集用の状態
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingAnswer, setIsEditingAnswer] = useState(false);
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [currentAnswer, setCurrentAnswer] = useState(answer);
  const [currentExplanation, setCurrentExplanation] = useState(explanation || "解説なし");

  useEffect(() => {
    setCurrentQuestion(question);
    setCurrentAnswer(answer);
    setCurrentExplanation(explanation || "解説なし")
    setPublished(published);
  }, [question, answer, explanation]);

  useEffect(() => {
    if (!cutPoints) return;
    checkPointInfo(cutPoints);
  },[cutPoints]);

  if (!userName || !glbUrl || !cutPoints || !question || !answer)  return null;

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

  const handleBoardUpdate = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: currentQuestion,
          answer: currentAnswer,
          explanation: currentExplanation,
          published: published
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");
    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  return (
    <div className="w-full bg-white p-10 rounded-lg shadow-lg">
    {/*ヘッダー*/}
    <div className="header my-4 text-md flex justify-between w-full">
        <div className="justify-start flex space-x-2">
        <FontAwesomeIcon icon={faCircleUser} size="lg" className="hover:text-gray-300 transition duration-300"/>
        <span className="justify-start text-md">{userName}さん</span>
        </div>
        <div className="justify-end mx-4 flex space-x-4">
        <p className="text-gray-500 my-auto text-xs">{formattedDate}</p>
        </div>
    </div>

    {/* スター */}
    <div className="flex justify-end">
      <button className="flex flex-col space-y-1">
        <FontAwesomeIcon icon={faStar} className="hover:text-yellow-500"/>
        <span className="text-xs text-gray-600 mr-2">いいね</span>
      </button>
    </div>

    {/* 問題文 */}
    <div className="m-2">
        <h1 className="text-md font-bold mb-4">問題</h1>
        {isOwner ? (
        <div className="flex items-center space-x-2">
            {isEditingQuestion ? (
            <textarea
                value={currentQuestion || question}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onBlur={() => {
                    setIsEditingQuestion(false);
                    handleBoardUpdate();
                }}
                autoFocus
                className="w-full h-28 text-md px-1 font-semibold border-b border-gray-100 focus:outline-none focus:border-red-500"
            />
            ):(
            <h1
                className="text-md whitespace-pre-line font-semibold cursor-pointer"
                onClick={() => setIsEditingQuestion(true)}
                >
                {currentQuestion}
            </h1>
            )}
            <FontAwesomeIcon
            icon={faPencil}
            size="xs"
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsEditingQuestion(true)}
            />
        </div>
        ):(
        <div className="mt-4 mb-2 items-center space-y-4">
            <span className="text-md font-semibold whitespace-pre-line">{currentQuestion}</span>
        </div>
        )
        }
    </div>

    {/* 切断前立体表示エリア */}
    <BoardCubeModel cutPoints={cutPoints}/>

    {/* 切断点情報 */}
    <div className="mt-2">
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
    {/* 回答、解説エリア アコーディオン*/}
    <div id="accordion-collapse" data-accordion="collapse">
        {/*アコーディオンタブ*/}
        <h2 id="accordion-collapse-heading-1">
        <button type="button" className="flex items-center justify-between w-full mt-8 p-2 font-medium rtl:text-right bg-gray-300 border border-gray-500 focus:ring-gray-200 gap-3" 
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            aria-expanded={isAccordionOpen}
            aria-controls="accordion-collapse-body-1"
        >
            <span>答えを開く</span>
            <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}  />
        </button>
        </h2>
        {/*中身*/}
        <div id="accordion-collapse-body-1"
        className={`p-5 border bg-gray-100 border-gray-200 ${isAccordionOpen ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading-1"
        >
        {/* 答え */}
        <div className="my-4">
            <h1 className="text-md font-bold mb-4">答え</h1>
            {isOwner ? (
                <div className="flex items-center space-x-2">
                {isEditingAnswer ? (
                    <textarea
                    value={currentAnswer || answer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onBlur={() => {
                        setIsEditingAnswer(false);
                        handleBoardUpdate();
                    }}
                    autoFocus
                    className="w-full text-lg px-1 font-semibold border-b border-gray-100 focus:outline-none focus:border-red-500"
                    />
                ) : (
                    <h1
                    className="text-lg font-semibold cursor-pointer"
                    onClick={() => setIsEditingAnswer(true)}
                    >
                    {currentAnswer}
                    </h1>
                )}
                <FontAwesomeIcon
                    icon={faPencil}
                    size="xs"
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setIsEditingAnswer(true)}
                />
                </div>
            ):(
                <div className="my-4 items-center space-y-4">
                    <span className="text-lg font-semibold">{currentAnswer}</span>
                </div>
            )
            }
        </div>

        {/* 切断後の立体表示 */}
        <div>
            <div className="mt-4 mb-2 flex space-x-8 justify-end"  role="tablist">
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
            <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry}/>
        </div>

        {/* 解説 */}
        <div className="my-4">
            <h1 className="text-md font-bold mb-4">解説</h1>
            {isOwner ? (
                <div className="flex items-center space-x-2">
                {isEditingExplanation ? (
                    <textarea
                    value={currentExplanation || explanation || "解説なし"}
                    onChange={(e) => setCurrentExplanation(e.target.value)}
                    onBlur={() => {
                        setIsEditingExplanation(false);
                        handleBoardUpdate();
                    }}
                    autoFocus
                    className="w-full h-28 px-1 text-md border-b border-gray-100 focus:outline-none focus:border-red-500"
                    />
                ) : (
                    <h1
                    className="text-md cursor-pointer whitespace-pre-line"
                    onClick={() => setIsEditingExplanation(true)}
                    >
                    {currentExplanation}
                    </h1>
                )}
                <FontAwesomeIcon
                    icon={faPencil}
                    size="xs"
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setIsEditingExplanation(true)}
                />
                </div>
            ):(
                <div className="mt-4 mb-2 items-center space-y-4">
                  <span className="text-md whitespace-pre-line">{currentExplanation}</span>
                </div>
            )
            }
        </div>
        </div>
    </div>
    </div>
  );
};

export default ShowBoard;

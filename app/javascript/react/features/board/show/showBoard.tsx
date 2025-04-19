import { useEffect, useState } from "react";
import BoardCubeModel from "../create/BoardCubeModel";
import CutCubeModel from "../../renderResultCutCube/CutCubeModel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCircleUser, faHand, faPause, faThumbsUp, faPencil, faFolderClosed, faCircleXmark, faToggleOn, faToggleOff, faXmark, faCircleInfo, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"
import { useGetBoard } from "./useGetBoard";
import TagDropDown from "../../tag/TagDropdown"

const ShowBoard = ({ id }: { id: string }) => {
  const { userName, glbUrl, cutPoints, question, answer, explanation, createdAt, published, setPublished, isOwner, tags, setTags, like, setLike, likeCount, setLikeCount, favorite, setFavorite } = useGetBoard(id);
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [ isOrbitBoardCube, setIsOrbitBoardCube ] = useState(false);
  const [ isOrbitCutCube, setIsOrbitCutCube ] = useState(false);
  const [ isInfoOpen, setIsInfoOpen ] = useState(false);
  const [ isPointOpen, setIsPointOpen] = useState(false);

  const toggleInfo = () => setIsInfoOpen((prev)=> !prev);
  const togglePoint = () => setIsPointOpen((prev)=> !prev);

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

  const handleBoardUpdate = async (overrideTags?: string[]) => {
    if (!id || !currentQuestion ||  !currentAnswer) return;

    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: replaceKeywords(currentQuestion),
          answer: replaceKeywords(currentAnswer),
          explanation: replaceKeywords(currentExplanation),
          published: published,
          tags: overrideTags ?? null,
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const data = await response.json();
      if (data) {
        setCurrentQuestion(data.board.question);
        setCurrentAnswer(data.board.answer);
        setCurrentExplanation(data.board.explanation);
      }

    } catch (error) {
      console.error("更新エラー:", error);
    }
  };

  const handleRemoveTags = (tag:string) => {
    if (!tags) return;
    if (tags.includes(tag)) {
      const updatedTags = tags.filter((t) => t !== tag);
      setTags(updatedTags);
      handleBoardUpdate(updatedTags);
    }
  }

  const handleUpdateFavorite = async(id:string) =>{
    try {
      const response = await fetch(`/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: id })
      });
      if (!response.ok) throw new Error("更新に失敗しました");
      const data = await response.json();
      if (data) {console.log(data.message)}
      setFavorite(!data.favorite);
    } catch (error) {
      console.error("更新エラー:", error);
    }
  }

  const handleUpdateLike = async(id:string) =>{
    setLikeCount(prev => like ? prev - 1 : prev + 1);
    try {
      const response = await fetch(`/api/likes/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: id })
      });
      if (!response.ok) throw new Error("更新に失敗しました");
      const data = await response.json();
      if (data) {console.log(data.message)}
      setLike(!data.like);
    } catch (error) {
      console.error("更新エラー:", error);
    }
  }

  return (
    <>
    <div className="flex justify-end my-4 md:mx-10">
      {isOwner && (
          <TagDropDown
          selectedTags={tags}
          setSelectedTags={(selectedTags) => {
              setTags(selectedTags);
              handleBoardUpdate(selectedTags); // タグ変更と同時にAPIを呼び出す
          }}
          />
      )}
    </div>

    <div className="md:mx-10 shadow-lg rounded-lg overflow-y-auto">
      <div className="sticky top-0  z-10 p-4 border-b font-bold bg-gray-100">
        {/*ヘッダー*/}
        <div className="header my-2 text-md flex justify-between w-full">
          <div className="justify-start flex space-x-2 text-sm">
            <FontAwesomeIcon icon={faCircleUser} className="my-auto"/>
            <span className="justify-start">{userName}さん</span>
          </div>
          <div className="justify-end mx-4 flex space-x-4">
            <p className="my-auto text-xs text-gray-500">{formattedDate}</p>
          </div>
        </div>

        <div className="flex justify-between mt-2">
          {/* タグ */}
          <div className="flex justify-startspace-x-2">
            {tags && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <div key={index} className="flex space-x-1 bg-orange-100 text-gray-700 font-bold text-xs px-4 py-2">
                    <span>{tag}</span>
                    {isOwner && (
                      <button onClick={() => handleRemoveTags(tag)}>
                        <FontAwesomeIcon icon={faCircleXmark} size="xs" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* キープといいね */}
          <div className="flex justify-end space-x-6 mx-4">
            <div className="relative group my-auto">
              <button onClick={()=> handleUpdateFavorite(id)} className="my-auto">
                <FontAwesomeIcon icon={faFolderClosed} className={`${favorite ? "text-cyan-600":""}`}/>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {favorite ? "キープからはずす" : "キープに保存する"}
              </div>
            </div>
            <div className="relative group my-auto">
              <button onClick={()=> handleUpdateLike(id)} className="flex space-x-1 my-auto">
                <FontAwesomeIcon icon={faThumbsUp} className={`${like ? "text-blue-500":""}`}/>
                <span className="text-xs text-gray-600 m-auto">{likeCount}</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                {like ? "いいね済み" : "いいねする"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 問題部分 */}
      <div className="p-4">
        {/*問題文*/}
        <div className="m-2">
          <div className="flex space-x-4">
            <h1 className="text-md font-bold">問題</h1>
            {isOwner && 
              <div className="relative group">
                <button onClick={toggleInfo}>
                  <FontAwesomeIcon icon={faCircleInfo} className="hover:text-gray-300 transition duration-300"/>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 z-50 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {isInfoOpen ? "問題の入力方法を閉じる" : "問題の入力方法を開く"}
                </div>
              </div>
            }
            {isInfoOpen && (
            <div className="absolute z-50 top-32 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-white border border-gray-300 shadow-xl rounded-md p-6 text-sm leading-relaxed">
              <span className="flex justify-end"><FontAwesomeIcon icon={faXmark} size="xl" onClick={toggleInfo}/></span>
              <p className="mb-2 font-bold text-gray-800">問題の入力方法について</p>
              <p className="mb-2 text-sm">切断点を入力したい時は 代わりに  <b>[[切断点]]</b>  と入力すれば、入力後に置き換えられます。</p>
              <p className="mb-2 text-sm">(例) [[切断点]] と入力 → 「頂点A, 辺BFを1:1に分ける点, 頂点C」などに置換されます。</p>
            </div>
            )}
        </div>

          {isOwner ? (
          <div className="flex items-center space-x-2">
              {isEditingQuestion ? (
              <textarea
                  value={currentQuestion !== null ? currentQuestion : question}
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

        <div className="flex justify-between">
          {/* 切断点情報 */}
          <div className="my-2 mx-2 text-sm flex justify-start">
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
          {/* モード切り替えタブ */}
          <div className="flex justify-end my-2">
            {isOrbitBoardCube ? (
              <div className="relative group">
                <button onClick={()=> setIsOrbitBoardCube(false)} className="flex px-4">
                  <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
                  <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  立体を固定する
                </div>
              </div>
              ):(
                <div className="relative group">
                  <button onClick={()=> setIsOrbitBoardCube(true)} className="flex px-4">
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

        {/*切断前立体表示エリア*/}
        <div className={`h-[300px] ${isOrbitBoardCube ? "cursor-grab" : ""}`}>
          <BoardCubeModel cutPoints={cutPoints} isOrbit={isOrbitBoardCube}/>
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
                      value={currentAnswer !== null ? currentAnswer : answer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onBlur={() => {
                          setIsEditingAnswer(false);
                          handleBoardUpdate();
                      }}
                      autoFocus
                      className="w-full text-md px-1 font-semibold border-b border-gray-100 focus:outline-none focus:border-red-500"
                      />
                  ) : (
                      <h1
                      className="text-md font-semibold cursor-pointer"
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
                      <span className="text-md font-semibold">{currentAnswer}</span>
                  </div>
              )
              }
          </div>

          {/* 切断後の立体表示 */}
          <div>
            <div className="mb-2 flex space-x-8 justify-end"  role="tablist">
            <div className="md:flex justify-end space-x-4">
                {/* 回転モード切り替えボタン */}
                <div className="flex justify-end my-auto">
                  {isOrbitCutCube ? (
                  <div className="relative group">
                    <button onClick={()=> setIsOrbitCutCube(false)} className="flex">
                      <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
                      <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      立体を固定する
                    </div>
                  </div>
                  ):(
                    <div className="relative group">
                      <button onClick={()=> setIsOrbitCutCube(true)} className="flex">
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
            </div>
            <div className={`h-[300px] ${isOrbitCutCube ? "cursor-grab":""}`}>
              <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry} isOrbit={isOrbitCutCube}/>
            </div>
          </div>

          {/* 解説 */}
          <div className="my-4">
              <h1 className="text-md font-bold mb-4">解説</h1>
              {isOwner ? (
                  <div className="flex items-center space-x-2">
                  {isEditingExplanation ? (
                      <textarea
                      value={currentExplanation !== null ? currentExplanation : explanation || "解説なし"}
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
    </div>
    </>
  );
};

export default ShowBoard;

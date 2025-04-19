import { useEffect, useState } from "react";
import CutCubeModel from "../../renderResultCutCube/CutCubeModel";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faCircleXmark, faToggleOn, faToggleOff, faCircleInfo, faXmark, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"
import { useNavigate} from "react-router-dom";
import TagDropdown from "../../tag/TagDropdown";

interface CreateStep2Props {
  glbUrl: string | "";
  cutPoints: THREE.Vector3[] | [];
  question: string | "";
  setQuestion: (q: string) => void;
  answer: string | "";
  setAnswer: (a: string) => void;
  explanation: string | "";
  setExplanation: (e: string) => void;
  tags: string[];
  setTags: (e: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const CreateStep2 = ({ glbUrl, cutPoints, question, setQuestion, answer, setAnswer, explanation, setExplanation, tags, setTags, onNext, onBack }: CreateStep2Props) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [ isOrbit, setIsOrbit ] = useState(false);
  const [ isInfoOpen, setIsInfoOpen ] = useState(false);
  const [ isPointOpen, setIsPointOpen] = useState(false);

  const toggleInfo = () => setIsInfoOpen((prev)=> !prev);
  const togglePoint = () => setIsPointOpen((prev)=> !prev);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [errorMessage]);

  useEffect(() => {
    if (glbUrl==="" || !cutPoints) {
      navigate("/board/new/step1");
      return;
    };
    checkPointInfo(cutPoints);
  },[glbUrl, cutPoints]);

  const tabLabels: Record<"all" | "geometry1" | "geometry2", string> = {
    all: "全体",
    geometry1: "緑の立体",
    geometry2: "青の立体",
  };

  const handlePreview = () => {
    if (question === "" || answer === "") {
      setErrorMessage("問題文と答えを入力してください。");
      return;
    }
    setErrorMessage("");
    onNext();
  };

  const handleRemoveTags = (tag:string) => {
    if (tags.includes(tag)) {
      const updatedTags = tags.filter((t) => t !== tag);
      setTags(updatedTags);
    }
  }

  if (glbUrl === "" || !cutPoints) return;

  return (
    <div className="w-full p-2 md:p-12">
    <div className="m-4 mx-auto p-6 border-2 rounded-lg">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="my-4 items-center space-y-1 w-full">
        <h1>問題の作成</h1>
        <p className="text-xl font-bold">step2: 問題を作成してください</p>
      </div>

      {/* 問題文編集エリア */}
      <div className="my-4 items-center space-y-1">
        <div className="flex space-x-2">
          <h1 className="text-lg font-bold">問題</h1>
          <div className="relative group">
            <button onClick={toggleInfo}>
              <FontAwesomeIcon icon={faCircleInfo} className="hover:text-gray-300 transition duration-300 my-auto"/>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              {isInfoOpen ? "問題の入力方法を閉じる" : "問題の入力方法を開く"}
            </div>
          </div>
          {isInfoOpen && (
          <div className="absolute z-50 top-32 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-white border border-gray-300 shadow-xl rounded-md p-6 text-sm leading-relaxed">
            <span className="flex justify-end"><FontAwesomeIcon icon={faXmark} size="xl" onClick={toggleInfo}/></span>
            <p className="mb-2 font-bold text-gray-800">問題の入力方法について</p>
            <p className="mb-2 text-sm">切断点を入力したい時は 代わりに <b>[[切断点]]</b> と入力すれば、入力後に置き換えられます。</p>
            <p className="mb-2 text-sm">(例) [[切断点]]と入力 → 頂点A, 辺BFを1:1に分ける点, 頂点C </p>
          </div>
          )}
        </div>
        <div className="flex items-center space-x-2 w-full">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-1 h-28 text-md border border-gray-500 focus:outline-none focus:border-blue-500"
          />
          <FontAwesomeIcon icon={faPencil} size="xs" className="text-gray-500"/>
        </div>
      </div>

      {/* 切断立体表示エリア */}
      <div>
        {/*ボタン*/}
        <div className="flex justify-between mx-2 mb-2">
          {/* 切断点情報 */}
          <div className="text-sm flex justify-start my-auto">
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
          {/*モードとタブ*/}
          <div className="md:flex justify-end space-x-4 space-y-1">
            {/* 回転モード切り替えボタン */}
            <div className="flex justify-end my-auto">
              {isOrbit ? (
              <div className="relative group">
                <button onClick={()=> setIsOrbit(false)} className="flex">
                  <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
                  <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  立体を固定する
                </div>
              </div>
              ):(
                <div className="relative group">
                  <button onClick={()=> setIsOrbit(true)} className="flex">
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

        {/*立体*/}
        <div className={`h-[200px] ${isOrbit ? "cursor-grab" : ""}`}>
          <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry} isOrbit={isOrbit}/>
        </div>
      </div>

      {/* 回答、解説編集エリア */}
      <div className="my-4 space-y-4">
        <div className="space-y-1">
          <h1 className="text-lg font-bold">答え</h1>
          <div className="flex items-center space-x-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-1 text-md border border-gray-500 focus:outline-none focus:border-blue-500"
            />
            <FontAwesomeIcon icon={faPencil} size="xs" className="text-gray-500"/>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-lg font-bold">解説</h1>
          <div className="flex items-center space-x-2">
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-1 h-28 text-md border border-gray-500 focus:outline-none focus:border-blue-500"
            />
            <FontAwesomeIcon icon={faPencil} size="xs" className="text-gray-500"/>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-lg font-bold">タグ設定</h1>
            <TagDropdown selectedTags={tags} setSelectedTags={setTags}/>
          </div>
          {tags && (
              <div className="flex flex-wrap gap-1">
                { tags.map((tag, index) => (
                  <div key={index} className="flex space-x-1 bg-orange-100 text-gray-700 font-bold text-xs px-4 py-2">
                    <span> {tag} </span>
                    <button onClick={()=> handleRemoveTags(tag)}><FontAwesomeIcon icon={faCircleXmark} size="xs" /></button>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* 前へボタン、次へボタン */}
      <div className="my-4 flex justify-between">
        <button onClick={() => {if (window.confirm("入力内容が消えてしまいますがよろしいですか？")) onBack();}} 
          className="px-4 py-2 bg-gray-300 text-black rounded-md"
        >前へ</button>
        <button onClick={handlePreview} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          プレビュー
        </button>
      </div>
    </div>
    </div>
  );
};

export default CreateStep2;

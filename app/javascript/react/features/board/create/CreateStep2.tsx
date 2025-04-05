import { useEffect, useState } from "react";
import CutCubeModel from "../../renderResultCutCube/CutCubeModel";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
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
  tag: string | "";
  setTag: (e: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const CreateStep2 = ({ glbUrl, cutPoints, question, setQuestion, answer, setAnswer, explanation, setExplanation, tag, setTag, onNext, onBack }: CreateStep2Props) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

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

  if (glbUrl === "" || !cutPoints) return;

  return (
    <div className="m-4 p-6 border-2 rounded-lg">
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <div className="my-4 items-center space-y-1 w-full">
        <h1>問題の作成</h1>
        <p className="text-xl font-bold">step2: 問題を作成してください</p>
      </div>

      {/* 問題文編集エリア */}
      <div className="my-4 items-center space-y-1">
        <h1 className="text-lg font-bold">問題</h1>
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
        <div className="m-4 mb-2 flex space-x-8 justify-end"  role="tablist">
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
                  <span className="text-sm p-1 my-auto rounded text-center">{pointInfo.edgeRatio.left}</span>
                  <span className="my-auto"> : </span>
                  <span className="text-sm p-1 my-auto rounded text-center">{pointInfo.edgeRatio.right}</span>
                </div>
            )}
          </div>
        ))}
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
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold">タグ設定</h1>
            <TagDropdown selectedTag={tag} setSelectedTag={setTag}/>
          </div>
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
  );
};

export default CreateStep2;

import {useEffect, useState} from "react";
import { Route, Routes, useNavigate, Link  } from "react-router-dom";
import CreateStep1 from "./CreateStep1";
import CreateStep2 from "./CreateStep2";
import CreateStep3 from "./CreateStep3";
import { useGetCutCubes } from "../../history/useGetCutCubes";
import * as THREE from "three";
import { useAuth } from "../../../contexts/AuthContext"

const CreateBoard = () => {
  const { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos, cutFaceNames} = useGetCutCubes();
  const [cutCubeId, setCutCubeId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [published, setPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const idParam = query.get("id");
  
    if (window.location.pathname === "/board/new") {
      const step1Url = idParam
        ? `/board/new/step1?id=${idParam}`
        : "/board/new/step1";
      navigate(step1Url);
    }
  }, [navigate]);

  const selectedIndex = cutCubeIds.indexOf(cutCubeId || "");
  const selectedGlbUrl = selectedIndex !== -1 ? glbUrls[selectedIndex] : "";
  const selectedCutPoints: THREE.Vector3[] | [] = selectedIndex !== -1 ? cutPoints[selectedIndex] : [];

  if(!isLoggedIn) { return (
    <div className="m-4 p-4">
      <div className="m-4 items-center space-y-1 w-full">
        <h1>問題を作成する</h1>
        <p className="text-xl font-bold">step1: 切断を選択してください</p>
      </div>
      <p className="p-4"><Link to="/login" className="text-blue-700 border-b-2">ログイン</Link>が必要です</p>
    </div>
  )}

  return (
    <Routes>
      <Route path="step1" element={
          <CreateStep1
            cutCubeId={cutCubeId}
            setCutCubeId={setCutCubeId}
            cutCubeIds={cutCubeIds}
            glbUrls={glbUrls}
            cutPoints={cutPoints}
            titles={titles}
            memos={memos}
            createdAt={createdAt}
            cutFaceNames={cutFaceNames}
            onNext={() => navigate("/board/new/step2")}
          />} />
      <Route
        path="step2"
        element={
          <CreateStep2
            glbUrl={selectedGlbUrl}
            cutPoints={selectedCutPoints}
            question={question}
            setQuestion={setQuestion}
            answer={answer} 
            setAnswer={setAnswer}
            explanation={explanation}
            setExplanation={setExplanation} 
            tags={tags}
            setTags={setTags}
            onNext={() => navigate("/board/new/step3")}
            onBack={() => navigate("/board/new/step1")}
          />
        }
      />
      <Route
        path="step3"
        element={
          <CreateStep3 
            cutCubeId={cutCubeId}
            glbUrl={selectedGlbUrl}
            cutPoints={selectedCutPoints}
            question={question}
            answer={answer}
            explanation={explanation}
            tags={tags}
            published={published}
            setPublished={setPublished}
            onBack={() => navigate("/board/new/step2")}
          />
        }
      />
    </Routes>
  );
};

export default CreateBoard;
  
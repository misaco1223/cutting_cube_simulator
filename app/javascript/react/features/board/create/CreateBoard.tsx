import {useEffect, useState} from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreateStep1 from "./CreateStep1";
import CreateStep2 from "./CreateStep2";
import CreateStep3 from "./CreateStep3";
import { useGetCutCubes } from "../../history/useGetCutCubes";
import * as THREE from "three";

const CreateBoard = () => {
  const { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos} = useGetCutCubes();
  const [cutCubeId, setCutCubeId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [published, setPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  const selectedIndex = cutCubeIds.indexOf(cutCubeId || "");
  const selectedGlbUrl = selectedIndex !== -1 ? glbUrls[selectedIndex] : "";
  const selectedCutPoints: THREE.Vector3[] | [] = selectedIndex !== -1 ? cutPoints[selectedIndex] : [];

  useEffect(() => {
    if (window.location.pathname === "/board/new") {
      navigate("/board/new/step1");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/step1" element={
          <CreateStep1
            cutCubeId={cutCubeId}
            setCutCubeId={setCutCubeId}
            cutCubeIds={cutCubeIds}
            glbUrls={glbUrls}
            cutPoints={cutPoints}
            titles={titles}
            memos={memos}
            createdAt={createdAt}
            onNext={() => navigate("/board/new/step2")}
          />} />
      <Route
        path="/step2"
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
        path="/step3"
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
  
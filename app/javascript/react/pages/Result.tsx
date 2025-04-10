import { useParams } from "react-router-dom";
import ResultCutCube from "../features/renderResultCutCube/ResultCutCube";

const Result = () => {
  const { id } = useParams<{ id: string }>();
  if(!id) return;
  return(
    <div className="w-full p-4">
      <ResultCutCube id={id}/>
    </div>
  );
};

export default Result;
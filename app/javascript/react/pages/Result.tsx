import { useParams } from "react-router-dom";
import ResultCutCube from "../features/renderResultCutCube/ResultCutCube";

const Result = () => {
  const { id } = useParams();
  return(
    <div className="container mx-auto mt-4 px-5">
      <ResultCutCube id={id}/>
    </div>
  );
};

export default Result;
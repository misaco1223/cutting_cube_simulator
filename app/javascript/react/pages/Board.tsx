import { useParams } from "react-router-dom";
import ShowBoard from "../features/board/show/showBoard";

const Board = () => {
  const { id } = useParams<{ id: string }>();
  if(!id) return;
  return(
    <div className="container mx-auto w-full mt-4 px-4">
      <ShowBoard id={id}/>
      <div className="mt-12 mb-4">
        <button
          onClick={() => window.history.back()}
          className="justify-start px-4 py-2 bg-gray-300 text-black rounded-md"
        > 戻る
        </button>
      </div>
    </div>
  );
};

export default Board;
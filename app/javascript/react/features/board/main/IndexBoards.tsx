import { useState, useMemo, startTransition  } from "react";
import BoardCard from "./BoardCard";
import { useGetBoards } from "./useGetBoards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faStar, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface IndexBoardsProps {
  filter: string|null;
}

const IndexBoards = ( {filter}:IndexBoardsProps ) => {
  const { userNames, boardIds, cutPoints, createdAt, questions, tags } = useGetBoards(filter);
  if (!boardIds ) return null;

  //ページ処理
  const itemsPerPage = 12;
  const totalItems = boardIds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { currentUserNames, currentBoardIds, currentCutPoints, currentCreatedAt, currentQuestions, currentTags } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    return {
      currentUserNames: userNames.slice(startIndex, endIndex),
      currentBoardIds: boardIds.slice(startIndex, endIndex),
      currentCutPoints: cutPoints.slice(startIndex, endIndex),
      currentCreatedAt: createdAt.slice(startIndex, endIndex),
      currentQuestions: questions.slice(startIndex, endIndex),
      currentTags: tags.slice(startIndex, endIndex),
    };
  }, [currentPage, userNames, boardIds, cutPoints, createdAt, questions, tags]);

  const handlePageClick = (selectedPage: number) => {
    if (selectedPage < 1 || selectedPage > totalPages + 1) return;
    startTransition(() => {
        setCurrentPage(selectedPage);
      });
  };

  return (
    <div>
      {/* カード */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 min-w-0">
      { boardIds.length === 0 ? <p className="m-4">投稿されている問題はありません</p>
      : currentBoardIds.map((boardId, index) => (
        <div className="w-full border border-gray-200 p-2 rounded-lg shadow-md flex flex-col min-h-[300px]">
          <BoardCard
            key={index}
            userName={currentUserNames[index]}
            cutPoints={currentCutPoints[index]}
            createdAt={currentCreatedAt[index]}
            question={currentQuestions[index]}
            tag={currentTags[index]}
          />
          <div className="px-2 flex space-x-4 justify-end items-center mt-auto">
            <Link to={`/board/${boardId}`} className="text-blue-500 hover:underline">詳細を見る</Link>
            <span><FontAwesomeIcon icon={faStar} /></span>
            <span><FontAwesomeIcon icon={faThumbsUp} /></span>
          </div>
        </div>
      ))}
      </div>

      {/* ページング*/}
      <div className="my-4 flex justify-center space-x-4">
        {totalPages > 1 ? (
          <>
            <button
              className="px-4 py-2"
              onClick={() => handlePageClick(currentPage - 1)}
              disabled={currentPage === 1}
            >
             <FontAwesomeIcon icon={faAngleLeft} />
            </button>
      
            <div className="flex items-center">
              <span className="text-lg">{currentPage} / {totalPages}</span>
            </div>

            <button
              className="px-4 py-2"
              onClick={() => handlePageClick(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
           </>
        ):(
          <div className="flex items-center">
            <span className="text-lg">1 / 1</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexBoards;

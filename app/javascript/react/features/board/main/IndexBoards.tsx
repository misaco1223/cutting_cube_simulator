import { useState, useMemo, useEffect, startTransition  } from "react";
import BoardCard from "./BoardCard";
import { useGetBoards } from "./useGetBoards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faHand, faPause, faStar, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface IndexBoardsProps {
  filter: string|null;
}

const IndexBoards = ( {filter}:IndexBoardsProps ) => {
  const { userNames, boardIds, cutPoints, createdAt, questions, tags, likes, setLikes, likeCounts, setLikeCounts, favorites, setFavorites } = useGetBoards(filter);
  if (!boardIds ) return null;
  const [ isOrbit, setIsOrbit ] = useState(false);

  //ページ処理
  const itemsPerPage = 12;
  const totalItems = boardIds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { currentUserNames, currentBoardIds, currentCutPoints, currentCreatedAt, currentQuestions, currentTags, currentLikes, currentLikeCounts, currentFavorites } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    return {
      currentUserNames: userNames.slice(startIndex, endIndex),
      currentBoardIds: boardIds.slice(startIndex, endIndex),
      currentCutPoints: cutPoints.slice(startIndex, endIndex),
      currentCreatedAt: createdAt.slice(startIndex, endIndex),
      currentQuestions: questions.slice(startIndex, endIndex),
      currentTags: tags.slice(startIndex, endIndex).map(tagArray => tagArray),
      currentLikes: likes.slice(startIndex, endIndex),
      currentLikeCounts: likeCounts.slice(startIndex, endIndex),
      currentFavorites: favorites.slice(startIndex, endIndex)

    };
  }, [currentPage, userNames, boardIds, cutPoints, createdAt, questions, tags, likes, likeCounts, favorites]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handlePageClick = (selectedPage: number) => {
    if (selectedPage < 1 || selectedPage > totalPages + 1) return;
    startTransition(() => {
        setCurrentPage(selectedPage);
      });
  };

  const handleUpdateFavorites = async(id:string, index: number) => {
    try {
      const response = await fetch(`/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: id })
      });
      if (!response.ok) throw new Error("更新に失敗しました");
      const data = await response.json();
      if (data) {console.log(data.message)}
      
      const updatedFavorites = [...favorites];
      updatedFavorites[index] = !data.favorite;
      setFavorites(updatedFavorites);

    } catch (error) {
      console.error("更新エラー:", error);
    }
  }

  const handleUpdateLikes = async(id:string, index: number) => {
    const updatedLikeCounts = [...likeCounts];
    likes[index] === true ? updatedLikeCounts[index] -= 1 : updatedLikeCounts[index] += 1
    setLikeCounts(updatedLikeCounts);

    try {
      const response = await fetch(`/api/likes/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board_id: id })
      });
      if (!response.ok) throw new Error("更新に失敗しました");
      const data = await response.json();
      if (data) {console.log(data.message)}
      
      const updatedLikes = [...likes];
      updatedLikes[index] = !data.like;
      setLikes(updatedLikes);
    } catch (error) {
      console.error("更新エラー:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-end mr-2">
      {isOrbit ? (
        <button onClick={()=> setIsOrbit(false)} className="flex mb-4 border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 回転モード中</span>
          <FontAwesomeIcon icon={faHand} className="mx-auto"/>
        </button>
      ):(
        <button onClick={()=> setIsOrbit(true)} className="flex mb-4 border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 固定モード中</span>
          <FontAwesomeIcon icon={faPause} className="mx-auto"/>
        </button>
      )}
      </div>

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
            isOrbit={isOrbit}
          />
          <div className="px-2 flex space-x-4 justify-end items-center mt-auto">
            <Link to={`/board/${boardId}`} className="text-blue-500 hover:underline">詳細を見る</Link>
            <button key={index} onClick={()=> handleUpdateFavorites(boardId, index)} className="items-center">
              <FontAwesomeIcon icon={faStar} className={`${currentFavorites[index] ? "text-yellow-500":""}`}/>
            </button>
            <button key={index} onClick={()=> handleUpdateLikes(boardId, index)} className="flex space-x-1 items-center">
              <FontAwesomeIcon icon={faThumbsUp} className={`${currentLikes[index] ? "text-blue-500":""}`}/>
              <span>{currentLikeCounts[index]}</span>
            </button>
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

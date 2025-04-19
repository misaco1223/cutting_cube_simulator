import { useState, useMemo, useEffect, startTransition  } from "react";
import BoardCard from "./BoardCard";
import { useGetBoards } from "./useGetBoards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faFolderClosed, faThumbsUp, faToggleOn, faToggleOff, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

interface IndexBoardsProps {
  filter: string|null;
}

const IndexBoards = ( {filter}:IndexBoardsProps ) => {
  const { userNames, boardIds, cutPoints, createdAt, questions, tags, likes, setLikes, likeCounts, setLikeCounts, favorites, setFavorites } = useGetBoards(filter);
  if (!boardIds ) return null;
  const [ isOrbit, setIsOrbit ] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
  
  if (!isLoggedIn) navigate("/login");

  const formattedDate = (createdAt: string | null | undefined): string => {
    if (!createdAt) return "";
    return new Date(createdAt).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(/\//g, "-");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];

  return (
    <div>
      <div className="sticky top-0 bg-white z-40 flex justify-end py-2">
        <div className="flex justify-end space-y-2 overflow-y-auto">
        {isOrbit ? (
          <div className="relative group">
            <button onClick={()=> setIsOrbit(false)} className="flex px-4">
              <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
              <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              立体を固定する
            </div>
          </div>
          ):(
            <div className="relative group">
              <button onClick={()=> setIsOrbit(true)} className="flex px-4">
                <span className="mr-2 my-auto text-xs">立体: 回転モードOFF</span>
                <FontAwesomeIcon icon={faToggleOff} size="lg" className="mx-auto"/>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                立体を回転する
              </div>
            </div>
          )}
        </div>

        {filter && 
          <div className="text-gray-500 text-sm flex md:mr-4 mr-2 justify-end">表示: {filter}</div>
        }
      </div>

      {/* カード */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 min-w-0">
        { boardIds.length === 0 ? <p className="m-4">投稿されている問題はありません</p>
        : currentBoardIds.map((boardId, index) => (
          <div className="w-full border border-gray-200 rounded-lg shadow-md flex flex-col min-h-[500px]">
            {/*ヘッダー*/}
            <div className="p-4 border-b font-bold bg-gray-100">
              <div className="header my-4 md:flex justify-between w-full">
                <div className="justify-start flex space-x-2">
                  <FontAwesomeIcon icon={faCircleUser} className="hover:text-gray-300 transition duration-300"/>
                  <span className="justify-start text-sm">{currentUserNames[index]}さん</span>
                </div>
                <div className="flex justify-end">
                  <p className="text-gray-500 my-auto text-xs">{formattedDate(currentCreatedAt[index])}</p>
                </div>
              </div>

              <div className="flex justify-between">
                {/*タグ*/}
                <div className="flex justify-start space-x-2 min-h-8">
                  {formattedDate(currentCreatedAt[index])>= todayString && <span className="bg-yellow-400 text-gray-600 text-xs p-1 my-auto">NEW</span>}
                  {currentTags[index] && (
                    <div className="flex flex-wrap gap-2">
                      { currentTags[index].map((tag,index) => (
                        <span key={index} className="bg-orange-100 text-gray-700 font-bold text-xs p-1 my-auto"> {tag} </span>
                      ))}
                    </div>
                  )}
                </div>

              {/*キープといいね*/}
              <div className="flex justify-end space-x-4">
                <div className="relative group">
                  <button key={index} onClick={()=> handleUpdateFavorites(boardId, index)} className="items-center">
                    <FontAwesomeIcon icon={faFolderClosed} className={`${currentFavorites[index] ? "text-cyan-600":""}`}/>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {currentFavorites[index] ? "キープからはずす" : "キープに保存"}
                  </div>
                </div>
                <div className="relative group">
                  <button key={index} onClick={()=> handleUpdateLikes(boardId, index)} className="flex space-x-1 items-center">
                    <FontAwesomeIcon icon={faThumbsUp} className={`${currentLikes[index] ? "text-blue-500":""}`}/>
                    <span>{currentLikeCounts[index]}</span>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {currentLikes[index] ? "いいね済み" : "いいねする"}
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            {/*問題の中身*/}
            <BoardCard
              key={index}
              boardId={boardId}
              userName={currentUserNames[index]}
              cutPoints={currentCutPoints[index]}
              createdAt={currentCreatedAt[index]}
              question={currentQuestions[index]}
              tag={currentTags[index]}
              isOrbit={isOrbit}
            />
          </div>
        ))}
      </div>

      {/* ページング*/}
      <div className="my-12 flex justify-center space-x-4">
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

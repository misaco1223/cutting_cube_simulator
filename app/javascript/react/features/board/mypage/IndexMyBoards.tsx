import { useState, useMemo, startTransition  } from "react";
import MyBoardCard from "./MyBoardCard";
import { useGetMyBoards} from "./useGetMyBoards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBookmark, faToggleOn, faToggleOff, faThumbsUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../contexts/AuthContext";


const IndexMyBoards = () => {
    const { boardIds, cutPoints, questions, createdAt, published, setPublished, tags, isLoaded, likeCounts  } = useGetMyBoards();
    const { isLoggedIn, userName } = useAuth();
    const [ isOrbit, setIsOrbit ] = useState(false);
    if (!boardIds || !cutPoints || boardIds.length !== cutPoints.length ) return null;
  
    //ページ処理
    const itemsPerPage = 12;
    const totalItems = boardIds.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const [currentPage, setCurrentPage] = useState(1);
  
    const { currentBoardIds, currentCutPoints, currentQuestions, currentCreatedAt, currentPublished, currentTags, currentLikeCounts } = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    
      return {
        currentBoardIds: boardIds.slice(startIndex, endIndex),
        currentCutPoints: cutPoints.slice(startIndex, endIndex),
        currentQuestions: questions.slice(startIndex, endIndex),
        currentCreatedAt: createdAt.slice(startIndex, endIndex),
        currentPublished: published.slice(startIndex, endIndex),
        currentTags: tags.slice(startIndex, endIndex),
        currentLikeCounts: likeCounts.slice(startIndex, endIndex)
      };
    }, [currentPage, boardIds, cutPoints, questions, createdAt, published, tags, likeCounts]);
  
    const handlePageClick = (selectedPage: number) => {
      if (selectedPage < 1 || selectedPage > totalPages + 1) return;
        startTransition(() => {
          setCurrentPage(selectedPage);
        });
    };
  
    const handleRemoveBoard = async(boardId: string, index: number) => {
        try {
          const response = await fetch(`/api/boards/${boardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const data = await response.json();
          window.location.reload();
        } catch (error) {
          // console.log(error);
        }
      }
    
      const handleUpdatePublished = async (boardId: string, index: number) => {
        try {
          const response = await fetch(`/api/boards/${boardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ board_id: boardId, published: !published[index]})
          });
          const data = await response.json();
    
          const updatedPublished = [...published];
          updatedPublished[index] = !updatedPublished[index];
          setPublished(updatedPublished);
    
          // console.log("更新しました");
        } catch (error) {
          // console.log(error);
        }
      };
  
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

  return (
    <div className="w-full p-6">
      {/* 切断履歴 */}
      <h1 className="text-xl m-4 font-bold p-2">{userName}さんが作った問題ボード</h1>
      <div className="flex justify-end">
        {isOrbit ? (
          <div className="relative group">
            <button onClick={()=> setIsOrbit(false)} className="flex md:px-4">
              <span className="mr-2 my-auto text-xs">立体: 回転モードON</span>
              <FontAwesomeIcon icon={faToggleOn} size="lg" className="mx-auto text-green-500"/>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
              立体を固定する
            </div>
          </div>
          ):(
            <div className="relative group">
              <button onClick={()=> setIsOrbit(true)} className="flex md:px-4">
                <span className="mr-2 my-auto text-xs">立体: 回転モードOFF</span>
                <FontAwesomeIcon icon={faToggleOff} size="lg" className="mx-auto"/>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                立体を回転する
              </div>
            </div>
          )}
      </div>

      {/* カード */}
      <div className="md:p-4 pt-2 grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4 min-w-0">
      {!isLoaded && 
        <p className="mt-6 p-2">ロード中...</p>
      }
      { isLoaded && boardIds.length === 0 ?
        (<p className="my-4">履歴はありません</p>)
      : currentBoardIds.map((boardId, index) => (
        <div className="w-full border border-gray-200 px-4 py-6 rounded-lg shadow-md flex flex-col justify-between">
            <MyBoardCard
              boardId={boardId}
              tag={tags[index]}
              cutPoints={cutPoints[index]}
              question={questions[index]}
              createdAt={createdAt[index]}
              isOrbit={isOrbit}
            />
            {/*日付*/}
            <p className="text-gray-500 text-xs px-4 mb-4">{formattedDate(createdAt[index])}</p>
            {/*ボタン*/}
            <div className="flex justify-between px-4">
              <div className="justify-start flex space-x-12">
                {/*いいね*/}
                <div className="relative group h-full">
                  <div className="absolute bottom-2 flex space-x-1">
                    <FontAwesomeIcon icon={faThumbsUp}/>
                    <span className="text-xs text-gray-600 mt-auto m-auto">{likeCounts[index]}</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    みんなにもらったいいねの数
                  </div>
                </div>
                {/*公開非公開*/}
                <div>
                  {published[index] ? (
                    <div className="relative group">
                      <button
                        onClick={() => {
                          if (window.confirm("この問題を非公開にします。")) {
                            handleUpdatePublished(boardId, index);
                          
                          }
                        }}
                        className="flex flex-col"
                      >
                        <FontAwesomeIcon icon={faToggleOn} className="text-green-500" />
                        <span className="text-xs text-gray-600">公開中</span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        非公開にする
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <button
                        onClick={() => {
                          if (window.confirm("この問題を公開します。よろしいですか？")) {
                            handleUpdatePublished(boardId, index);
                          }}
                        }
                        className="flex flex-col"
                      >
                        <FontAwesomeIcon icon={faToggleOff}/>
                        <span className="text-xs text-gray-600">非公開</span>
                      </button>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        問題を公開する
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex mt-auto justify-end space-x-4 my-auto">
                {/*削除ボタン*/}
                <div className="relative group">
                  <button 
                    onClick={() => {
                      if (window.confirm("この問題を削除します。よろしいですか？")) {
                        handleRemoveBoard(boardId, index);
                      }} 
                    }
                  >
                    <FontAwesomeIcon icon={faTrashCan} size="lg" className="hover:text-red-600"/>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    問題を削除する
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページング*/}
      <div className="my-12 mx-auto flex justify-center space-x-4">
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

export default IndexMyBoards;

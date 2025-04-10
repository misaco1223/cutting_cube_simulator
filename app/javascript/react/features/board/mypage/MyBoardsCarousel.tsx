import { useRef, useState, useEffect } from "react";
import MyBoardCard from "./MyBoardCard";
import { useGetMyBoards } from "./useGetMyBoards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faTrashCan, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const MyBoardsCarousel= () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { boardIds, cutPoints, questions, createdAt, published, setPublished, tags, isLoaded } = useGetMyBoards();
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [ isOrbit, setIsOrbit ] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // スクロール位置が 5つ目（4番目の要素）より右に行ったらボタンを表示
      const threshold = (scrollWidth / boardIds.length) * 14; // 5つ目
      setShowMoreButton(scrollLeft >= threshold - clientWidth);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [boardIds]);

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
      console.log(error);
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

      console.log("更新しました");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex h-full w-full p-2 max-w-full">
      {!isLoaded ?
        <p className="p-2">ロード中...</p>
      : (!boardIds || boardIds.length === 0) &&
        <div className="p-2">
          <p>作成された問題はありません。</p>
        </div>
      }
      <div  ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory p-2 scrollbar-hide"
      >
        {boardIds.map((boardId, index) => (
        <div key={boardId} className="shrink-0">
          <div className="w-48 h-full border border-gray-200 p-2 rounded-lg shadow-md flex flex-grow flex-col justify-between ">
            <MyBoardCard
              tag={tags[index]}
              cutPoints={cutPoints[index]}
              question={questions[index]}
              createdAt={createdAt[index]}
              isOrbit={isOrbit}
            />
            <Link to={`/board/${boardId}`} className="m-4 text-blue-500 hover:underline mt-auto">詳細を見る</Link>
            <div className="px-4 mt-auto flex space-x-4 justify-end">
              <div className="flex space-x-4 items-center">
                <button 
                  onClick={() => {
                    if (window.confirm("この問題を削除します。よろしいですか？")) {
                      handleRemoveBoard(boardId, index);
                    }} 
                  }
                  className="flex flex-col space-y-1"
                >
                  <FontAwesomeIcon icon={faTrashCan} size="lg" className="hover:text-red-600"/>
                  <span className="text-xs text-gray-600">削除</span>
                </button>
                {published[index] ? (
                  <button
                    onClick={() => {
                      if (window.confirm("この問題を非公開にします。")) {
                        handleUpdatePublished(boardId, index);
                      }}
                    }
                    className="flex flex-col space-y-1"
                  >
                    <FontAwesomeIcon icon={faToggleOn} size="lg" className="text-green-500" />
                    <span className="text-xs text-gray-600">公開中</span>
                  </button>
                  ) : (
                  <button
                    onClick={() => {
                      if (window.confirm("この問題を公開します。よろしいですか？")) {
                      handleUpdatePublished(boardId, index);
                      }}
                    }
                    className="flex flex-col space-y-1"
                  >
                    <FontAwesomeIcon icon={faToggleOff} size="lg" />
                    <span className="text-xs text-gray-600">非公開</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      <div className="flex justify-center items-center flex-1">
        {showMoreButton && (
          <button className="w-full my-auto font-bold text-blue-500" onClick={() => alert("もっと見る")}>
            <FontAwesomeIcon icon={faAngleRight} size="xl"/>
          </button>
        )}
      </div>
    </div>
  );
};

export default MyBoardsCarousel;

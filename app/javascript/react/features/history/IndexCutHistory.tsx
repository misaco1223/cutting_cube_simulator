import { useEffect, useState, useMemo, startTransition  } from "react";
import HistoryCard from "./HistoryCard";
import { useGetCutCubes } from "./useGetCutCubes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faTriangleExclamation, faTrashCan, faBookmark, faPause, faHand } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const IndexCutHistory = () => {
  const { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos, isStorageUser, bookmarkIds, setBookmarkIds, isLoaded } = useGetCutCubes();
  const { isLoggedIn } = useAuth();
  const [ isOrbit, setIsOrbit ] = useState(false);
  if (!glbUrls || !cutPoints || glbUrls.length !== cutPoints.length || !bookmarkIds ) return null;

  //ページ処理
  const itemsPerPage = 12;
  const totalItems = glbUrls.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { currentGlbUrls, currentCutPoints, currentCutCubeIds, currentCreatedAt, currentTitles, currentMemos, currentBookmarkIds } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    return {
      currentGlbUrls: glbUrls.slice(startIndex, endIndex),
      currentCutPoints: cutPoints.slice(startIndex, endIndex),
      currentCutCubeIds: cutCubeIds.slice(startIndex, endIndex),
      currentCreatedAt: createdAt.slice(startIndex, endIndex),
      currentTitles: titles.slice(startIndex, endIndex),
      currentMemos: memos.slice(startIndex, endIndex),
      currentBookmarkIds: bookmarkIds.slice(startIndex, endIndex)
    };
  }, [currentPage, glbUrls, cutPoints, cutCubeIds, createdAt, titles, memos, bookmarkIds]);

  const handlePageClick = (selectedPage: number) => {
    if (selectedPage < 1 || selectedPage > totalPages + 1) return;
    startTransition(() => {
        setCurrentPage(selectedPage);
      });
  };

  //履歴の削除
  const handleRemoveCutCube = async(cutCubeId: string) => {
    try {
      const response = await fetch(`/api/cut_cubes/${cutCubeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      const storedCutCubes = JSON.parse(localStorage.getItem("cutCube") || "[]");
      const updatedCutCubes = storedCutCubes.filter((cutCube: any) => String(cutCube.id) !== cutCubeId);
      localStorage.setItem("cutCube", JSON.stringify(updatedCutCubes));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  //ブックマークの追加
  const handleCreateBookmark = async(id: string, index:number) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({cut_cube_id: id})
      });
      const data = await response.json();
      
      const updatedBookmarkIds = [...bookmarkIds];
      updatedBookmarkIds[index] = data.bookmark_id;
      setBookmarkIds(updatedBookmarkIds);
      console.log("ブックマークを作成しました")
    } catch (error) {
      console.log(error);
    }
  }

  //ブックマークの削除
  const handleRemoveBookmark = async(bookmarkId: string, index: number) => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }

      const updatedBookmarkIds = [...bookmarkIds];
      updatedBookmarkIds[index] = null;
      setBookmarkIds(updatedBookmarkIds);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      {/* 切断履歴 */}
      <h1 className="text-xl m-4 font-bold p-2">切断履歴</h1>
      { isStorageUser ?
        <span className="text-red-500 text-xs flex mt-2 items-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
          <p>ログイン前 / Cookie 承認前の切断データは引き継げません。<br/>最大５つまで表示されます。<br/>データは保持されません。</p>
        </span>
      : ""}

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
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4 min-w-0">
      {!isLoaded && 
        <p className="mt-6 p-2">ロード中...</p>
      }
      { isLoaded && glbUrls.length === 0 ?
        (<p className="my-4">履歴はありません</p>)
      : currentGlbUrls.map((glbUrl, index) => (
        <div className="w-full border border-gray-200 px-4 py-6 rounded-lg shadow-md flex flex-col justify-between">
          <HistoryCard
            key={index}
            glbUrl={glbUrl}
            cutPoints={currentCutPoints[index]}
            createdAt={currentCreatedAt[index]}
            title={currentTitles[index]}
            memo={currentMemos[index]}
            isOrbit={isOrbit}
          />

          <div className="p-2 justify-end mt-4">
            <Link to={`/result/${currentCutCubeIds[index]}`} className="text-blue-500 hover:underline">詳細を見る</Link>
            {/*下部ボタン*/}
            <div className="flex space-x-4 mt-4 justify-end">
              { isLoggedIn  && (
                currentBookmarkIds[index] ? (
                  <button onClick={() => handleRemoveBookmark(currentBookmarkIds[index]!, index)}>
                    <FontAwesomeIcon icon={faBookmark} className="text-yellow-500"/>
                  </button>
                ):(
                  <button onClick={() => handleCreateBookmark(currentCutCubeIds[index], index)}>
                    <FontAwesomeIcon icon={faBookmark} className="hover:text-yellow-500"/>
                  </button>
                )
              )}
              <button 
                onClick={() => {
                  if (window.confirm("切断を削除しますか？")) {
                    handleRemoveCutCube(currentCutCubeIds[index]);
                  }} 
                }
              >
                <FontAwesomeIcon icon={faTrashCan} className="hover:text-red-600"/>
              </button>
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

export default IndexCutHistory;

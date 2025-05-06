import { useState, useMemo, startTransition  } from "react";
import BookmarkCard from "./BookmarkCard";
import { useGetBookmarks} from "./useGetBookmarks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBookmark, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";


const IndexBookmarks = () => {
    const { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos, bookmarkIds, isLoaded, cutFaceNames, volumeRatios } = useGetBookmarks();
    const { isLoggedIn, userName } = useAuth();
    const [ isOrbit, setIsOrbit ] = useState(false);
    if (!glbUrls || !cutPoints || glbUrls.length !== cutPoints.length || !bookmarkIds ) return null;
  
    //ページ処理
    const itemsPerPage = 12;
    const totalItems = glbUrls.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const [currentPage, setCurrentPage] = useState(1);
  
    const { currentGlbUrls, currentCutPoints, currentCutCubeIds, currentCreatedAt, currentTitles, currentMemos, currentBookmarkIds, currentCutFaceNames, currentVolumeRatios } = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
    
      return {
        currentGlbUrls: glbUrls.slice(startIndex, endIndex),
        currentCutPoints: cutPoints.slice(startIndex, endIndex),
        currentCutCubeIds: cutCubeIds.slice(startIndex, endIndex),
        currentCreatedAt: createdAt.slice(startIndex, endIndex),
        currentTitles: titles.slice(startIndex, endIndex),
        currentMemos: memos.slice(startIndex, endIndex),
        currentBookmarkIds: bookmarkIds.slice(startIndex, endIndex),
        currentCutFaceNames: cutFaceNames.slice(startIndex, endIndex),
        currentVolumeRatios: volumeRatios.slice(startIndex, endIndex)
      };
    }, [currentPage, glbUrls, cutPoints, cutCubeIds, createdAt, titles, memos, bookmarkIds, cutFaceNames, volumeRatios]);
  
    const handlePageClick = (selectedPage: number) => {
      if (selectedPage < 1 || selectedPage > totalPages + 1) return;
      startTransition(() => {
          setCurrentPage(selectedPage);
        });
    };
  
    //ブックマークの削除
    const handleRemoveBookmark = async(bookmarkId: string) => {
        try {
          const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
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
      <h1 className="text-xl m-4 font-bold p-2">{userName}さんの切断コレクション</h1>
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
      { isLoaded && glbUrls.length === 0 ?
        (<p className="my-4">履歴はありません</p>)
      : currentGlbUrls.map((glbUrl, index) => (
        <div className="w-full border border-gray-200 px-4 py-6 rounded-lg shadow-md flex flex-col justify-between">
          <div className="min-h-8 space-x-2">
            {currentCutFaceNames[index] && (
              <span key={index} className="bg-blue-100 font-semibold text-gray-700 text-xs px-2 py-1"> {currentCutFaceNames[index]} </span>
            )}
            {currentVolumeRatios[index] && (
              <span key={index} className="bg-pink-100 font-semibold text-gray-700 text-xs px-2 py-1"> {currentVolumeRatios[index]} </span>
            )}
          </div>
          <BookmarkCard
            cutCubeId={currentCutCubeIds[index]}
            glbUrl={glbUrl}
            cutPoints={currentCutPoints[index]}
            title={currentTitles[index]}
            memo={currentMemos[index]}
            isOrbit={isOrbit}
          />

          {/*下部日付とボタン*/}
          <div className="xl:flex justify-between items-center mt-2">
            <div className="flex justify-start">
              <p className="text-gray-500 text-xs mt-2">{formattedDate(currentCreatedAt[index])}</p>
            </div>
            {/*ボタン*/}
            <div className="flex space-x-4 mt-4 justify-end">
              {/*ブックマークボタン*/}
              { isLoggedIn  && (
                <div className="relative group">
                  <button
                    onClick={() => currentBookmarkIds[index] && handleRemoveBookmark(currentBookmarkIds[index]!)}
                  >
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className={
                        currentBookmarkIds[index]
                          ? "text-yellow-500 hover:text-yellow-100"
                          : "hover:text-yellow-500"
                      }
                    />
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {currentBookmarkIds[index] ? "コレクションからはずす" : "コレクションに追加する"}
                  </div>
                </div>
              )}
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

export default IndexBookmarks;

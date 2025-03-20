import { useState, useMemo, startTransition  } from "react";
import HistoryCard from "./HistoryCard";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const IndexCutHistory = () => {
  const { cutCubeIds, glbUrls, cutPoints, createdAt, titles, memos, isStorageUser } = useGetCutCube();
  if (!glbUrls || !cutPoints || glbUrls.length !== cutPoints.length) return null;

  const itemsPerPage = 5;
  const totalItems = glbUrls.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { currentGlbUrls, currentCutPoints, currentCutCubeIds, currentCreatedAt, currentTitles, currentMemos } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    return {
      currentGlbUrls: glbUrls.slice(startIndex, endIndex),
      currentCutPoints: cutPoints.slice(startIndex, endIndex),
      currentCutCubeIds: cutCubeIds.slice(startIndex, endIndex),
      currentCreatedAt: createdAt.slice(startIndex, endIndex),
      currentTitles: titles.slice(startIndex, endIndex),
      currentMemos: memos.slice(startIndex, endIndex),
    };
  }, [currentPage, glbUrls, cutPoints, cutCubeIds, createdAt, titles, memos]);

  const handlePageClick = (selectedPage: number) => {
    if (selectedPage < 1 || selectedPage > totalPages + 1) return;
    startTransition(() => {
        setCurrentPage(selectedPage); // Transitionを使って非同期にページ遷移
      });
  };

  return (
    <div>
      {/* 切断履歴 */}
      <div className="m-4 items-center">
        <h1 className="text-2xl font-bold">切断履歴</h1>
        { isStorageUser ?
          <span className="text-red-500 text-xs flex mt-2 items-center">
            <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />
            <p>ログイン前 / Cookie 承認前の切断データは引き継げません。<br/>最大５つまで表示されます。<br/>データは保持されません。</p>
          </span>
        : ""}
      </div>
      <div className="space-y-4">
      { glbUrls.length === 0 ? <p className="m-4">履歴はありません</p>
      : currentGlbUrls.map((glbUrl, index) => (
          <HistoryCard
            key={index}
            cutCubeId={currentCutCubeIds[index]}
            glbUrl={glbUrl}
            cutPoints={currentCutPoints[index]}
            createdAt={currentCreatedAt[index]}
            title={currentTitles[index]}
            memo={currentMemos[index]}
          />
      ))}
      </div>

      {/* ページング*/}
      <div className="mt-4 flex justify-center space-x-4">
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

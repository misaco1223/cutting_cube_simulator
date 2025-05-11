import {useEffect, useState, useMemo, startTransition} from "react";
import BookmarkCard from "../../bookmark/BookmarkCard";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBookmark, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

export interface CreateStep1Props {
  cutCubeId: string | null;
  setCutCubeId: (cutCubeId: string) => void;
  cutCubeIds: string[];
  glbUrls: string[];
  cutPoints: THREE.Vector3[][];
  titles: string[];
  memos: string[];
  createdAt: string[];
  bookmarkIds: (string|null)[];
  cutFaceNames?: (string | null)[];
  volumeRatios?: (string | null)[];
  onNext: () => void;
}

const CreateStep1 = ({cutCubeId, setCutCubeId, cutCubeIds, glbUrls, cutPoints,titles, memos, createdAt, bookmarkIds, onNext, cutFaceNames, volumeRatios }:CreateStep1Props) => {
  const [ isOrbit, setIsOrbit ] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const initialId = query.get("id");

  useEffect(() => {
    if (initialId) {
      setCutCubeId(String(initialId));
    }
  }, [initialId]);

  //ページ処理
  const itemsPerPage = 12;
  const totalItems = glbUrls.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const { currentCutCubeIds, currentGlbUrls, currentCutPoints, currentCreatedAt, currentTitles, currentMemos, currentBookmarkIds, currentCutFaceNames, currentVolumeRatios } = useMemo(() => {
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
      currentCutFaceNames: cutFaceNames?.slice(startIndex, endIndex),
      currentVolumeRatios: volumeRatios?.slice(startIndex, endIndex)
    };
  }, [currentPage, glbUrls, cutPoints, cutCubeIds, createdAt, titles, memos, bookmarkIds, cutFaceNames, volumeRatios]);

  const handlePageClick = (selectedPage: number) => {
    if (selectedPage < 1 || selectedPage > totalPages + 1) return;
    startTransition(() => {
        setCurrentPage(selectedPage);
      });
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
    <div className="w-full p-4 md:p-12">
    <div className="m-4 mx-auto p-2 border-2 rounded-lg">
      <div className="m-4 items-center space-y-1 w-full">
        <h1>問題を作成する</h1>
        <p className="text-xl font-bold">step1: 切断を選択してください</p>
      </div>

      <div className="flex justify-end md:mr-4 mb-4 md:mb-0">
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

      {/* 切断カード一覧 */}
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4 md:m-4 min-w-0">
        { currentGlbUrls.length > 0 ? 
          (
            currentGlbUrls.map((glbUrl, index) => (
              <button
                key={index}
                onClick={(e) => setCutCubeId(currentCutCubeIds[index])}
                className={`border border-gray-200 px-2 py-6 rounded-lg shadow-md ${
                  cutCubeId === currentCutCubeIds[index] ? "bg-blue-400" : "hover:bg-blue-100"
                }`}
              >
                <div className="min-h-8">
                  <div className="flex justify-start space-x-2">
                    {currentCutFaceNames && currentCutFaceNames[index] && (
                      <span key={index} className="bg-blue-100 font-semibold text-gray-700 text-xs px-2 py-1"> {currentCutFaceNames[index]} </span>
                    )}
                    {currentVolumeRatios && currentVolumeRatios[index] && (
                      <span key={index} className="bg-pink-100 font-semibold text-gray-700 text-xs px-2 py-1"> {currentVolumeRatios[index]} </span>
                    )}
                  </div>
                </div>
                <div className="min-h-[300px] p-2">
                  <BookmarkCard
                    key={index}
                    glbUrl={glbUrl}
                    cutPoints={currentCutPoints[index]}
                    title={currentTitles[index]}
                    memo={currentMemos[index]}
                    isOrbit={isOrbit}
                  />
                </div>
                <div className="flex justify-between px-2">
                  <div className="flex justify-start">
                    <FontAwesomeIcon icon={faBookmark} className={currentBookmarkIds[index] ? "text-yellow-500 hover:text-yellow-100" :""}/>
                  </div>
                  <div className="flex justify-end px-2">
                    <p className="text-gray-500 text-xs">{formattedDate(currentCreatedAt[index])}</p>
                  </div>
                </div>
              </button>
            ))
          ):( <p className="m-4">切断履歴がありません</p>)
          }
        </div>

        {/* 次へボタン */}
        <div className="m-4 text-right">
          <button onClick={onNext} disabled={!cutCubeId}
            className={`px-4 py-2 text-white rounded-md ${
              cutCubeId ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
          >
            次へ
          </button>
        </div>
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

export default CreateStep1;

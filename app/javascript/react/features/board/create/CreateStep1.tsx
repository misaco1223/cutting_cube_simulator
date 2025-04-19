import {useEffect, useState} from "react";
import BookmarkCard from "../../bookmark/BookmarkCard";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
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
  onNext: () => void;
}

const CreateStep1 = ({cutCubeId, setCutCubeId, cutCubeIds, glbUrls, cutPoints,titles, memos, createdAt, onNext }:CreateStep1Props) => {
  const [ isOrbit, setIsOrbit ] = useState(false);

  const query = new URLSearchParams(useLocation().search);
  const initialId = query.get("id");

  useEffect(() => {
    if (initialId) {
      setCutCubeId(String(initialId));
    }
  }, [initialId]);

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
        { glbUrls.length > 0 ? 
          (
            glbUrls.map((glbUrl, index) => (
              <button
                key={index}
                onClick={(e) => setCutCubeId(cutCubeIds[index])}
                className={`border border-gray-200 px-2 py-6 rounded-lg shadow-md ${
                  cutCubeId === cutCubeIds[index] ? "bg-blue-400" : "hover:bg-blue-100"
                }`}
              >
                <BookmarkCard
                  key={index}
                  glbUrl={glbUrl}
                  cutPoints={cutPoints[index]}
                  createdAt={createdAt[index]}
                  title={titles[index]}
                  memo={memos[index]}
                  isOrbit={isOrbit}
                />
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
    </div>
  );
};

export default CreateStep1;

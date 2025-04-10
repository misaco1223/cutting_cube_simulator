import {useState} from "react";
import BookmarkCard from "../../bookmark/BookmarkCard";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHand, faPause } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="m-4 p-4 border-2 rounded-lg">
      <div className="m-4 items-center space-y-1 w-full">
        <h1>問題を作成する</h1>
        <p className="text-xl font-bold">step1: 切断を選択してください</p>
      </div>

      <div className="flex justify-end mr-4">
      {isOrbit ? (
        <button onClick={()=> setIsOrbit(false)} className="flex border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 回転モード中</span>
          <FontAwesomeIcon icon={faHand} className="mx-auto"/>
        </button>
      ):(
        <button onClick={()=> setIsOrbit(true)} className="flex border bg-gray-300 px-4 hover:bg-blue-300">
          <span className="mr-2 text-xs">立体: 固定モード中</span>
          <FontAwesomeIcon icon={faPause} className="mx-auto"/>
        </button>
      )}
      </div>

      {/* 切断カード一覧 */}
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-4 m-4 min-w-0">
        { glbUrls.length === 0 ? 
          ( <p className="m-4">切断履歴がありません</p>
          ):(
            glbUrls.map((glbUrl, index) => (
              <button
                key={index}
                onClick={(e) => setCutCubeId(cutCubeIds[index])}
                className={`border border-gray-200 px-2 py-6 rounded-lg shadow-md ${
                  cutCubeId === cutCubeIds[index] ? "bg-blue-400" : ""
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
          )}
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
  );
};

export default CreateStep1;

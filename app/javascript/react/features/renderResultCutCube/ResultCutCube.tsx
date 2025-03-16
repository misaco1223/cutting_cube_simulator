import { useState } from "react";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const ResultCutCube = ({ id }: { id: string | undefined }) => {
  const { glbUrl, cutPoints, title, memo, createdAt } = useGetCutCube(id);
  const [selectedGeometry, setSelectedGeometry] = useState<"all" | "geometry1" | "geometry2">("all");
  if (!glbUrl || !cutPoints) return null;

  const toggleGeometry = () => {
    if (selectedGeometry === "all") {
      setSelectedGeometry("geometry1");
    } else if (selectedGeometry === "geometry1") {
      setSelectedGeometry("geometry2");
    } else {
      setSelectedGeometry("all");
    }
  };

  return (
    <div>
      <div className="my-4 items-center">
        <h1 className="text-2xl font-bold">{title || "No Title"}</h1>
        <p className="text-sm">{memo}</p>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <span className="text-lg font-bold">
        {selectedGeometry === "all"
          ? "全体を表示中"
          : selectedGeometry === "geometry1"
          ? "立体1を表示中"
          : "立体2を表示中"
        }
        </span>
        <span><FontAwesomeIcon icon={faArrowRight} /></span>
        <button
          onClick={toggleGeometry}
          className="px-6 py-2 rounded-md text-white bg-red-500 hover:bg-red-400 transition-colors duration-200"
        >
          {selectedGeometry === "all"
            ? "立体1を見る"
            : selectedGeometry === "geometry1"
            ? "立体2を見る"
            : "全体を見る"}
        </button>
      </div>
      <div>
        <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry}/>
      </div>
    </div>
  );
};

export default ResultCutCube;

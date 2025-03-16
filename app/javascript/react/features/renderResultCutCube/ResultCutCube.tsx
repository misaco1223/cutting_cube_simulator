import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import CutCubeModel from "./CutCubeModel";
import { useGetCutCube } from "./useGetCutCube";

const ResultCutCube = ({ id }: { id: string | undefined }) => {
  const { glbUrl, cutPoints } = useGetCutCube(id);
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
        <span className="text-lg font-bold">
        {selectedGeometry === "all"
          ? "切断結果 全体を表示中"
          : selectedGeometry === "geometry1"
          ? "切断結果 立体1を表示中"
          : "切断結果 立体2を表示中"
        }
        </span>
      </div>
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
      <div>
        <CutCubeModel glbUrl={glbUrl} cutPoints={cutPoints} selectedGeometry={selectedGeometry}/>
      </div>
    </div>
  );
};

export default ResultCutCube;

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import CutCubeModel from "./CutCubeModel";
import { useGetGlbUrl } from "./useGetGlbUrl";

const ResultCutCube = ({ id }: { id: string | undefined }) => {
  const glbUrl = useGetGlbUrl(id);

  if (!glbUrl) return null;

  return (
    <div>
      <Canvas style={{ height: "300px" }}>
        <ambientLight intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50} />
        <gridHelper args={[10, 10, 0x000000, 0x888888]} position={[0, -1, 0]} />
        <OrbitControls />

        {/* GLTFで読み込んだ3Dモデル */}
        <CutCubeModel glbUrl={glbUrl} />
      </Canvas>
    </div>
  );
};

export default ResultCutCube;

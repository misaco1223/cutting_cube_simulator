import { useEffect, useMemo, useRef} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {vertices, vertexLabels} from "../../getCoordinates/types/ThreeScene";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"
import { Link } from "react-router-dom";

interface BoardProps {
  userName: string;
  boardId: string;
  cutPoints: THREE.Vector3[];
  createdAt: string;
  question: string;
  tag: string[];
  isOrbit: boolean;
}

const BoardCard = ({ boardId, cutPoints, question, isOrbit }: BoardProps) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const spheres = useMemo(() => {
    return cutPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color="#FF3333" />
      </mesh>
    ));
  }, [cutPoints]);

  useEffect(() => {
    if (!cutPoints) return;
    checkPointInfo(cutPoints);
  },[cutPoints]);

  const vertexLabelsMemo = useMemo(
    () =>
      vertices.map((vertex, index) => (
        <Text
          key={index}
          position={vertex}
          fontSize={0.2}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {vertexLabels[index]}
        </Text>
      )),
    []
  );

  function CustomCamera() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const { camera, set } = useThree()
  
    useEffect(() => {
      if (cameraRef.current) {
        set({ camera: cameraRef.current }) // makeDefault
        cameraRef.current.lookAt(0, 0, 0)
      }
    }, [])
  
    return (
      <PerspectiveCamera ref={cameraRef} position={[2, 2, 5]} fov={35} />
    )
  }

  return (
    <div className="p-4">
      {/*問題*/}
      <div className="mb-2 min-h-28">
        <Link to={`/board/${boardId}`}>
          <span className="text-sm font-semibold my-4">問題</span>
          <span className="text-md whitespace-pre-line line-clamp-3 overflow-hidden hover:text-blue-500 hover:underline">
            {question}
          </span>
        </Link>
        {/* 切断点情報
        {pointsInfo.map((pointInfo, index) => (
          <div key={index} className="w-full">
            {pointInfo.isVertex
            ? ( <div className="w-full flex space-x-1 text-xs">
                  <h3 className="my-auto">切断点 {index + 1}</h3>
                  <span className="p-1 my-auto">頂点 {pointInfo.vertexLabel}</span>
                </div>
            ):( <div className="w-full flex space-x-1 text-xs">
                  <h3 className="my-auto">切断点 {index + 1}</h3>
                  <span className="p-1 my-auto">辺 {pointInfo.edgeLabel}</span>
                  <span className="my-auto rounded text-center">{pointInfo.edgeRatio.left}</span>
                  <span className="my-auto"> : </span>
                  <span className="my-auto rounded text-center">{pointInfo.edgeRatio.right}</span>
                </div>
            )}
          </div>
        ))} */}
      </div>

      {/*切断前立体*/}
      <div style={{ height: "100%" , width: "100%" }} className={`mx-auto ${isOrbit ? "cursor-grab" : ""}`}>
        <Canvas style={{ height: "200px" }} className="border border-gray-500">
          <ambientLight intensity={0.3} />
          <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
          <CustomCamera />
          {isOrbit && <OrbitControls />}
          {/* 遠近感のあるグリッド */}
          <gridHelper args={[10, 10, 0x000000, 0x888888]} position={[0, -1, 0]}/>

          <mesh scale= {[2, 2, 2]} >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial transparent opacity={0.2} />
          </mesh>

          {spheres}
          {vertexLabelsMemo}
          <lineSegments scale={[2, 2, 2]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="black" />
          </lineSegments>
        </Canvas>
      </div>
    </div>
  );
};

export default BoardCard;
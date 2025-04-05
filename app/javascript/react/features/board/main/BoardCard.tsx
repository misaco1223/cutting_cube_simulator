import { useEffect, useMemo} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faQ } from "@fortawesome/free-solid-svg-icons";
import {vertices, vertexLabels} from "../../getCoordinates/types/ThreeScene";
import { useCheckPointsInfo} from "../../getCoordinates/hooks/useCheckPointsInfo"

interface BoardProps {
  userName: string;
  cutPoints: THREE.Vector3[];
  createdAt: string;
  question: string;
  tag: string;
}

const BoardCard = ({ userName, cutPoints, createdAt, question, tag }: BoardProps) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const spheres = useMemo(() => {
    return cutPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.08, 32, 32]} />
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

  const formattedDate = createdAt ? new Date(createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: undefined,
    hour12: false,
  }).replace(/\//g, "-")
  : "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];

  return (
    <div className="w-full p-4">
      {/*ヘッダー*/}
      <div className="flex space-x-2">
        {formattedDate>= todayString && <span className="bg-yellow-400 text-gray-600 text-xs p-1">NEW</span>}
        {tag && <span className="bg-orange-100 text-gray-600 text-xs p-1">{tag}</span>}
      </div>
      <div className="header my-4 text-md flex justify-between w-full">
        <div className="justify-start flex space-x-2">
          <FontAwesomeIcon icon={faCircleUser} size="lg" className="hover:text-gray-300 transition duration-300"/>
          <span className="justify-start text-md">{userName}さん</span>
        </div>
        <div className="justify-end mx-4 flex space-x-4">
          <p className="text-gray-500 my-auto text-xs">{formattedDate}</p>
        </div>
      </div>
      <div className="w-full">
        {/*切断前立体*/}
        <div style={{ height: "150px" , width: "75%" }} className="mx-auto">
          <Canvas style={{ height: "100%" }} className="border border-gray-500">
            <ambientLight intensity={0.3} />
            <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
            <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50} />
            <OrbitControls />
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
        {/*問題*/}
        <div className="mt-4 max-w-1/2">
          <h2 className="text-md my-2 font-bold whitespace-pre-line">
            <FontAwesomeIcon icon={faQ} className="mx-2"/>
            {question}
          </h2>
          {/*切断点情報*/}
          {pointsInfo.map((pointInfo, index) => (
            <div key={index} className="w-full">
              {pointInfo.isVertex
              ? ( <div className="w-full flex space-x-1">
                    <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                    <span className="p-1 my-auto">頂点 {pointInfo.vertexLabel}</span>
                  </div>
              ):( <div className="w-full flex space-x-1">
                    <h3 className="text-sm my-auto">切断点 {index + 1}</h3>
                    <span className="p-1 my-auto">辺 {pointInfo.edgeLabel}</span>
                    <span className="text-sm my-auto rounded text-center">{pointInfo.edgeRatio.left}</span>
                    <span className="my-auto"> : </span>
                    <span className="text-sm my-auto rounded text-center">{pointInfo.edgeRatio.right}</span>
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
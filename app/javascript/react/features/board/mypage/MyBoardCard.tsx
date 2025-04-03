import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {vertices, vertexLabels} from "../../getCoordinates/types/ThreeScene";

interface BoardProps {
    cutPoints: THREE.Vector3[];
    createdAt: string;
    question: string;
}

const MyBoardCard = ({ cutPoints, createdAt, question }: BoardProps) => {

  const spheres = useMemo(() => {
    return cutPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color="#FF3333" />
      </mesh>
    ));
  }, [cutPoints]);

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

  return (
    <div>
      <Canvas style={{ height: "150px" , width: "100%"}}>
        <ambientLight intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50} />
        <OrbitControls />

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
      <div className="p-4 w-full">
        <h2 className="text-md mb-2 line-clamp-3 overflow-hidden">{question}</h2>
        <p className="text-gray-500 text-xs">{formattedDate}</p>
      </div>
    </div>
  );
};

export default MyBoardCard;

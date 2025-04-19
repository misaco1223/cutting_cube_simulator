import { useMemo, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {vertices, vertexLabels} from "../../getCoordinates/types/ThreeScene";
import { Link } from "react-router-dom";

interface BoardProps {
    boardId: string;
    cutPoints: THREE.Vector3[];
    createdAt: string;
    question: string;
    tag: string[];
    isOrbit: boolean;
}

const MyBoardCard = ({ boardId, cutPoints, createdAt, question, tag, isOrbit }: BoardProps) => {

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
      <PerspectiveCamera ref={cameraRef} position={[2, 2, 5]} fov={50} />
    )
  }

  return (
    <div className="flex flex-col min-h-[300px]">
      <div className="mb-2 min-h-6">
      {tag && (
        <div className="flex flex-wrap gap-1">
          { tag.map((t, index) => (
            <span key={index} className="bg-orange-100 font-semibold text-gray-700 text-xs px-2 py-1"> {t} </span>
          ))}
        </div>
      )}
      </div>
      <Canvas style={{ height: "150px" , width: "100%"}}>
        <ambientLight intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
        <CustomCamera/>
        { isOrbit && <OrbitControls /> }

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
      <div className="p-4 w-full mb-auto">
        <Link to={`/board/${boardId}`} className="text-sm mb-2 font-semibold hover:text-blue-700 hover:underline line-clamp-3 overflow-hidden">{question}</Link>
      </div>
    </div>
  );
};

export default MyBoardCard;

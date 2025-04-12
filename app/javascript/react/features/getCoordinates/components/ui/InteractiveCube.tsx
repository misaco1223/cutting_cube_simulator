import {useState} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera,Text } from "@react-three/drei";
import ClickableEdges from "./ClickableEdges";
import * as THREE from "three";
import EditPointsForm from "./EditPointsForm";
import { vertices, vertexLabels, midpoints } from "../../types/ThreeScene";
import SendPointsButton from "./SendPointsButton";

const InteractiveCube = () => {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [isCollect, setIsCollect] = useState<{ [key: number]: boolean }>({});

  const handleEdgeClick = (clickedPoint: THREE.Vector3) => {
    setPoints((prevPoints) => [...prevPoints, clickedPoint]);
  };

  const handleUpdatePoints = (updatedPoints: THREE.Vector3[]) => {
    setPoints(updatedPoints);
  };

  return (
    <div>
      <Canvas style={{ height: '320px'}}>
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={40}/>

        {/* 遠近感のあるグリッド */}
        <gridHelper args={[10, 10, 0x000000, 0x888888]} position={[0, -1, 0]}/>
    
        <mesh scale= {[2, 2, 2]} >
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial transparent opacity={0.2} />
        </mesh>

        <ClickableEdges onClick={handleEdgeClick} />
  
        {points.map((point, index) => (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshBasicMaterial color="red"/>
            <Text fontSize={0.2} color="black" anchorX="left" anchorY="bottom">点{index+1}</Text>
          </mesh>
        ))}

        {vertices.map((vertex, index) => (
          <Text key={index} position={vertex} fontSize={0.2} color="black" anchorX="center" anchorY="middle"
          >
            {vertexLabels[index]}
          </Text>
        ))}

        {midpoints.map((midpoint, index) => (
          <>
          <mesh key={index} position={midpoint}>
            <sphereGeometry args={[0.02, 32, 32]} />
            <meshBasicMaterial color="black"/>
          </mesh>
          </>
        ))}

        <OrbitControls />
      </Canvas>

      <div className="my-6 w-full lg:w-1/2 md:w-3/4 mx-auto text-center">
        <SendPointsButton points={points} isCollect = {isCollect}/>
      </div>

      <div className="my-4 w-full lg:w-1/2 md:w-3/4 mx-auto">
        <EditPointsForm points={points} onUpdatePoints={handleUpdatePoints} isCollect={isCollect} setIsCollect={setIsCollect} />
      </div>
    </div>
  );
};

export default InteractiveCube;
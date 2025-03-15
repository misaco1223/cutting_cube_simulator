import React, {useState} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera,Text } from "@react-three/drei";
import ClickableEdges from "./ClickableEdges";
import * as THREE from "three";
import EditPointsForm from "./EditPointsForm";
import { vertices, vertexLabels } from "../../types/ThreeScene";
import SendPointsButton from "./SendPointsButton";

const InteractiveCube = () => {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);

  const handleEdgeClick = (clickedPoint: THREE.Vector3) => {
    setPoints((prevPoints) => [...prevPoints, clickedPoint]);
  };

  const handleUpdatePoints = (updatedPoints: THREE.Vector3[]) => {
    setPoints(updatedPoints);
  };

  return (
    <div>
      <Canvas style={{ height: '400px'}}>
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 0, 5]} />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50}/>

        {/* 遠近感のあるグリッド */}
        <gridHelper args={[10, 10, 0x000000, 0x888888]} position={[0, -1, 0]}/>
    
        <mesh scale= {[2, 2, 2]} >
          <boxGeometry args={[1, 1, 1]} />
          <meshNormalMaterial transparent opacity={0.2} />
        </mesh>

        <ClickableEdges onClick={handleEdgeClick} />
  
        {points.map((point, index) => (
          <mesh key={index} position={[point.x, point.y, point.z]}>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshBasicMaterial color="red" />
          </mesh>
        ))}

        {vertices.map((vertex, index) => (
          <Text key={index} position={vertex} fontSize={0.4} color="black" anchorX="center" anchorY="middle"
          >
            {vertexLabels[index]}
          </Text>
        ))}

        <OrbitControls />
      </Canvas>

      <div className="m-4">
        <SendPointsButton points={points}/>
      </div>

      <div className="m-4">
        <EditPointsForm points={points} onUpdatePoints={handleUpdatePoints} />
      </div>
    </div>
  );
};

export default InteractiveCube;
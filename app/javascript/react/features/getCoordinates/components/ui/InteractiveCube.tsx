import React, {useState} from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import ClickableEdges from "./ClickableEdges";
import * as THREE from "three";
import {InteractiveCubeProps} from '../types/ThreeScene';

const InteractiveCube = () => {
  const [clickedPoints, setPoints] = useState<THREE.Vector3[]>([]);

  {/* クリックした座標を表示してセットする関数 */}
  const handleEdgeClick = (clickedPoint: THREE.Vector3) => {
    setPoints((prevPoints) => [...prevPoints, clickedPoint]);
  };

  return (
    <>
    <ambientLight intensity={0.1} />
    <directionalLight color="white" position={[0, 0, 5]} />
    <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={75}/>
    
    {/* 立方体のメッシュ（可視化用、クリック不可） */}
    <mesh scale={[3,3,3]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial transparent opacity={0.2} />
    </mesh>

    {/* エッジをクリックできるようにする */}
    <ClickableEdges onClick={handleEdgeClick} />
    
    {/* クリックした座標に球を描画 */}
    {clickedPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
    ))}

    <OrbitControls />
    </>
  );
};

export default InteractiveCube;
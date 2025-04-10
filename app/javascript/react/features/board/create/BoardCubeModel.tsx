import { useMemo, useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {vertices, vertexLabels} from "../../getCoordinates/types/ThreeScene";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

interface BoardCubeProps {
  cutPoints: THREE.Vector3[];
  isOrbit: boolean;
}

const BoardCubeModel = ({cutPoints, isOrbit}: BoardCubeProps) => {

  const spheres = useMemo(() => {
    return cutPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color="#FF3333" />
        <Text fontSize={0.2} color="black" anchorX="left" anchorY="bottom">点{index+1}</Text>
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
    <div>
      <Canvas style={{ height: "300px" }} className="border border-gray-500">
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
  );
};

export default BoardCubeModel;

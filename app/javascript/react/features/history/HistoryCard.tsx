import { useEffect, useMemo} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import {vertices, vertexLabels} from "../getCoordinates/types/ThreeScene";

interface CutCubeProps {
    glbUrl: string;
    cutPoints: THREE.Vector3[];
    createdAt: string;
    title: string;
    memo: string;
}

const HistoryCard = ({ glbUrl, cutPoints, createdAt, title, memo }: CutCubeProps) => {
  const { scene } = useGLTF(glbUrl);

  useEffect(() => {
    let meshFound = false;
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        meshFound = true;  // Meshが見つかった場合はフラグをtrueに
  
        let material = new THREE.MeshBasicMaterial({ color: "white" });
  
        if (object.name === "Geometry001") {
          material.color.set("#B6FF01");
        } else if (object.name === "Geometry002") {
          material.color.set("#4689FF");
        }
  
        object.material = material;
  
        // エッジ（線）を追加
        const cutEdges = new THREE.EdgesGeometry(object.geometry, 0.1);
        const cutLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
        const cutLine = new THREE.LineSegments(cutEdges, cutLineMaterial);
        object.add(cutLine);
      }
    });
    // Meshが一度も見つからなかった場合
    if (meshFound === false) {
      window.location.reload();
    }
  
  }, [scene]);

  const spheres = useMemo(() => {
    return cutPoints.map((point, index) => (
      <mesh key={index} position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshStandardMaterial color="#FF3333" />
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

  const transformedCreatedAt = new Date(createdAt);
const formattedCreatedAt = `${transformedCreatedAt.getFullYear()}年${transformedCreatedAt.getMonth() + 1}月${transformedCreatedAt.getDate()}日`;

  return (
    <div className="w-full flex border border-gray-200 px-2 py-6 rounded-lg shadow-md">
      <div style={{ height: "150px" , width: "200px" }}>
      <Canvas>
        <ambientLight intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50} />
        <OrbitControls />

        {spheres}
        {vertexLabelsMemo}
        <lineSegments scale={[2, 2, 2]}>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
          <lineBasicMaterial color="black" />
        </lineSegments>
        <primitive object={scene} />
      </Canvas>
      </div>
      <div className="w-full">
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-500">{memo}</p>
        <p className="text-gray-500">{formattedCreatedAt}作成</p>
      </div>
    </div>
  );
};

export default HistoryCard;

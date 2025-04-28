import { useEffect, useMemo, useRef} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";
import {vertices, vertexLabels} from "../getCoordinates/types/ThreeScene";
import { useNavigate } from "react-router-dom";

interface BookmarkProps {
    cutCubeId?: string;
    glbUrl: string;
    cutPoints: THREE.Vector3[];
    title: string;
    memo: string;
    isOrbit: boolean;
}

const BookmarkCard = ({ cutCubeId, glbUrl, cutPoints, title, memo, isOrbit }: BookmarkProps) => {
  const { scene } = useGLTF(glbUrl);
  const navigate = useNavigate();

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
  };

  return (
    <div>
      <div style={{ height: "150px" , width: "100%"}}>
        <Canvas>
            <ambientLight intensity={0.3} />
            <directionalLight color="white" position={[0, 0, 5]} intensity={1} />
            <CustomCamera />
            {isOrbit && <OrbitControls />}

            {spheres}
            {vertexLabelsMemo}
            <lineSegments scale={[2, 2, 2]}>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial color="black" />
            </lineSegments>
            <primitive object={scene} />
        </Canvas>
      </div>
      <div className="p-4 w-full">
        <button onClick={()=> navigate(`/result/${cutCubeId}`)}  disabled={!cutCubeId} className="text-sm font-semibold mb-2 hover:text-blue-700 hover:underline">{title || "No Title"}</button>
        <p className="text-gray-500 my-2 text-sm line-clamp-3 mt-2 overflow-hidden">{memo}</p>
      </div>
    </div>
  );
};

export default BookmarkCard;

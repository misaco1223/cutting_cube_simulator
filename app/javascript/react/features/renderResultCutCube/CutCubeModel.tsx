import { useEffect, useMemo, useState, useRef } from "react";
import { useGLTF, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {vertices, vertexLabels} from "../getCoordinates/types/ThreeScene";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

interface CutCubeProps {
    glbUrl: string;
    cutPoints: THREE.Vector3[];
    selectedGeometry: "all" | "geometry1" | "geometry2";
    isOrbit: boolean;
}

const CutCubeModel = ({ glbUrl, cutPoints, selectedGeometry, isOrbit }: CutCubeProps) => {
  const { scene } = useGLTF(glbUrl);
  const [ref1, setRef1] = useState<THREE.Mesh | null>(null);
  const [ref2, setRef2] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        let material = new THREE.MeshBasicMaterial({ color: "white" });

        if (object.name === "Geometry001") {
          material.color.set("#B6FF01");
          setRef1(object); // ref1の更新
        } else if (object.name === "Geometry002") {
          material.color.set("#4689FF");
          setRef2(object); // ref2の更新
        }

        object.material = material;

        // エッジ（線）を追加
        const cutEdges = new THREE.EdgesGeometry(object.geometry, 0.1);
        const cutLineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
        const cutLine = new THREE.LineSegments(cutEdges, cutLineMaterial);
        object.add(cutLine);
      }
    });
  }, [scene]);

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
    <div className="h-full">
      <Canvas style={{ height: "100%" }} className="mx-auto border border-gray-500">
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
          {selectedGeometry === "all" || selectedGeometry === "geometry1" ? (
            ref1 && <primitive object={ref1} /> // ref1がnullでない場合のみ表示
          ) : null}
            {selectedGeometry === "all" || selectedGeometry === "geometry2" ? (
                ref2 && <primitive object={ref2} /> // ref2がnullでない場合のみ表示
          ) : null}
      </Canvas>
    </div>
  );
};

export default CutCubeModel;

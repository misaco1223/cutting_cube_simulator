import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const CutCubeModel = ({ glbUrl }: { glbUrl: string }) => {
  const { scene } = useGLTF(glbUrl);

  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
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

  return <primitive object={scene} />;
};

export default CutCubeModel;

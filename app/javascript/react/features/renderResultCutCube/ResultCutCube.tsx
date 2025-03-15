import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const ResultCutCube = ({ id }: { id: string | undefined }) => {
  const [glbUrl, setGlbUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCutCube = async (id: string | undefined) => {
    if (!id) return;
    try {
      const response = await fetch(`/api/cut_cube/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("通信に失敗しました");

      const data = await response.json();
      if (data.glb_url) {
        setGlbUrl(data.glb_url); // GLBファイルのURLを設定
      }
    } catch (error) {
      console.error("cut_cubeの取得に失敗しました", error);
    }
    };

    fetchCutCube(id); // idを基にデータを取得
  }, [id]);

  if (glbUrl === null ) return null;
  const { scene } = useGLTF(glbUrl);

  return (
    <div>
      <Canvas style={{ height: '300px' }}>
        <ambientLight intensity={0.3} />
        <directionalLight color="white" position={[0, 0, 5]} intensity={1}  />
        <PerspectiveCamera makeDefault position={[2, 2, 5]} fov={50} />
        <gridHelper args={[10, 10, 0x000000, 0x888888]} position={[0, -1, 0]} />
        <OrbitControls />

        {/* GLTFで読み込んだ3Dモデル */}
        <primitive object={scene} />
      </Canvas>
    </div>
  );
};

export default ResultCutCube;
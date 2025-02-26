import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {ClickableEdgesProps} from '../../types/ThreeScene';

const ClickableEdges = ({ onClick }: ClickableEdgesProps ) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const { camera, gl, scene } = useThree();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // マウスクリック時に Raycaster を使用
  const handleMouseClick = (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.params.Line = { threshold: 0.1 };

    const intersects = lineRef.current ? raycaster.intersectObject(lineRef.current): [];
    if (intersects.length > 0) {
      const clickedPoint = intersects[0].point;
      // console.log("交差した座標:", clickedPoint);

      // 小数第4位に丸める関数
      const roundToFourDecimals = (num: number) => Math.round(num * 10000) / 10000;

    // 各座標を丸める
      const roundedPoint = new THREE.Vector3(
      roundToFourDecimals(clickedPoint.x),
      roundToFourDecimals(clickedPoint.y),
      roundToFourDecimals(clickedPoint.z)
    );
      onClick(roundedPoint);
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener("click", handleMouseClick);
    return () => {
      gl.domElement.removeEventListener("click", handleMouseClick);
    };
  },[gl.domElement, handleMouseClick]);

  return (
    <lineSegments scale= {[2, 2, 2]} ref={lineRef}>
      <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
      <lineBasicMaterial color="black" />
    </lineSegments>
  );
};

export default ClickableEdges;
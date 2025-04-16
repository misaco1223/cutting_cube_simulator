import {useState, useEffect} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera,Text } from "@react-three/drei";
import ClickableEdges from "./ClickableEdges";
import * as THREE from "three";
import EditPointsForm from "./EditPointsForm";
import { vertices, vertexLabels, midpoints, edges, faces } from "../../types/ThreeScene";
import SendPointsButton from "./SendPointsButton";
import { isPointOnEdge } from "../../hooks/isPointOnEdge";

const InteractiveCube = () => {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const [isCollect, setIsCollect] = useState<{ [key: number]: boolean }>({});
  const [edgeValidate, setEdgeValidate] = useState<number[]>([]);
  const [nonEdgeValidate, setNonEdgeValidate] = useState<number[]>([]);
  const [isEdgeValidateReady, setisEdgeValidateReady] = useState(false);

  const handleEdgeClick = (clickedPoint: THREE.Vector3) => {
    setPoints((prevPoints) => [...prevPoints, clickedPoint]);
    setisEdgeValidateReady(false);
  };

  const handleUpdatePoints = (updatedPoints: THREE.Vector3[]) => {
    setPoints(updatedPoints);
    setisEdgeValidateReady(false);
  };

  useEffect(() => {
    if (points.length === 0) return;
  
    // matchedEdgesを空で準備する
    const matchedEdges: [THREE.Vector3, THREE.Vector3][] = [];
  
    // 1つ目の点は、辺のチェックのみ行う
    if (points.length === 1) {
      edges.forEach((edge) => {
        points.map((point) => {
          // 頂点の時は辺のバリデーションをしない
          if (vertices.some(v => v.equals(point))) return;
          const { isCollinear } = isPointOnEdge(point, edge);
          if (isCollinear) {
            matchedEdges.push(edge);
          }
        });
      });

    // 点が2つ以上ある時、同一平面上のチェックと辺のチェックを行う
    } else {
      // 同一平面に全ての点がある時trueを返して、その面の辺をmatchedEdgesに追加する
      faces.forEach((face) => {
        const allPointsOnSameFace = points.every((point) =>
          face.some((edge) => {
            const { isCollinear } = isPointOnEdge(point, edge);
            return isCollinear;
          })
        );
        if (allPointsOnSameFace) {
          face.forEach((edge) => { matchedEdges.push(edge)})
        }
      })

      // 同一平面上でなかった時、それぞれの点について辺を調べて追加する。
      if (matchedEdges.length === 0){
        edges.forEach((edge) => {
          points.map((point) => {
            if (vertices.some(v => v.equals(point))) return;
            const { isCollinear } = isPointOnEdge(point, edge);
            if (isCollinear) {
              matchedEdges.push(edge);
            }
          });
        });
      }
    }

    // lignsegmentsに渡せる形式に変換する
    const highlightedEdges = matchedEdges.flatMap(([start, end]) => [
      start.x, start.y, start.z,
      end.x, end.y, end.z
    ]);

    // バリデーションなしの辺を取得する
    const nonMatchedEdges = edges.filter(edge =>
      !matchedEdges.some(m =>
        (edge[0].equals(m[0]) && edge[1].equals(m[1])) ||
        (edge[0].equals(m[1]) && edge[1].equals(m[0]))
      )
    );
    
    // lignsegmentsに渡せる形式に変換する
    const nonHighlightedEdges= nonMatchedEdges.flatMap(
      ([start, end]) => [...start.toArray(), ...end.toArray()]
    )

    // EdgeValidateに配列をセットし、準備OKにする
    if (matchedEdges.length > 0 && highlightedEdges.length + nonHighlightedEdges.length === 72) {
      setEdgeValidate(highlightedEdges);
      setNonEdgeValidate(nonHighlightedEdges);
      setisEdgeValidateReady(true);
    }

  }, [points]);

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

        <ClickableEdges 
          onClick={handleEdgeClick}
          highlightedEdges={isEdgeValidateReady ? (edgeValidate ?? []) : []}
          nonHighlightedEdges={isEdgeValidateReady ? (nonEdgeValidate ?? []) : []}   />
  
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
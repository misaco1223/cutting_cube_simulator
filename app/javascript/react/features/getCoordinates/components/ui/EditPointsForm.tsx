import React, { useEffect,useState } from "react";
import {EditPointsFormProps} from '../../types/ThreeScene';
import { useCheckPointsInfo } from '../../hooks/useCheckPointsInfo';
import * as THREE from 'three';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotate } from '@fortawesome/free-solid-svg-icons';
import { calculateRatioToPoint } from "../../hooks/calculateRatioToPoint";

const EditPointsForm = ( {points, onUpdatePoints}: EditPointsFormProps) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [leftRatios, setLeftRatios] = useState<{ [key: number]: string }>({});
  const [rightRatios, setRightRatios] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    checkPointInfo(points);
    console.log("pointsは:", points);
  }, [points, checkPointInfo]);

  useEffect(() => {
    console.log("pointsInfo が更新されました:", pointsInfo);
    const extractedPoints = pointsInfo.map(info => info.point);
    console.log("extractedPoints:", extractedPoints);
    
    const isDifferent = points.some((point, index) => {
      const extracted = extractedPoints[index];
      return !extracted || point.x !== extracted.x || point.y !== extracted.y || point.z !== extracted.z;
    });

    if (isDifferent) {
      console.log("pointsとpointsInfoに違いがあったので修正しました")
      onUpdatePoints(extractedPoints);
    }
  }, [pointsInfo]);
  

  const handleInputChange = ( index: number, axis: "x" | "y" | "z", value: string ) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value);
    onUpdatePoints(newPoints);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onUpdatePoints(newPoints);
  };

  const handleLeftRatioChange = (index: number, value: string) => {
    setLeftRatios((prev) => ({ ...prev, [index]: value }));
  };

  const handleRightRatioChange = (index: number, value: string) => {
    setRightRatios((prev) => ({ ...prev, [index]: value }));
  };

  const handleUpdateRatio = (index: number) => {
    const left = leftRatios[index]|| "1";
    const right = rightRatios[index] || "1";
    const edgeLabel = pointsInfo[index].edgeLabel

    const{ point } = calculateRatioToPoint(left, right, edgeLabel);
    if (!point ) return;

    const newPoints= [...points];
    newPoints[index] = point;
    onUpdatePoints(newPoints);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-sm mb-2">選択した切断点</h2>
      {pointsInfo.map((pointInfo, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold">
            {pointInfo.isVertex ? `切断点 ${index + 1}:頂点 ${pointInfo.vertexLabel}`: `切断点 ${index + 1}: 辺 ${pointInfo.edgeLabel}`}
          </h3>
          <div className="flex space-x-2">
            <div className="space-y-1">
              <div className="flex space-x-2">
                <label>
                  X:  
                  <input
                    type="number"
                    value={pointInfo.point.x}
                    onChange={(e) => handleInputChange(index, 'x', e.target.value)}
                    className="border p-1 rounded w-20 ml-2"
                  />
                </label>
                <label>
                  Y: 
                  <input
                    type="number"
                    value={pointInfo.point.y}
                    onChange={(e) => handleInputChange(index, 'y', e.target.value)}
                    className="border p-1 rounded w-20 ml-2"
                  />
                </label>
                <label>
                  Z: 
                  <input
                    type="number"
                    value={pointInfo.point.z}
                    onChange={(e) => handleInputChange(index, 'z', e.target.value)}
                    className="border p-1 rounded w-20 ml-2"
                  />
                </label>
              </div>
              <div>
                <span>比</span>
                <label>
                  <input
                    type="text"
                    value={leftRatios[index] ?? pointInfo.edgeRatio.left}
                    onChange={(e) => handleLeftRatioChange(index, e.target.value)}
                    className="border p-1 rounded w-20 mx-2 text-center"
                  />
                </label>
                <span> : </span>
                <label>
                  <input
                    type="text"
                    value={rightRatios[index] ?? pointInfo.edgeRatio.right}
                    onChange={(e) => handleRightRatioChange(index, e.target.value)}
                    className="border p-1 rounded w-20 ml-2 text-center"
                  />
                </label>
                <button
                onClick={() => handleUpdateRatio(index)}
                className="mt-2 ml-4 hover:text-blue-500"
                >
                  更新する<FontAwesomeIcon icon={faRotate} />
                </button>
              </div>
            </div>
            <div>
              <button 
                onClick={() => handleRemovePoint(index)} 
                className="mt-2 ml-4 hover:text-red-600"
              >
                削除する<FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
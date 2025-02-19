import React, { useEffect } from "react";
import {EditPointsFormProps} from '../../types/ThreeScene';
import { useCheckPointsInfo } from '../../hooks/useCheckPointsInfo';

const EditPointsForm = ( {points, onUpdatePoints}: EditPointsFormProps) => {

  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();

  useEffect(() => {
    checkPointInfo(points);
  }, [points, checkPointInfo]);
  

  const handleInputChange = ( index: number, axis: "x" | "y" | "z", value: string ) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value);
    onUpdatePoints(newPoints);
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
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
                { pointInfo.edgeRatio && (
                  <label>
                    <span>比</span>
                    <input
                      type="text"
                      value={pointInfo.edgeRatio}
                      readOnly
                      className="border p-1 rounded w-40 ml-2 text-center"
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <button 
                onClick={() => handleRemovePoint(index)} 
                className="mt-2 ml-4 hover:text-red-600"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
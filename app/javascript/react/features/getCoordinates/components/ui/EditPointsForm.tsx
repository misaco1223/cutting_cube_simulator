import React, { useEffect } from "react";
import {EditPointsFormProps} from '../../types/ThreeScene';
import { useCheckVertex } from '../../hooks/useCheckVertex';

const EditPointsForm = ( {points, onUpdatePoints}: EditPointsFormProps) => {

  const {pointsInfo, checkVertex } = useCheckVertex();

  useEffect(() => {
    checkVertex(points);
  }, [points, checkVertex]);
  

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
            {pointInfo.isVertex ? `切断点 ${index + 1}  頂点 ${pointInfo.vertexLabel}`: `切断点 ${index + 1}`}
          </h3>
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

            <button 
              onClick={() => handleRemovePoint(index)} 
              className="mt-2 ml-6 hover:text-red-600"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
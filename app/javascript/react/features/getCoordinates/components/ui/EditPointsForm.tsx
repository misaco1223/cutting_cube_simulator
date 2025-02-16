import React, { useRef } from "react";
import {EditPointsFormProps} from '../types/ThreeScene';

const EditPointsForm = ( {points, onUpdatePoints}: EditPointsFormProps) => {
  const handleInputChange = ( index: number, axis: "x" | "y" | "z", value: string ) => {
    const newPoints = [...points];
    newPoints[index][axis] = parseFloat(value);
    onUpdatePoints(newPoints);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-sm mb-2">選択した切断点</h2>
      {points.map((point, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-semibold">切断点 {index + 1}</h3>
          <div className="flex space-x-2">
            <label>
              X:  
              <input
                type="number"
                value={point.x}
                onChange={(e) => handleInputChange(index, 'x', e.target.value)}
                className="border p-1 rounded w-20 ml-2"
              />
            </label>
            <label>
              Y: 
              <input
                type="number"
                value={point.y}
                onChange={(e) => handleInputChange(index, 'y', e.target.value)}
                className="border p-1 rounded w-20 ml-2"
              />
            </label>
            <label>
              Z: 
              <input
                type="number"
                value={point.z}
                onChange={(e) => handleInputChange(index, 'z', e.target.value)}
                className="border p-1 rounded w-20 ml-2"
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
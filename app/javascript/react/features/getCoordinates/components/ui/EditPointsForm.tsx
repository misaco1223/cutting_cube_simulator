import { useEffect,useState } from "react";
import {EditPointsFormProps} from '../../types/ThreeScene';
import { useCheckPointsInfo } from '../../hooks/useCheckPointsInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotate, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { calculateRatioToPoint } from "../../hooks/calculateRatioToPoint";

const EditPointsForm = ( {points, onUpdatePoints, isCollect, setIsCollect}: EditPointsFormProps) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [leftRatios, setLeftRatios] = useState<{ [key: number]: string }>({});
  const [rightRatios, setRightRatios] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    checkPointInfo(points);
    console.log("pointsは:", points);
    
      if (Object.keys(isCollect).length !== points.length) {
      setIsCollect((prev) => {
        const newCollect = { ...prev };
  
        // isCollectがpointsより少ない場合、足りない分を `true` で埋める
        for (let i = Object.keys(newCollect).length; i < points.length; i++) {
          newCollect[i] = true;
        }
  
        return newCollect;
      }); // 更新されたisCollectをセット
  }
    
  }, [points, checkPointInfo, isCollect, setIsCollect]);

  useEffect(() => {
    console.log("pointsInfo が更新されました:", pointsInfo);
    const extractedPoints = pointsInfo.map(info => info.point);
    console.log("extractedPoints:", extractedPoints);
    console.log("isCollectの状態は:", isCollect);
    
    const isDifferent = points.some((point, index) => {
      const extracted = extractedPoints[index];
      return !extracted || point.x !== extracted.x || point.y !== extracted.y || point.z !== extracted.z;
    });

    if (isDifferent) {
      console.log("pointsとpointsInfoに違いがあったので修正しました")
      onUpdatePoints(extractedPoints);
    }
  }, [pointsInfo]);

  const handleRemovePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onUpdatePoints(newPoints);

    const reindexObject = (obj: { [key: number]: any }) => {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([key]) => Number(key) !== index) // 指定された index を削除
          .sort(([a], [b]) => Number(a) - Number(b)) // 元の順序を保持
          .map(([_, value], newIndex) => [newIndex, value]) // 0から再インデックス
      );
    };

    setLeftRatios((prev) => reindexObject(prev));
    setRightRatios((prev) => reindexObject(prev));
    setIsCollect((prev) => reindexObject(prev));
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
    setIsCollect((prev) => ({ ...prev, [index]: true}));
  };

  return (
    <div>
      {pointsInfo.map((pointInfo, index) => (
        <div key={index} className="w-full p-4 mb-2 rounded-sm border">
          <h3 className="w-full text-sm mb-2">切断点 {index + 1}</h3>
          <div className="w-full flex space-x-2 justify-between">
            <div className="w-full flex justify-start space-x-2 ">
              {pointInfo.isVertex
              ? ( <span className="font-semibold w-16 my-auto">頂点 {pointInfo.vertexLabel}</span> )
              : ( <>
                    <span className="font-semibold w-16 flex my-auto">辺 {pointInfo.edgeLabel}</span>
                    <div className="flex w-full my-auto">
                      <span className="my-auto">比</span>
                      <label className="text-sm">
                        <input
                          type="text"
                          value={leftRatios[index] ?? pointInfo.edgeRatio.left}
                          onChange={(e) => {
                            setLeftRatios((prev) => ({ ...prev, [index]: e.target.value }));
                            setIsCollect((prev) => ({ ...prev, [index]: false }));
                          }}
                          className="border p-1 rounded w-20 mx-2 text-center"
                        />
                      </label>
                      <span> : </span>
                      <label className="text-sm">
                        <input
                          type="text"
                          value={rightRatios[index] ?? pointInfo.edgeRatio.right}
                          onChange={(e) => {
                            setRightRatios((prev) => ({ ...prev, [index]: e.target.value }));
                            setIsCollect((prev) => ({ ...prev, [index]: false }));
                          }}
                          className="border p-1 rounded w-20 ml-2 text-center"
                        />
                      </label>
                    </div>
                  </>
              )}
            </div>
            <div className="w-full flex justify-end">
              <div className="w-full flex space-x-4 justify-end">
                <>
                {isCollect[index]
                  ? ( <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 my-auto" /> )
                  : ( <button
                      onClick={() => handleUpdateRatio(index)}
                      className="flex flex-col hover:text-blue-500"
                    >
                      <FontAwesomeIcon icon={faRotate} />
                      <span className="text-xs mx-auto text-gray-600">更新</span>
                    </button>
                )}
                </>
                <button 
                  onClick={() => handleRemovePoint(index)} 
                  className="hover:text-red-600"
                  >
                  <FontAwesomeIcon icon={faTrashCan}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
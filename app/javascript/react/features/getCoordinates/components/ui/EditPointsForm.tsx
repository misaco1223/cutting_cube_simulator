import { useEffect,useState } from "react";
import {EditPointsFormProps} from '../../types/ThreeScene';
import { useCheckPointsInfo } from '../../hooks/useCheckPointsInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faRotate, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { calculateRatioToPoint } from "../../hooks/calculateRatioToPoint";
import PointDropdown from "../PointDropDown";

const EditPointsForm = ( {points, onUpdatePoints, isCollect, setIsCollect}: EditPointsFormProps) => {
  const {pointsInfo, checkPointInfo } = useCheckPointsInfo();
  const [leftRatios, setLeftRatios] = useState<{ [key: number]: string }>({}); //手入力を保持
  const [rightRatios, setRightRatios] = useState<{ [key: number]: string }>({}); //手入力を保持

  // pointの変更時に、pointInfo(ポイント詳細)を更新する。
  // pointInfoは、頂点判定isVertexと中点判定isMidpointと辺の比の情報edgeRatioなどを含んでいる。
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

  // pointInfo(ポイント詳細)が点を修正している場合、pointをそれに合わせる
  // 新規に追加されたpointについて、isCollect状態をpointInfoの状態に応じて追加する
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

  // 点の削除ボタン
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

  // 点の更新ボタン
  const handleUpdateRatio = (index: number, left: string, right: string) => {
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
        <div key={index} className="p-4 mb-2 rounded-sm border">
          {/*ヘッダーと更新状態*/}
          <div className="flex space-x-4 mb-2">
            <h3 className="text-sm">切断点 {index + 1}</h3>
            {isCollect[index]
              ? ( <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 my-auto" /> )
              : ( <FontAwesomeIcon icon={faCircleCheck} className="text-gray-200 my-auto" />
            )}
          </div>

          {/*メイン*/}
          <div className="w-full flex justify-between">
            {/*左側 切断点情報*/}
            <div className="w-full flex justify-start space-x-2 ">
              {pointInfo.isVertex
              ? ( 
                //頂点の時
                <span className="font-semibold w-16 my-auto">頂点 {pointInfo.vertexLabel}</span>
              ):( 
                // 中点または辺上の点の時
                <>
                <span className="font-semibold w-16 flex my-auto">辺 {pointInfo.edgeLabel}</span>
                <div className="flex w-full my-auto">
                  <PointDropdown
                    index={index}
                    leftRatio = {leftRatios[index]}
                    rightRatio = {rightRatios[index]}
                    setLeftRatio = {(index:number, left:string) => setLeftRatios((prev) => ({ ...prev, [index]: left }))}
                    setRightRatio = {(index:number, right:string) => setRightRatios((prev) => ({ ...prev, [index]: right }))}
                    pointInfoRatio ={{left: pointInfo.edgeRatio.left, right: pointInfo.edgeRatio.right}}
                    handleUpdateRatio = {(index, left, right)=> handleUpdateRatio(index, left, right)}
                    setIsCollect = {(index, value) => setIsCollect((prev) => ({ ...prev, [index]: value}))}
                  />
                </div>
                </>
              )}
            </div>
            {/*右側 削除ボタン*/}
            <div className="w-24 flex justify-end">
              <button 
                onClick={() => handleRemovePoint(index)} 
                className="hover:text-red-600"
                >
                <FontAwesomeIcon icon={faTrashCan}/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditPointsForm;
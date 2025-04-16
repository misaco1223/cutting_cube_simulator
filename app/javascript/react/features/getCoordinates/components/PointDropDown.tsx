import {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface PointDropDownProps {
  index: number;
  leftRatio: string;
  rightRatio: string;
  setLeftRatio: (index: number, left: string) => void;
  setRightRatio: (index:number, right:string) => void;
  pointInfoRatio: ({left: string, right:string});
  handleUpdateRatio: (index:number, left: string, right: string) => void;
  setIsCollect: (index:number, value:boolean) => void;
};

const PointDropdown = ({ index, leftRatio, rightRatio, setLeftRatio, setRightRatio, pointInfoRatio, handleUpdateRatio, setIsCollect}: PointDropDownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ratioTags = ["1  :  1", "1  :  2", "2  :  1", "1  :  3", "3  :  1"];

  const handleSelectRatioTag = (ratioTag: string) => {
    const [left, right] = ratioTag.split(":");
    setLeftRatio(index, left);
    setRightRatio(index, right);
    handleUpdateRatio(index, left, right); 
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-60 bg-gray-200 border border-gray-300 inline-block text-left">
      <button
        type="button"
        onClick={() => {setIsOpen(!isOpen); setIsCollect(index,false);}}
        className="inline-flex justify-between w-full px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <span className="justify-start">比</span>
        {leftRatio && rightRatio
        ? `${leftRatio} : ${rightRatio}`
        : pointInfoRatio.left && pointInfoRatio.right
        ? `${pointInfoRatio.left} : ${pointInfoRatio.right}`
        : "比を選択してください"}
        <FontAwesomeIcon icon={faCaretDown} className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`absolute right-0 w-full flex flex-col space-y-1 p-2 bg-white z-50 ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-40 ${isOpen ? "" : "hidden"}`}>
        {/*タグから選択*/}
        {ratioTags.map((ratioTag, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectRatioTag(ratioTag)}
            className="w-full text-gray-700 px-4 py-2 text-sm hover:bg-gray-100"
          >
            {ratioTag}
          </button>
        ))}

        {/* 手動入力欄 */}
        <div className="flex w-full items-center space-x-2 mt-2">
          <input
            type="text"
            value={leftRatio ?? pointInfoRatio.left}
            onChange={(e) => {setLeftRatio(index, e.target.value); setIsCollect(index, false);}}
            className="min-w-0 flex-1 border p-1 text-center text-sm"
          />
          <span className="text-sm">:</span>
          <input
            type="text"
            value={rightRatio ?? pointInfoRatio.right }
            onChange={(e) => {setRightRatio(index, e.target.value); setIsCollect(index, false);}}
            className="min-w-0 flex-1 border p-1 text-center text-sm"
          />
          <button
            onClick={()=> {handleUpdateRatio(index, leftRatio ?? pointInfoRatio.left, rightRatio ?? pointInfoRatio.right); setIsOpen(false);}}
            className="min-w-0 text-sm px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 whitespace-nowrap"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDropdown;
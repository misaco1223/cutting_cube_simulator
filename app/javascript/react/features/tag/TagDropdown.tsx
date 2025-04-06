import {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface TagDropDownProps {
  selectedTags: string[] | null;
  setSelectedTags: (e: string[]) => void;
};

const TagDropdown = ({selectedTags, setSelectedTags}:TagDropDownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const tags= ["基礎", "応用", "5年", "6年前期", "6年後期"]

  const handleAddTags= (tag:string) =>{
    if (!selectedTags) return;
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  return (
      <div className="flex">
        <span className="border border-gray-300 text-sm p-2">タグ</span>
        <div className="relative border  border-gray-300 inline-block text-left">
        <button
            type="button"
            onClick={()=>setIsOpen(!isOpen)}
            className="inline-flex justify-center px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
        >
            選択
            <FontAwesomeIcon icon={faCaretDown}className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}  />
        </button>
        {/*タグ内容*/}
        <div
            className={`origin-top-right absolute right-0 mt-2 bg-white z-50 ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? "" : "hidden"}`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
        >
          <div className="flex-col space-y-1" role="none">
            {tags.map((tag) => (
                <button
                key={tag}
                onClick={() => {handleAddTags(tag); setIsOpen((prev) => !prev);}}
                className="w-full text-gray-700 px-auto py-2 text-sm"
                role="menuitem"
                tabIndex={-1}
                >
                {tag}
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagDropdown;

import {useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faBell, faThumbsUp, faFire, faFolderClosed, faTags, faCircleXmark} from "@fortawesome/free-solid-svg-icons";

interface BoardsSideBarProps {
    filter: string | null;
    setFilter: (f: string | null) => void;
  }

const BoardsSideBar = ({ filter, setFilter }: BoardsSideBarProps) => {
  const [ isSideBarOpen, setIsSideBarOpen ] = useState<boolean>(true);
  const filters = ["新着順", "人気順", "タグ別", "いいね", "キープ"];
  const tags = ["基礎", "応用", "5年", "6年前期", "6年後期"];
  const [ isTagMenuOpen, setIsTagMenuOpen ] = useState<boolean>(false);

  return (
    <div className={`relative`}>
    <div className={`sticky top-0 w-[60px] px-1 py-4 border-r border-gray-300 bg-gray-700 text-white ${!isSideBarOpen && "hidden"}`}>
        <div className="relative group text-center">
          <button 
              onClick={()=>setIsSideBarOpen(!isSideBarOpen)}
              className="text-lg font-semibold mb-4 text-center"
          ><FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <div className="absolute bottom-full left-12 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
            サイドバーをとじる
          </div>
        </div>
        <ul className="space-y-6">
        <li>
            <button
            onClick={() => setFilter(filters[0])}
            className={`hover:underline flex flex-col space-y-1 mx-auto ${filter === filters[0] ? "text-yellow-300" : ""}`}
            >
            <FontAwesomeIcon icon={faBell} />
            <span className="text-xs  text-center">{filters[0]}</span>
        </button>
        </li>
        <li>
            <button
            onClick={() => setFilter(filters[1])}
            className={`hover:underline flex flex-col space-y-1 mx-auto ${filter === filters[1] ? " text-red-400" : ""}`}
            >
            <FontAwesomeIcon icon={faFire} />
            <span className="text-xs text-center">{filters[1]}</span>
            </button>
        </li>

        <li className="relative">
          <button
            onClick={() => {setFilter(filters[2]); setIsTagMenuOpen(!isTagMenuOpen);}}
            className={`hover:underline flex flex-col space-y-1 mx-auto ${filter === filters[2] ? " text-orange-300" : ""}`}
          >
            <FontAwesomeIcon icon={faTags} />
            <span className="text-xs  text-center">{filters[2]}</span>
          </button>

          {filter === filters[2] && (
            <div className={`absolute left-2 -top-2 ml-11 z-50 border border-gray-700 ${isTagMenuOpen ? "" : "hidden"}`}>
              <div className="bg-white p-2 shadow-lg w-24 z-50">
                <button
                  onClick={() => setIsTagMenuOpen(!isTagMenuOpen)} // フィルタ解除 or メニュー閉じ
                  className="w-full text-right pr-0 text-gray-500 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="xs" />
                </button>
                <ul className="space-y-2">
                  {tags.map((tag) => (
                    <li key={tag}>
                    <button
                      onClick={() => {setFilter(tag); setIsTagMenuOpen(!isTagMenuOpen);}}
                      className={`w-full text-left px-1 py-2 mx-auto text-gray-800 ${
                        filter === tag
                      ? "bg-blue-200"
                      : "hover:bg-blue-100"
                    }`}
                    >
                      {tag}
                    </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>

        <li>
            <button
            onClick={() => setFilter(filters[3])}
            className={`hover:underline flex flex-col space-y-1 mx-auto ${filter === filters[3] ? " text-blue-400" : ""}`}
            >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span className="text-xs  text-center">{filters[3]}</span>
            </button>
        </li>
        <li>
            <button
            onClick={() => setFilter(filters[4])}
            className={`hover:underline flex flex-col space-y-1 mx-auto ${filter === filters[4] ? " text-cyan-600" : ""}`}
            >
            <FontAwesomeIcon icon={faFolderClosed} />
            <span className="text-xs  text-center">{filters[4]}</span>
            </button>
        </li>
        </ul>
    </div>

    {!isSideBarOpen && (
      <div className="relative group">
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute left-0 top-1 pr-2 opacity-20 transform -translate-y-1 bg-gray-700 p-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faAnglesRight} className="text-white"/>
        </button>
        <div className="absolute bottom-full left-12 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          サイドバーをひらく
        </div>
      </div>
    )}
  </div>
  );
};
  
export default BoardsSideBar;

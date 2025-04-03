import {useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faBell, faThumbsUp, faFire, faUser, faStar} from "@fortawesome/free-solid-svg-icons";

const BoardsSideBar = () => {
    const [ isSideBar, setIsSideBar ] = useState<boolean>(true);
    return (
      <div className={`relative`}>
        <div className={`max-w-1/6 p-4 border-r border-gray-300 bg-gray-700 text-white ${!isSideBar && "hidden"}`}>
            <h2 className="text-lg font-semibold mb-4 text-center">
            <button 
                onClick={()=>setIsSideBar(!isSideBar)}
                className="text-lg font-semibold mb-4 text-center"
            ><FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            </h2>
            <ul className="space-y-6">
            <li><a href="#" className="hover:underline flex flex-col space-y-1">
                <FontAwesomeIcon icon={faFire} />
                <span className="text-xs text-center">人気</span>
            </a></li>
            <li><a href="#" className=" hover:underline flex flex-col space-y-1">
                <FontAwesomeIcon icon={faBell} />
                <span className="text-xs  text-center">新着</span>
            </a></li>
            <li><a href="#" className="hover:underline flex flex-col space-y-1">
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="text-xs  text-center">いいね</span>
            </a></li>
            <li><a href="#" className="hover:underline flex flex-col space-y-1">
                <FontAwesomeIcon icon={faUser} />
                <span className="text-xs  text-center">自分</span>
            </a></li>
            <li><a href="#" className="hover:underline flex flex-col space-y-1">
                <FontAwesomeIcon icon={faStar} />
                <span className="text-xs  text-center">スター</span>
            </a></li>
            </ul>
        </div>

        {!isSideBar && (
          <div
            className="absolute left-0 top-1 pr-4 transform -translate-y-1 bg-gray-700 p-2 rounded-r-xl cursor-pointer"
              onClick={() => setIsSideBar(!isSideBar)}
          >
            <span className="text-white text-xl"><FontAwesomeIcon icon={faAnglesRight} /></span>
          </div>
            )}
      </div>
    );
  };
  
export default BoardsSideBar;
  
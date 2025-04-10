import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import BasicEducation from "../features/board/main/BasicEducation";
import IndexBoards from "../features/board/main/IndexBoards";
import BoardsSideBar from "../features/board/main/BoardsSideBar";
import { Link } from "react-router-dom";

const Boards = () => {
  const { isLoggedIn } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"boards" | "learning">("boards");
  const [filter, setFilter] = useState<string|null>("新着順");

  const tabLabels: Record<"boards" | "learning", string> = {
    boards: "みんなの切断",
    learning: "切断の基本",
  };

  return(
    <div className="w-full p-4">
      <div className="w-full flex">
        {isLoggedIn &&
          <BoardsSideBar filter={filter} setFilter={setFilter}/>
        }
        <div className="w-full m-4">
          <div className="flex justify-start p-2"  role="tablist">
          {(["boards", "learning" ] as const).map((tab) => (
            <button
              key={tab}
              role="tab"
              className={`px-2 py-2 border-b-2 space-x-4 ${
                selectedTab=== tab ? "border-blue-500 font-semibold text-xl" : "text-md"
              }`}
              onClick={() => setSelectedTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
          </div>
          {isLoggedIn && filter && selectedTab === "boards" && 
            <div className="text-gray-500 text-sm flex mr-4 justify-end">表示: {filter}</div>
          }
          <div className="m-2">
          { selectedTab === "learning"
            ? <BasicEducation/>
            : isLoggedIn
              ? <IndexBoards filter={filter}/>
              : <p className="p-2"><Link to="/login" className="text-blue-700 border-b-2">ログイン</Link>が必要です</p>
          }
          </div>
        </div>
      </div>
    </div>
  )
};

export default Boards;
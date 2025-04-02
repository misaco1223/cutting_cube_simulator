import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import BasicEducation from "../features/board/index/BasicEducation";
import IndexBoards from "../features/board/index/IndexBoards"

const Boards = () => {
  const { isLoggedIn } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"boards" | "learning">("boards");

  const tabLabels: Record<"boards" | "learning", string> = {
    boards: "みんなの切断を見る",
    learning: "切断の基本を学ぶ",
  };

  return(
    <div className="container mx-auto w-full mt-4 px-2">
      <div className="flex justify-start"  role="tablist">
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
      <div className="mt-2">
        { selectedTab === "learning"
          ? <BasicEducation/>
          : isLoggedIn
            ? <IndexBoards/>
            : <p className="ml-4">ログインが必要です</p>
        }
      </div>
    </div>
  )
};

export default Boards;
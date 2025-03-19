import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Board = () => {
  const { isLoggedIn, logout, userName } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"board" | "learning">("board");

  const tabLabels: Record<"board" | "learning", string> = {
    board: "みんなの切断を見る",
    learning: "切断の基本を学ぶ",
  };

  return(
    <div className="container p-4">
      <div className="flex justify-start"  role="tablist">
        {(["board", "learning" ] as const).map((tab) => (
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
      <div className="mt-2 px-4">
        { selectedTab === "learning"
          ? <p>準備中...</p>
          : isLoggedIn
            ? <p>準備中...</p>
            : <p>ログインが必要です</p>
        }
      </div>
    </div>
  )
};

export default Board;
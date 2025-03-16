import HistoryCard from "./HistoryCard";
import { useGetCutCube } from "./useGetCutCube";

const IndexCutHistory = () => {
  const { glbUrls, cutPoints, createdAt, title, memo } = useGetCutCube();

  if (!glbUrls || !cutPoints || glbUrls.length !== cutPoints.length) return null;

  return (
    <div>
      <div className="m-4 items-center">
        <h1 className="text-2xl font-bold">切断履歴</h1>
      </div>
      <div className="space-y-4">
      { glbUrls.length === 0 ? <p className="m-4">履歴はありません</p>
      : glbUrls.map((glbUrl, index) => (
          <HistoryCard key={index} glbUrl={glbUrl} cutPoints={cutPoints[index]} createdAt={createdAt[index]} title={title[index]} memo={memo[index]}/>
      ))}
      </div>
    </div>
  );
};

export default IndexCutHistory;

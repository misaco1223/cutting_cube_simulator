import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = {
  text: "三角形ですか？",
  // 三角形
  yes: {
    text: "3つの辺の長さが同じですか？",
    yes: "正三角形",
    no: {
    text: "2つの辺の長さが同じですか？",
    yes: "二等辺三角形",
    no: "三角形",
    } 
  },
  // 四角形
  no: {
    text: "四角形ですか？",
    yes: {
    text: "平行な辺が2組ありますか？",
    yes: {
        text: "4つの辺の長さは等しいですか？",
        yes:{
          text: "4つの角はそれぞれ90度ですか？",
          yes: "正方形",
          no: {
            text: "対角線は垂直に交わりますか？",
            yes: "ひし形",
            no: "平行四辺形"
          }
        },
        no: {
          text: "4つの角はそれぞれ90度ですか？",
          yes: "長方形",
          no: "平行四辺形"
        }
    },
    no: {
        text: "平行な辺が1組ありますか？",
        yes: {
        text: "対角線の長さが等しいですか？",
        yes: "等脚台形",
        no: "台形",
        },
        no: "四角形",
    },
    },
    // 五角形
    no: {
    text: "五角形ですか？",
    yes: {
        text: "5つの辺の長さが等しいですか？",
        yes: "正五角形",
        no: "五角形",
    },
    // 六角形
    no: {
        text: "六角形ですか?",
        yes:{
        text: "6つの辺の長さは等しいですか？",
        yes: "正六角形です",
        no: "六角形です",
        },
        no: ""
    }
    },
  }
};

type QuestionNode = {
    text: string;
    yes: QuestionNode | string;
    no: QuestionNode | string;
  };

interface CutFaceFlowChartProps {
  handleCutCubeUpdate: (faceName?:string) => void;
  setIsFaceFlowOpen: (b:boolean) => void;
}

const CutFaceFlowChart = ({handleCutCubeUpdate, setIsFaceFlowOpen}:CutFaceFlowChartProps) =>  {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionNode>(questions);
  const [isDone, setIsDone] = useState(false);
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<QuestionNode[]>([]);
  const [direction, setDirection] = useState(1);

  const handleAnswer = (answer: "yes" | "no") => {
    const next = currentQuestion[answer];
    if (typeof next === "string") {
      setIsDone(true);
      setResult(next);
    } else {
      setHistory((prev) => [...prev, currentQuestion]);
      setDirection(1);
      setCurrentQuestion(next);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const previousQuestion = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setDirection(-1);
      setCurrentQuestion(previousQuestion);
    }
  };

  return (
    <div className="p-4">
      {isDone ? (
        result !== "" ? (
          <div className="md:flex justify-between">
            <p className="text-xl font-bold mb-6">{result}です!</p>
            <button 
              onClick={()=> {
                handleCutCubeUpdate(result);
                setIsFaceFlowOpen(false)
              }}
              className="px-4 py-2 items-center bg-gray-200 rounded hover:bg-blue-500 flex justify-end">
              切断面の形を登録
            </button>
          </div>
        ):(
          <div className="md:flex justify-between">
            <span className="text-xl mb-6">申し訳ございません。わかりませんでした。</span>
          </div>
        )  
      ):(
        <div className="w-full">
        <div className="lg:w-2/3 mx-auto">
          <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.text}
            custom={direction}
            variants={{
                enter: (dir: number) => ({
                x: dir * 200, // 右へ200 or 左へ200
                opacity: 0,
                }),
                center: {
                x: 0,
                opacity: 1,
                },
                exit: (dir: number) => ({
                x: dir === 1 ? -100 : 100, // 進むなら-100（左へ）、戻るなら100（右へ）
                opacity: 0,
                transition: {
                    opacity: { duration: 0.1 },
                    x: { duration: 0.3 },
                },
                }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            >
              <div className="text-lg mb-6 text-center">{currentQuestion.text}</div>
              <div className="flex space-x-4 justify-between">
                <button onClick={() => handleAnswer("yes")} className="px-4 py-2 bg-green-200 rounded hover:bg-green-300 flex justify-start">はい</button>
                <button onClick={() => handleAnswer("no")} className="px-4 py-2 bg-red-200 rounded hover:bg-red-300 flex justify-end">いいえ</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="min-h-14 flex justify-start">
          <button onClick={handleBack} className={`mt-8 text-gray-500 ${history.length === 0 ? "hidden" :""}`} disabled={history.length === 0} >1つ前に戻る</button>
        </div>
      </div>
      )}
    </div>
  );
}

export default CutFaceFlowChart;
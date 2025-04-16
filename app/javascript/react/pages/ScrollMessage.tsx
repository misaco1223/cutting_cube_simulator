import {Link} from "react-router-dom";
const ScrollMessage = () => {
    return(
      <div className="py-2">
        <div className="whitespace-nowrap animate-scroll">
          <span className="inline-block text-gray-500">
            ようこそ、立方体の切断へ！　新学年が始まって1ヶ月ですね。
            新しいクラスには慣れてきましたか？
            初めてのことは勇気がいりますが、きちんと向き合えば大きな学びがあるはずです。　頑張りましょう！
            このアプリを使う前に<Link to="/hint" className="text-blue-700 border-b-2"> はじめに</Link>を確認してください。
          </span>
        </div>
      </div>
    );
  };
  
  export default ScrollMessage;
  
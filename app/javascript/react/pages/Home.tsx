import { useState } from "react";
import InteractiveCube from "../features/getCoordinates/components/ui/InteractiveCube";
import ScrollMessage from "./ScrollMessage"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleInfo, faXmark } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  const toggleInfo = () => setIsInfoOpen((prev)=> !prev);

  return(
    <div className="w-full md:p-6 p-4 relative">
      <ScrollMessage/>
      <div className="flex items-center">
        <h1 className="text-xl m-4 font-bold p-2">切断をシミュレーションする</h1>
        <button onClick={toggleInfo}>
          <FontAwesomeIcon icon={faCircleInfo} size="lg" className="hover:text-gray-300 transition duration-300"/>
        </button>
      </div>
      {isInfoOpen && (
        <div className="absolute z-50 top-32 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 bg-white border border-gray-300 shadow-xl rounded-md p-6 text-sm leading-relaxed">
          <span className="flex justify-end"><FontAwesomeIcon icon={faXmark} size="xl" onClick={toggleInfo}/></span>
          <p className="mb-2 font-bold text-gray-800">切断点の選びかた</p>
          <p className="mb-2 text-sm">----切断点を選ぶ----</p>
          <p className="mb-2 text-sm">立方体の辺をクリックをして、3つの切断点を選んでください。切断点を選ぶと立方体の下に詳細が表示されます。</p>
          <p className="mb-2 text-sm ">切断できない点の取得を防ぐために、辺の色が灰色に変わります。その辺からは取得できません。</p>
          <p className="mb-2 text-sm">----切断点を修正・確定する----</p>
          <p className="mb-2 text-sm">辺上の点を選んだ時は、ドロップダウンメニューからで比を修正できます。選択肢に希望する比がないときは、一番下の入力欄に辺の比を入力してOKを押してください。</p>
          <p className="mb-2 text-sm ">チェックマークが緑色<FontAwesomeIcon icon={faCircleCheck} size="xs" className="text-green-500"/>の点は選択が完了していますが、灰色<FontAwesomeIcon icon={faCircleCheck} size="xs" className="text-gray-200"/>は入力待ちです。ドロップダウンから辺の比を選択またはOKを押して更新してください。</p>
          <p className="mb-2 text-sm ">選択した点を取り消したいときは、ゴミ箱ボタンを押してください。</p>
          <p className="mb-2 text-sm ">4点以上選択すると、エラーが表示されます。不要な点を削除してください。</p>
          <br/>
          <p className="mb-2 text-sm ">切断点の選択が完了したら、切断するボタンを押してください。</p>
          <p className="text-sm">立方体の一辺の長さを入力できるフォームが表示されますが、その機能は準備中です。</p>
        </div>
      )}
      <div className="w-full mx-auto px-5 mb-64">
        <InteractiveCube />
      </div>
    </div>
  );
};

export default Home;
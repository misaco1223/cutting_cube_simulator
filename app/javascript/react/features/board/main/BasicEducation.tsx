import {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"

const BasicEducation = () => {
  const [isOpen1, setIsOpen1] = useState<boolean>(true);
  const [isOpen2, setIsOpen2] = useState<boolean>(true);
  const [isOpen3, setIsOpen3] = useState<boolean>(true);
  const [isOpen4, setIsOpen4] = useState<boolean>(true);

  return(
    <div className="w-full">
      {/* 切断の基本 */}
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
        <button type="button" className="flex justify-between mt-6 p-2 w-full text-md font-bold rtl:text-right focus:ring-gray-200 gap-3" 
            onClick={() => setIsOpen1(!isOpen1)}
            aria-expanded={isOpen1}
            aria-controls="accordion-collapse-body-1"
        >
            <span>1. 切断とは</span>
            <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen1 ? "rotate-180" : ""}`}  />
        </button>
        </h2>
        <div id="accordion-collapse-body-1"
        className={`p-5 border text-sm border-gray-200 ${isOpen1 ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading-1"
        >
          <span>
          切断とは、<b>2つの立体に分けること</b>です。<br/>
          そのとき、<b>切断面は平ら</b>になっていなければなりません。<br/>
          <br/>
          NG: 切断面が曲がっていたり、ジグザグになっていたりする。<br/>
          OK: 切断面が平らで、完全に2つに分けることができた。<br/>
          <br/>
          切断するときは、大きな平らな包丁で一気に切り落とすイメージを持ちましょう。<br/>
          </span>
        </div>
      </div>

      {/* 切断線は表面 */}
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
        <button type="button" className="flex justify-between mt-6 p-2 w-full text-md font-bold rtl:text-right focus:ring-gray-200 gap-3" 
            onClick={() => setIsOpen2(!isOpen2)}
            aria-expanded={isOpen2}
            aria-controls="accordion-collapse-body-1"
        >
            <span>2. 切断線は表面にありますか？</span>
            <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen2 ? "rotate-180" : ""}`}  />
        </button>
        </h2>
        <div id="accordion-collapse-body-1"
        className={`p-5 border text-sm border-gray-200 ${isOpen2 ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading-1"
        >
          <span>
          切断とは完全に2つに分けることなのですから、<b>表面に線がないのはおかしい</b>です。<br/>
          <br/>
          もし切断線が立体の表面にない場合、それは切断が中途半端に終わっていることを意味します。<br/>
          <br/>
          包丁が立方体の途中で止まってしまい、切断しきれていない状態です。
          </span>
        </div>
      </div>

      {/* 切断の手順 */}
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
        <button type="button" className="flex items-center justify-between mt-6 p-2 w-full text-md font-bold rtl:text-right focus:ring-gray-200 gap-3" 
            onClick={() => setIsOpen3(!isOpen3)}
            aria-expanded={isOpen3}
            aria-controls="accordion-collapse-body-1"
        >
            <span>3. 切断の手順</span>
            <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen3 ? "rotate-180" : ""}`}  />
        </button>
        </h2>
        <div id="accordion-collapse-body-1"
        className={`p-5 border text-sm border-gray-200 ${isOpen3 ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading-1"
        >
          <div className="my-4">
            <span>その1:</span>
            <h3><b>点が同じ面にあるなら、結んで良し</b></h3>
          </div>
          <div className="my-4">
            <span>その2:</span>
            <h3><b>平行な面には、平行な切断線を引いて良し</b></h3>
          </div>
          <div className="my-4">
            <span>その3:</span>
            <h3><b>うつ手がなくなったら、延長すべし</b></h3>
          </div>
        </div>
      </div>

      {/* 練習問題 */}
      <div id="accordion-collapse" data-accordion="collapse">
        <h2 id="accordion-collapse-heading-1">
        <button type="button" className="flex items-center justify-between mt-6 p-2 w-full text-md font-bold rtl:text-right focus:ring-gray-200 gap-3" 
            onClick={() => setIsOpen4(!isOpen4)}
            aria-expanded={isOpen4}
            aria-controls="accordion-collapse-body-1"
        >
            <span>4. 練習問題</span>
            <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen4 ? "rotate-180" : ""}`}  />
        </button>
        </h2>
        <div id="accordion-collapse-body-1"
        className={`p-5 border border-gray-200 ${isOpen4 ? "" : "hidden"}`}
        aria-labelledby="accordion-collapse-heading-1"
        >
          <img src="/example_question_1.png" className="w-80" />
          <h2 className="font-bold space-y-1 mt-8">切断の手順を確認</h2>
          <img src="/example_explanation_1.png" className="w-80" />
          <p className="text-sm">
            点1と点2はどちらも立方体の上の面にあるので結んで切断線になります。<br/>
            同様に、点1と点3、点2と点3もそれぞれ結びます。<br/>
            立方体の表面だけに切断線ができました。これで切断は完了です。
          </p>
          <h2 className="font-bold space-y-1 mt-8">答え 36㎤</h2>
          <p className="text-sm">点Bを含む立体は三角すい。<br/>
          三角すいの体積の求め方は  底面積×高さ÷3<br/>
          よって<br/>
          6×6÷2×6÷3=36(㎤)</p>
        </div>
      </div>
    </div>
  );
};
  
export default BasicEducation;
  
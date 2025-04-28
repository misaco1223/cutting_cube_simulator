import {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom"

const Hint = () => {
  const [isOpen0, setIsOpen0] = useState<boolean>(true);
  const [isOpen1, setIsOpen1] = useState<boolean>(false);
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [isOpen4, setIsOpen4] = useState<boolean>(false);
  const [isOpen5, setIsOpen5] = useState<boolean>(false);
  const [isOpen6, setIsOpen6] = useState<boolean>(false);
  const [isOpen7, setIsOpen7] = useState<boolean>(false);
  const [isOpen8, setIsOpen8] = useState<boolean>(false);


  return(
    <div className="w-full p-4 md:p-12">
      <div className="m-4">
        <h1 className="text-xl font-bold p-2">このアプリの使い方</h1>

        {/* 0 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-6 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setisOpen0(!isOpen0)}
              aria-expanded={isOpen0}
              aria-controls="accordion-collapse-body-1"
          >
              <span>0. はじめに</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen0 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen0 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
            このアプリでは立方体を1回切断できます(2回以上は準備中...)。<br/>
            また切断後の体積を計算する機能も準備中です。<br/>
            <br/>
            Cookieを承認またはユーザー登録をすると切断履歴を残せます。 <br/>
            ユーザー登録をするとマイページで自分の切断をコレクションしたり 問題を作って投稿したり、他ユーザーの問題を閲覧することができます。<br/>
            ユーザー登録はメールアドレスの登録がいるので <b>必ず保護者の人に確認してから登録しましょう。</b> 
            </span>
          </div>
        </div>
        
        <h2 className="text-md mt-8">------ 未ログインで使える機能 ------</h2>
        {/* 1 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-6 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen1(!isOpen1)}
              aria-expanded={isOpen1}
              aria-controls="accordion-collapse-body-1"
          >
              <span>1. 立方体を1回切断する</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen1 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen1 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
              <Link to="/home" className="text-blue-700 border-b-2">切断ページ</Link>から切断点を選び、切断することができます。<br/>
              表示されている立方体からフレキシブルに頂点を選ぶことができます。<br/>
              辺上の点を選択した場合は、立体下に表示される編集フォームから辺の比を指定することができます。辺の比を修正した後は、更新ボタンを押してください。<br/>
              切断点は3つまでしか選べません。また、同じ面の3点は、切断ができないため選べません。
            </span>
          </div>
        </div>

        {/* 2 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen2(!isOpen2)}
              aria-expanded={isOpen2}
              aria-controls="accordion-collapse-body-1"
          >
              <span>2. 切断結果を見る</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen2 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen2 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
              切断結果が計算されるまで最大15秒ほどかかることがあります。<br/>
              切断した立体のそれぞれは右上の表示切替から選択できます。<br/>
              タイトルやメモを編集することができます。<br/>
              切断結果は、<Link to="/history" className="text-blue-700 border-b-2">履歴ページ</Link>で切断ごとの「詳しく見る」から確認することができます。
            </span>
          </div>
        </div>

        {/* 3 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen3(!isOpen3)}
              aria-expanded={isOpen3}
              aria-controls="accordion-collapse-body-1"
          >
              <span>3. 切断履歴を確認する</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen3 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen3 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
              <Link to="/history" className="text-blue-700 border-b-2">切断履歴</Link>は、ユーザー未登録かつCookieの承認がない場合、ブラウザに最大5件まで保存されます。<br/>
              <span className="text-gray-500">(ブラウザに保存されたデータはGoogleChromeの開発ツール＞Application＞LocalStorageから確認できます。)</span><br/>
              Cookie保持者と登録済みユーザーは、履歴数の制限はありません。<br/>
              切断履歴は必要に応じて削除することができます。一度削除した切断は戻りません。
            </span>
          </div>
        </div>

        <h2 className="text-md mt-8">------ ログイン後に使える機能 ------</h2>
        <p className="p-2"><Link to="/login" className="text-blue-700 border-b-2">ログイン・新規ユーザー登録</Link>はこちらから</p>

        {/* 4 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-6 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen4(!isOpen4)}
              aria-expanded={isOpen4}
              aria-controls="accordion-collapse-body-1"
          >
              <span>4. マイページでできること</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen4 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen4 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
            <Link to="/mypage" className="text-blue-700 border-b-2">マイページ</Link>では、主に、ユーザー詳細、ログアウト、切断コレクション、問題の作成をすることができます。<br/>
            <Link to="/user" className="text-blue-700 border-b-2">ユーザー詳細</Link>からは、ユーザーの名前変更、メールアドレス変更、パスワード変更、ユーザーアカウント削除を行うことができます。<br/>
            <br/>
            切断コレクションでは、切断をコレクションできます。切断コレクションを外しても、切断履歴からは削除されません。<br/>
            問題コレクションでは、あなたの作成した問題を見ることができます。問題の作成は、マイページの「問題を作成する」から進んでください。<br/>
            問題の削除を必要に応じて行うことができます。一度削除した問題は戻りません。<br/>
            また問題の公開設定を行うことができます。
            </span>
          </div>
        </div>

        {/* 5 */}
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen5(!isOpen5)}
              aria-expanded={isOpen5}
              aria-controls="accordion-collapse-body-1"
          >
              <span>5. 切断の問題を作成する</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen5 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen5 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>マイページの<Link to="/board/new" className="text-blue-700 border-b-2">問題を作成する</Link>から問題を作成できます。<br/>
            まず、切断の一覧から問題に使う切断を選んで、「次へ」に進みます。<br/>
            次に、問題文、答え、解説、タグ(無くても可)を作成し、「プレビュー」に進みます。<br/>
            最後に、プレビューで内容を確認しつつ、公開設定を設定してください。<br/>
            <br/>
            作成後はマイページに戻ってきます。作成した問題を確認してください。<br/>
            公開設定はマイページから行えます。公開設定をオンにすると、問題が学びページでみんなに公開されます。<br/>
            <br/>
            作成後にも問題文や答えや解説やタグの更新ができます。更新ができるのは自分が作成した問題のみです。<br/>
            みんなからもらったいいねの数やスターの数は、<Link to="/mypage" className="text-blue-700 border-b-2">マイページ</Link>で、問題ごとの「詳しく見る」から確認してください。
            </span>
          </div>
        </div>

        {/* 6 */}
        <div id="accordion-collapse" data-accordion="collapse" className="mb-8">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen6(!isOpen6)}
              aria-expanded={isOpen6}
              aria-controls="accordion-collapse-body-1"
          >
              <span>6. 学びページでできること</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen6 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen6 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
            <Link to="/boards" className="text-blue-700 border-b-2">学びページ</Link>では、みんなの問題を見ることができます。<br/>
            サイドメニューの「新着順」「人気順」では、表示順を指定することができます。タグ別ではタグの検索ができます。<br/>
            「いいね」はあなたがいいねした問題が表示され、「キープ」はあなたがキープした問題が表示されます。<br/>
            キープは、「後で見返したい」「保存しておきたい」と思った問題に活用してください。
            </span>
          </div>
        </div>

        <h2 className="text-md mt-8">------ 困ったときは ------</h2>

        {/* 7 */}
        <div id="accordion-collapse" data-accordion="collapse" className="mb-8">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen7(!isOpen7)}
              aria-expanded={isOpen7}
              aria-controls="accordion-collapse-body-1"
          >
              <span>7. ロード中...から変化しない</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen7 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen7 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
            ご迷惑をおかけしております。
            <br/><br/>
            マイページや履歴で、「ロード中...」のまましばらく変化がない場合は<br/>
            再度ログインしていただくことで改善する場合があります。
            </span>
          </div>
        </div>

        {/* 8 */}
        <div id="accordion-collapse" data-accordion="collapse" className="mb-8">
          <h2 id="accordion-collapse-heading-1">
          <button type="button" className="flex items-center justify-between w-full mt-8 p-2 text-lg font-bold rtl:text-right focus:ring-gray-200 gap-3" 
              onClick={() => setIsOpen8(!isOpen8)}
              aria-expanded={isOpen8}
              aria-controls="accordion-collapse-body-1"
          >
              <span>8. 切断面の色塗りがおかしい</span>
              <FontAwesomeIcon icon={faCaretDown}className={`transition-transform ${isOpen8 ? "rotate-180" : ""}`}  />
          </button>
          </h2>
          <div id="accordion-collapse-body-1"
          className={`p-5 border bg-gray-100 border-gray-200 ${isOpen8 ? "" : "hidden"}`}
          aria-labelledby="accordion-collapse-heading-1"
          >
            <span>
            ご迷惑をおかけしております。
            <br/><br/>
            切断面が長方形になる時の切断面の赤色着色に異常が発生しており、只今調査中でございます。<br/>
            切断自体は正しく行われていますので、赤色よりも切断面の形を優先してお考えください。
            </span>
          </div>
        </div>

        <span>
          その他にお困りごとがありましたら、お手数ですが
          <button
          onClick={() => {
            if (window.confirm("外部サイト(GoogleForm)を開きます。よろしいですか？")) {
              window.open("https://docs.google.com/forms/d/e/1FAIpQLSeTAlvLt3XIjLtgSFMqPIl2YCPmkRY6w9IzRoawkxILrEiJ0w/viewform?usp=dialog", "_blank");
            }
          }}
          className="text-blue-700 border-b-2">
            お問い合わせ
          </button>
          よりご連絡ください。
        </span>
      </div>
    </div>
  )
};

export default Hint;
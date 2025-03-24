const ScrollMessage = () => {
    return(
      <div className="py-2">
        <div className="whitespace-nowrap animate-scroll">
          <span className="inline-block text-gray-500">
            ようこそ、立方体の切断へ! このアプリでは立方体を1回切断できます(2回以上は準備中...)。  Cookieを承認すると履歴を残せます。 ユーザー登録をすると自分の切断をブックマークで管理したり 問題を作って投稿することができます。  ユーザー登録はメールアドレスの登録がいるので 必ず保護者の人に確認してから登録しましょう。  使い方はヘッダーの ?(ヒント)マーク から見られます。
          </span>
        </div>
      </div>
    );
  };
  
  export default ScrollMessage;
  
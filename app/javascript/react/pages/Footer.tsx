import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-200 pt-4 px-6 w-full h-20 text-center">
        <ul className="flex space-x-4 justify-center">
          <li>
            <Link to="/service_terms"><span className="text-xs">利用規約</span></Link>
          </li>
          <li>
            <Link to="/privacy_policy"><span className="text-xs">プライバシーポリシー</span></Link>
          </li>
          <li>
            <button
              onClick={() => {
                if (window.confirm("外部サイト(GoogleForm)を開きます。よろしいですか？")) {
                  window.open("https://docs.google.com/forms/d/e/1FAIpQLSeTAlvLt3XIjLtgSFMqPIl2YCPmkRY6w9IzRoawkxILrEiJ0w/viewform?usp=dialog", "_blank");
                }
              }}
              className="text-xs"
            >
              お問い合わせ
            </button>
          </li>
        </ul>
        <ul className="flex justify-center"><span className="text-xs">© 2025. 立方体の切断 ~中学受験算数 学習用シミュレーター~</span></ul>
    </footer>
  );
};

export const ServiceTerms = ()=>{
    return(
      <div className="m-4 p-4">
        <h1 className="text-xl font-bold my-4">利用規約</h1>

        <h2 className="text-md font-semibold mt-4">第1条（目的）</h2>
        <p>本規約は、当社（以下「運営者」といいます。）が提供するWebアプリケーション（以下「本サービス」といいます。）の利用条件を定めるものです。</p>

        <h2 className="text-md font-semibold mt-4">第2条（定義）</h2>
        <ul className="list-disc pl-6">
            <li>「ユーザー」とは、本サービスを利用するすべての個人または法人を指します。</li>
            <li>「登録ユーザー」とは、本サービスにアカウントを作成したユーザーを指します。</li>
            <li>「ゲストユーザー」とは、アカウントを作成せずに本サービスを利用するユーザーを指します。</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第3条（利用資格）</h2>
        <ul className="list-disc pl-6">
            <li>ユーザーは、本規約に同意の上、本サービスを利用できるものとします。</li>
            <li>未成年のユーザーが登録を行う場合、必ず保護者の同意を得るものとします。</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第4条（禁止事項）</h2>
        <ul className="list-disc pl-6">
            <li>他人の権利を侵害する行為</li>
            <li>不正アクセスや本サービスの運営を妨害する行為</li>
            <li>法令、公序良俗に反する行為</li>
            <li>その他、運営者が不適切と判断する行為</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第5条（サービスの変更・停止）</h2>
        <p>運営者は、ユーザーに事前通知することなく、本サービスの内容を変更または停止することがあります。</p>

        <h2 className="text-md font-semibold mt-4">第6条（免責事項）</h2>
        <ul className="list-disc pl-6">
            <li>運営者は、本サービスの利用によるいかなる損害についても責任を負いません。</li>
            <li>ユーザーが投稿したデータに関するトラブルについては、運営者は責任を負いません。</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第7条（準拠法・裁判管轄）</h2>
        <p>本規約は日本法に準拠し、紛争が生じた場合は、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄とします。</p>
      </div>
    )
};

export const PrivacyPolicy = ()=>{
    return(
      <div className="m-4 p-4">
        <h1 className="text-xl font-bold my-4">プライバシーポリシー</h1>
    
        <h2 className="text-md font-semibold mt-4">第1条（収集する情報）</h2>
        <ul className="list-disc pl-6">
            <li>ユーザーが登録時に提供する情報（メールアドレス、ユーザー名など）</li>
            <li>ユーザーが作成した3Dモデルデータおよび関連する情報</li>
            <li>Cookieを利用したゲストユーザーの識別情報</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第2条（情報の利用目的）</h2>
        <ul className="list-disc pl-6">
            <li>本サービスの提供・運営</li>
            <li>ユーザーサポート</li>
            <li>サービス向上のための統計データ分析</li>
            <li>法令に基づく対応</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第3条（第三者提供）</h2>
        <p>運営者は、以下の場合を除き、収集した情報を第三者に提供しません。</p>
        <ul className="list-disc pl-6">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく開示要求がある場合</li>
            <li>サービス運営に必要な範囲で業務委託する場合</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第4条（情報の管理）</h2>
        <p>運営者は、収集した情報の適切な管理を行い、外部への漏洩防止に努めます。</p>

        <h2 className="text-md font-semibold mt-4">第5条（ユーザーの権利）</h2>
        <ul className="list-disc pl-6">
            <li>ユーザーは、自身の個人情報の開示、訂正、削除を求めることができます。</li>
            <li>これらの請求は、運営者の指定する方法により行うものとします。</li>
        </ul>

        <h2 className="text-md font-semibold mt-4">第6条（改訂）</h2>
        <p>本ポリシーは、必要に応じて変更される場合があります。変更後のポリシーは、本サービス上で通知し、掲載後に有効となります。</p>

        <h2 className="text-md font-semibold mt-4">第7条（お問い合わせ）</h2>
        <p>プライバシーポリシーに関するお問い合わせは、フッターのお問い合わせフォームからご連絡ください。</p>
    </div>
    )
};

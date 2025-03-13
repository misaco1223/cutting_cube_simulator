import { useState, useEffect } from "react";

console.log("承認状況は", localStorage.getItem("cookieAccepted"))
// localStorage.removeItem("cookieAccepted"); console.log("承認状況をnullにしました");

const CookieConsent = () => {
  const [isAccepted,  setIsAccepted] = useState(() => {
    return localStorage.getItem("cookieAccepted") === "true";
  });
  
  const [isHide, setIsHide] = useState(false);
  
  useEffect(() => {
    if (isAccepted) {localStorage.setItem("cookieAccepted", "true");}
  }, [isAccepted]);

  const handleAccept = async() => {
    setIsAccepted(true)
    try {
      const response = await fetch('/api/cookies', { method: "POST" });
      if (!response.ok) throw new Error("cookiesへのfetchに失敗しました");
      const data = await response.json();
      console.log("cookieの取得に成功しました", data);
      setIsAccepted(true)
    } catch (error) {
      console.error("cookieの取得に失敗しました", error);
    }
  };


  const handleHideBanner = () => {
    setIsHide(true);
  };

  if (isAccepted || isHide) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4">
      <div className="mx-auto items-center justify-center text-center">
        <p className="w-full text-center">このサイトでは 切断履歴を保存するために Cookie を使用します。よろしいですか？</p>
        <button onClick={handleAccept} className="px-4 py-2 bg-blue-500 text-white rounded mt-2 mx-2">
          承諾する
        </button>
        <button onClick={handleHideBanner} className="px-4 py-2 bg-gray-500 text-white rounded mt-2 mx-2">
          閉じる
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;

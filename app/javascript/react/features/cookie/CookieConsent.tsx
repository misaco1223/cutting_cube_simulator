import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

console.log("承認状況は", localStorage.getItem("cookieAccepted"))
// localStorage.removeItem("cookieAccepted"); console.log("承認状況をnullにしました");

const CookieConsent = () => {
  const [isAccepted,  setIsAccepted] = useState(() => {
    return localStorage.getItem("cookieAccepted") === "true";
  });
  const [isHide, setIsHide] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(()=>{
    const fetchGetCookie = async() => {
      try {
        const response = await fetch('/api/cookies', { method: "GET" });
        if (!response.ok) throw new Error("cookiesへのfetchに失敗しました");
        const data = await response.json();
        console.log("cookieの取得に成功しました", data);
        setIsHide(true);
      } catch (error) {
        console.error("cookieの取得に失敗しました", error);
        localStorage.removeItem("cookieAccepted")
        setIsAccepted(false);
      }
    };
  
    if (isAccepted) { fetchGetCookie() }
  }, [isAccepted]);

  const handleAccept = async() => {
    setIsAccepted(true)
    try {
      const response = await fetch('/api/cookies', { method: "POST" });
      if (!response.ok) throw new Error("cookiesへのfetchに失敗しました");
      const data = await response.json();
      console.log("cookieの取得に成功しました", data);
      localStorage.setItem("cookieAccepted", "true");
      setIsHide(true)
    } catch (error) {
      console.error("cookieの取得に失敗しました", error);
    }
  };

  const handleHideBanner = () => {
    setIsHide(true);
  };

  useEffect(()=>{
   if ( isLoggedIn )
     handleAccept();
  },[isLoggedIn]);

  if (isAccepted || isHide) return null;

  return (
    <div className="cookie-banner fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4">
      <div className="mx-auto items-center justify-center text-center">
        <p className="w-full text-center">このサイトでは Cookie を使用します。<br/>よろしいですか？</p>
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

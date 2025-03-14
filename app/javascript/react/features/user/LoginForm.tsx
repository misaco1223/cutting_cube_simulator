import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<string[]>([]);
	
	const handleEmailForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }; 
  const handlePasswordForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const validateForm = () => {
    const errorMessages = []; 
    if (!email) {
      errorMessages.push("メールアドレスは必須です");
    }
    if (!password) {
      errorMessages.push("パスワードは必須です");
    }
    return errorMessages;
  }
	
  const handleLogin = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setPassword("");
      return; // バリデーションエラーがあれば送信を中止
    }
    
    try{
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errors = await response.json();
        setErrors([errors.message]);
        setPassword("");
        throw new Error(errors.message || "入力内容を確認してください");
      }

      const data = await response.json();
      console.log("ログイン成功:", data.user.name);
      login({ name: data.user.name });
      navigate("/");
    } catch(error){
      console.error("通信エラー", error);
      setPassword("");
      setErrors([error instanceof Error ? error.message : "通信エラーが発生しました。再試行してください。"]);
    };
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg lg:shadow-md md:shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">ログイン</h1>

      {errors.length > 0 && (
        <ul className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
         ))}
        </ul>
      )}

      <input
        type="email"
        value={email}
        onChange={handleEmailForm}
        placeholder="メールアドレス"
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordForm}
        placeholder="パスワード"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        ログイン
      </button>

      <p className="mt-4 text-center">
        <Link to="/users" className="text-blue-500 hover:underline">
        新規ユーザー登録
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
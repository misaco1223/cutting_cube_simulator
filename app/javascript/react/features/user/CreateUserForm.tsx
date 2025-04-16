import {useState} from 'react'
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const CreateUserForm = () => {
  const {login}= useAuth();
  const navigate = useNavigate();

  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ passwordConfirmation, setPasswordConfirmation ] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToParental, setAgreedToParental] = useState(false);
  const [ errors, setErrors ] = useState<string[]>([]);
  
  const handleNameForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleEmailForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmationForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };
  
  const validateForm = () => {
    const errorMessages = [];
    if (!name) {
      errorMessages.push("名前は必須です。");
    }
    if (!email) {
      errorMessages.push("メールアドレスは必須です。");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorMessages.push("有効なメールアドレスを入力してください。");
    }
    if (!password) {
      errorMessages.push("パスワードは必須です。");
    } else if (password.length < 8) {
      errorMessages.push("パスワードは8文字以上で入力してください。");
    }
    if (!passwordConfirmation) {
      errorMessages.push("パスワード(確認用)の入力は必須です。");
    } 
    if (password && password !== passwordConfirmation) {
    errorMessages.push("パスワードと確認用パスワードが一致しません。");
	  }
    if (!agreedToTerms) {
      errorMessages.push("利用規約とプライバシーポリシーへの同意が必要です。");
    }
    if (!agreedToParental) {
      errorMessages.push("未成年の場合、保護者の同意が必要です。");
    }
    return errorMessages;
  };
  
  const handleCreateUser = async() => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors); // エラーメッセージを表示
      setPassword("");
      setPasswordConfirmation("");//順番どうかな？ちゃんとエラーメッセージ表示されてる？
      return; // バリデーションエラーがあれば送信を中止
    }
    
	  const userParams = {
	    user: {
          name: name,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation
        }
      };

      console.log("User Paramsは", userParams);
	  
    try {
      const response = await fetch('/api/users', {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userParams)
      });
    
      if (!response.ok) {
        const errors = await response.json();
        setErrors([errors.message]);
        setPassword("");
        setPasswordConfirmation("");
        throw new Error(errors.message || "入力内容を確認してください");
      }

      const data = await response.json();
      console.log("ユーザー登録が完了しました", data.user);
      login({ name: data.user.name });
      navigate("/");
    } catch(error) {
      console.error("通信エラー", error);
      setPassword("");
      setPasswordConfirmation("");
      setErrors([error instanceof Error ? error.message : "通信エラーが発生しました。再試行してください。"]);
    }
  };
  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg lg:shadow-md md:shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">ユーザー登録</h1>
  
      {errors.length > 0 && (
        <ul className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
          ))}
        </ul>
      )}

      <input
        type="text"
        value={name}
        onChange={handleNameForm}
        placeholder="名前"
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
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
        className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="password"
        value={passwordConfirmation}
        onChange={handlePasswordConfirmationForm}
        placeholder="パスワード(確認用)"
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex items-start mb-4 text-sm">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-1 mr-2"
        />
        <label htmlFor="terms" className="leading-snug">
          <span><Link to="/service_terms" className="text-blue-700 border-b-2">利用規約</Link>と<Link to="/privacy_policy" className="text-blue-700 border-b-2">プライバシーポリシー</Link>に同意します。</span>
        </label>
      </div>

      <div className="flex items-start mb-4 text-sm">
        <input
          id="parental-consent"
          type="checkbox"
          checked={agreedToParental}
          onChange={(e) => setAgreedToParental(e.target.checked)}
          className="mt-1 mr-2"
        />
        <label htmlFor="parental-consent" className="leading-snug">
          私は未成年ではありません。または、<strong>保護者の同意を得ています。</strong>
        </label>
      </div>

      <button
        onClick={handleCreateUser}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
      >
        ユーザーを登録
      </button>
    </div>
  );
};

export default CreateUserForm;
import { useEffect, useState } from "react";
import { useGetUser} from "./useGetUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faEye, faPencil, faRotate } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const UserMe= () => {
  const { name, setName, email, setEmail} = useGetUser();
  const [ password, setPassword] = useState<string|null>(null);
  const [ exPassword, setExPassword] = useState<string|null>(null);
  const [ passwordConfirmation, setPasswordConfirmation] = useState<string|null>(null);
  const [ errors, setErrors ] = useState<string[]>([]);
  const { logout, isLoggedIn, setUserName } = useAuth();
  const navigate = useNavigate();

  // 編集用の状態
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentName, setCurrentName] = useState(name);
  const [currentEmail, setCurrentEmail] = useState(email);

  // パスワード欄の表示状態
  const [showPassword, setShowPassword ] = useState(false);

  // ユーザー削除時のパスワード確認モダル
  const [ isPasswordModalOpen ,setIsPasswordModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentName(name);
    setCurrentEmail(email);
  }, [name, email]);

  const validateForm = () => {
    const errorMessages:string[] = [];
    if (!currentName) {
      errorMessages.push("名前は必須です");
    }
    if (!currentEmail) {
      errorMessages.push("メールアドレスは必須です");
    } else if (!/\S+@\S+\.\S+/.test(currentEmail)) {
      errorMessages.push("有効なメールアドレスを入力してください");
    }
    if (password && password.length < 8) {
      errorMessages.push("パスワードは8文字以上で入力してください");
    }
    if (password && !passwordConfirmation) {
      errorMessages.push("パスワード(確認用)の入力は必須です");
    } 
    if (password && password !== passwordConfirmation) {
      errorMessages.push("パスワードと確認用パスワードが一致しません");
    }
    return errorMessages;
  };

  const handleUserUpdate = async () => {
    setErrors([]);
    if (!currentName || !currentEmail) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`/api/users/me_update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            name: currentName, 
            email: currentEmail, 
            ex_password: exPassword,
            password: password, 
            password_confirmation: passwordConfirmation
          }
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const data = await response.json ();
      // console.log("data",data);

      if (data.user) {
        if (data.user.name) {
          sessionStorage.setItem("userName", data.user.name);
          setUserName(data.user.name); {/*AuthContext用*/}
          setName(data.user.name);  {/*本フォーム用*/}
          setErrors(["名前の更新をしました"]);
          setIsEditingName(false);
        } else if (data.user.email) {
          setEmail(data.user.email);
          setCurrentEmail(data.user.email);
          setErrors(["メールの更新をしました"]);
          setIsEditingEmail(false);
        }
      } else if (data.message === "password_changed") {
        setErrors(["パスワードの更新をしました"]);
        setExPassword(null);
        setPassword(null);
        setPasswordConfirmation(null);
        setShowPassword(false);
        setIsEditingPassword(false);
      }

    } catch (error) {
      // console.error("更新エラー:", error);
      setErrors(["更新に失敗しました"])
    }
  };

  const handleDestroyUser= async() =>{
    if (!password) {
      setErrors(["パスワードを入力してください"]);
      return;
    }

    try{
      const response = await fetch(`/api/users/me_destroy`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("レスポンスを受け取れませんでした");
      logout();
      navigate("/");
    } catch (error) {
      // console.log(error);
      setErrors(["ユーザーの削除ができませんでした。パスワードを確認してください。"]);
      setIsPasswordModalOpen(false);
      setPassword(null);
    }
  }

  if(!isLoggedIn) {
    return( <p className="p-4">ログインしてください</p>)
  }

  return (
    <div>
    <div className="max-w-[500px] mx-auto mt-10 p-6 bg-white rounded-lg lg:shadow-md md:shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-8">ユーザー詳細</h1>
  
      {errors.length > 0 && (
        <ul className="text-red-500 mb-4">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">{error}</li>
          ))}
        </ul>
      )}

      {/*名前の編集*/}
      <div className="flex justify-between mb-4">
        <h1 className="my-auto text-md font-bold">名前</h1>
        <div className="flex justify-end">
          <div className="min-w-52 p-2  mr-2 my-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            {isEditingName ? (
            <input
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500 w-full"
            />
            ):(
            <p className="text-sm cursor-pointer" onClick={() => setIsEditingName(true)}>{currentName}</p>
            )}
          </div>
          {isEditingName ? (
            <div className="flex space-x-4">
              <button
              onClick={() => handleUserUpdate()}
              className="p-1 my-auto flex flex-col space-y-1"
            >
              <FontAwesomeIcon icon={faRotate} size="xs" className="text-gray-500 cursor-pointer"/>
              <span className="text-xs mx-auto">更新</span>
              </button>
              <FontAwesomeIcon icon={faCircleXmark} size="xs" className="my-auto text-gray-500 cursor-pointer" onClick={()=> setIsEditingName(false)}/>
            </div>
          ):(
            <FontAwesomeIcon icon={faPencil} size="xs" className="w-11 p-2 my-auto text-gray-500 cursor-pointer" onClick={() => setIsEditingName(true)} />
          )}
        </div>
      </div>

      {/*メールの編集*/}
      <div className="flex justify-between mb-4">
        <h1 className="text-md font-bold">メール</h1>
        <div className="flex justify-end">
          <div className="min-w-52 p-2 mr-2 my-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            {isEditingEmail ? (
              <input
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500 w-full"
              />
            ):(
            <p className="text-sm cursor-pointer" onClick={() => setIsEditingEmail(true)}>{currentEmail}</p>
            )}
          </div>
          {isEditingEmail? (
            <div className="flex space-x-4">
            <button
              onClick={() => handleUserUpdate()}
              className="p-1 my-auto flex flex-col space-y-1"
            >
              <FontAwesomeIcon icon={faRotate} size="xs" className="text-gray-500 cursor-pointer"/>
              <span className="text-xs mx-auto">更新</span>
            </button>
            <FontAwesomeIcon icon={faCircleXmark} className="my-auto text-gray-500 cursor-pointer" onClick={()=> setIsEditingEmail(false)}/>
            </div>
          ):(
            <FontAwesomeIcon icon={faPencil} size="xs" className="w-11 p-2 my-auto text-gray-500 cursor-pointer" onClick={() => setIsEditingEmail(true)} />
          )}
        </div>
      </div>

      {/*パスワードの編集*/}
      <div className="flex justify-between mb-4">
        <h1 className="text-md font-bold">パスワード</h1>
        <div className="flex justify-end">
          <div className="min-w-52 p-2 mr-2 my-auto border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            {isEditingPassword ? (
            <div>
              <div className="flex justify-between">
                <input
                value={exPassword || ""}
                type={showPassword ? "text" : "password"}
                placeholder="パスワード(旧)"
                onChange={(e) => setExPassword(e.target.value)}
                className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500"
                />
                <FontAwesomeIcon icon={faEye} size="xs" className="my-auto text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
              </div>
              <div>
                <input
                value={password || ""}
                type={showPassword ? "text" : "password"}
                placeholder="パスワード(新)"
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <input
                value={passwordConfirmation || ""}
                type={showPassword ? "text" : "password"}
                placeholder="パスワード(新)確認"
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                autoFocus
                className="text-sm border-b border-gray-100 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            ) : (
              <p
                className="text-sm cursor-pointer"
                onClick={() => setIsEditingPassword(true)}
              >
              ********
              </p>
            )}
          </div>
          {isEditingPassword ? (
          <div className="flex space-x-4">
            <button
              onClick={() => handleUserUpdate()}
              className="p-1 flex flex-col space-y-1 my-auto"
            >
              <FontAwesomeIcon icon={faRotate} size="xs" className="text-gray-500 cursor-pointer"/>
              <span className="text-xs mx-auto">更新</span>
            </button>
            <FontAwesomeIcon icon={faCircleXmark} size="xs" className="my-auto text-gray-500 cursor-pointer" onClick={()=> {setIsEditingPassword(false); setShowPassword(false);}}/>
          </div>
          ):(
            <FontAwesomeIcon icon={faPencil} size="xs" className="w-11 p-2 my-auto text-gray-500 cursor-pointer" onClick={() => setIsEditingPassword(true)} />
          )}
          </div>
      </div>

      {/*ユーザー削除ボタン*/}
      <button
        onClick={()=> setIsPasswordModalOpen(true)}
        className="w-full mt-8 text-sm text-gray-400 hover:text-red-500 hover:border-b-0 flex justify-end"
      >
        ユーザーを削除
      </button>
    </div>

    {/*削除時パスワード確認*/}
    {isPasswordModalOpen && (
      <div className="mx-auto z-50 w-[400px] mt-4">
        <div className="border border-red-500 p-6 rounded-lg shadow-md">
          <h2 className="text-md font-bold mb-4">ユーザーを削除するとデータが全て消えます。よろしいですか？</h2>
          <input
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="削除する場合はパスワードを入力"
          />

          <div className="flex justify-between space-x-4">
            <button onClick={()=>setIsPasswordModalOpen(false)} className="justify-start text-white bg-blue-500 py-2 px-4 rounded-md">
              キャンセル
            </button>
            <button onClick={handleDestroyUser} className="justify-end text-red-500">
              ユーザーを削除する
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default UserMe;

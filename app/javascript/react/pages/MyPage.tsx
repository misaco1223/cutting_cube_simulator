import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRightFromBracket, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const MyPage = () => {
  const { isLoggedIn, logout, userName } = useAuth();
  return(
    <div className="container p-4">
      <div className="m-4 items-center">
          <h1 className="text-2xl font-bold">マイページ</h1>
      </div>
      <div className="w-full m-4 flex justify-between">
        <div className="justify-start">
          <span>ようこそ、{userName}さん</span>
          <p></p>
        </div>
        <div className="justify-end px-4 flex space-x-4">
          <Link to="/" className="flex flex-col">
          <FontAwesomeIcon icon={faEllipsis} size="lg" className="hover:text-gray-300 transition duration-300"/>
              <span className="text-xs text-gray-600 pt-1">ユーザー詳細</span>
          </Link>
          <Link to="/" onClick={logout} className="flex flex-col">
            <FontAwesomeIcon icon={faRightFromBracket} size="lg" className="hover:text-gray-300 transition duration-300"/>
              <span className="text-xs text-gray-600 pt-1">ログアウト</span>
          </Link>
        </div>
      </div>
      <div className="m-4">
        { !isLoggedIn
        ? <p>ログインが必要です</p>
        : ( <div>
              <span><FontAwesomeIcon icon={faBookmark} className="mr-2" /> あなたの切断コレクション</span>
              <div className="container w-full h-60 bg-white rounded-md border">
                <p className="m-4">準備中...</p>
              </div>
              <span><FontAwesomeIcon icon={faBookmark} className="mr-2 mt-4" /> みんなの切断コレクション</span>
              <div className="container w-full h-60 bg-white rounded-md border">
                <p className="m-4">準備中...</p>
              </div>
            </div>
        )}
      </div>
    </div>
  )
};

export default MyPage;
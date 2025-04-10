import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faRightFromBracket, faEllipsis, faQ, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import BookmarksCarousel from "../features/bookmark/BookmarksCarousel"
import MyBoardsCarousel from "../features/board/mypage/MyBoardsCarousel"

const MyPage = () => {
  const { isLoggedIn, logout, userName } = useAuth();
  return(
    <div className="p-4 w-full">
      <div className="m-4">
          <h1 className="text-xl font-bold p-2">マイページ</h1>
      </div>
      <div className="m-4 flex justify-between">
        <div className="justify-start w-full p-2 my-auto">
          <span>ようこそ、{userName}さん</span>
          <p></p>
        </div>
        <div className="w-full justify-end flex space-x-4">
          <Link to="/user" className="flex flex-col">
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
        : ( <>
            <div>
              <span><FontAwesomeIcon icon={faBookmark} className="mr-2" /> あなたの切断コレクション</span>
              <div className="m-2 w-full h-200 bg-white">
                <BookmarksCarousel/>
              </div>
            </div>
            <div className="my-6">
              <div className="flex space-x-4">
              <span><FontAwesomeIcon icon={faQ} className="mr-2" /> あなたの作った問題ボード</span>
                <Link to="/board/new" className="flex flex-col">
                  <span className="text-xs font-semibold text-red-600 pt-1"><FontAwesomeIcon icon={faPlus} />問題を作成する</span>
                </Link>
              </div>
              <div className="container mt-2 w-full h-200 bg-white">
                <MyBoardsCarousel/>
              </div>
            </div>
            </>
        )}
      </div>
    </div>
  )
};

export default MyPage;
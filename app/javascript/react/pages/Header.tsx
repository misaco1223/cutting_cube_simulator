import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faClockRotateLeft, faCircleUser, faSchool, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn } = useAuth();

  return (
    <header className="bg-yellow-300 py-2 px-6 w-full h-24">
      <nav className="flex justify-between items-center h-full w-full">
        <Link to="/" className="flex items-center justify-start h-full">
          <img src="/logo.png" alt="ロゴ" className="h-full" />
        </Link>
        <ul className="flex space-x-4 justify-end">
          <li className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <Link to="/boards" className="hover:text-gray-300 flex flex-col space-y-1">
                <FontAwesomeIcon icon={faSchool} size="lg" />
                <span className="text-xs text-gray-600">まなび</span>
              </Link>
              <Link to="/history" className="hover:text-gray-300 flex flex-col space-y-1">
                <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/>
                <span className="text-xs text-gray-600">りれき</span>
              </Link>
              <Link to="/hint" className="hover:text-gray-300 flex flex-col space-y-1">
                <FontAwesomeIcon icon={faCircleQuestion} size="lg"/>
                <span className="text-xs text-gray-600">ヒント</span>
              </Link>
            </div>
            {!isLoggedIn ? (
              <Link to="/login" className="flex flex-col space-y-1 hover:text-gray-200">
                <FontAwesomeIcon icon={faRightToBracket} size="lg" className="hover:text-gray-300 transition duration-300"/>
                <span className="text-xs text-gray-600">ログイン</span>
              </Link>
            ) : (
              <Link to="/mypage" className="flex flex-col space-y-1">
                <FontAwesomeIcon icon={faCircleUser} size="lg" className="hover:text-gray-300 transition duration-300"/>
                <span className="text-xs text-gray-600">マイページ</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

// features/cookie/Header.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faClockRotateLeft, faBookmark, faSchool } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <header className="bg-yellow-300 py-2 px-6 w-full h-24">
      <nav className="flex justify-between items-center h-full w-full">
        <Link to="/" className="flex items-center justify-start h-full">
          <img src="/logo.png" alt="ロゴ" className="h-full" />
        </Link>
        <ul className="flex space-x-4 justify-end">
          <li className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <FontAwesomeIcon icon={faSchool} size="xl" />
              <Link to="/history" className="hover:text-gray-300 transition duration-300">
                <FontAwesomeIcon icon={faClockRotateLeft} size="xl"/>
              </Link>
              <FontAwesomeIcon icon={faBookmark} size="xl" />
            </div>
            {!isLoggedIn ? (
              <Link to="/login" className="hover:text-gray-200">ログイン</Link>
            ) : (
              <div className="flex space-x-4">
                <span>{userName ?? "ゲスト"} さん</span>
                <Link to="/" onClick={logout}>
                  <FontAwesomeIcon icon={faRightFromBracket} size="xl" className="hover:text-gray-300 transition duration-300"/>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

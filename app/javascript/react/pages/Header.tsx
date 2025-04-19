import {useState} from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBars, faRightToBracket, faClockRotateLeft, faCircleUser, faSchool, faCircleQuestion, faCube } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-yellow-300 py-2 px-6 w-full h-24">
      <nav className="flex justify-between items-center h-full w-full">
        {/*ロゴ画像*/}
        <Link to="/" className="flex items-center justify-start h-full">
          <img src="/logo.png" alt="ロゴ" className="h-full" />
        </Link>

        {/*スマホの時ハンバーガー*/}
        <button className="relative md:hidden text-2xl text-gray-700" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
        </button>

        {/*PCやタブレットの時ボタン*/}
        <ul className="hidden md:flex space-x-6 justify-end">
          <li>
            <Link to="/home" className="hover:text-gray-300 flex flex-col space-y-1 items-center">
              <FontAwesomeIcon icon={faCube} size="lg" />
              <span className="text-xs text-gray-600">切断</span>
            </Link>
          </li>
          <li>
            <Link to="/boards" className="hover:text-gray-300 flex flex-col space-y-1 items-center">
              <FontAwesomeIcon icon={faSchool} size="lg" />
              <span className="text-xs text-gray-600">まなび</span>
            </Link>
          </li>
          <li>
            <Link to="/history" className="hover:text-gray-300 flex flex-col space-y-1 items-center">
              <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/>
              <span className="text-xs text-gray-600">りれき</span>
            </Link>
          </li>
          <li>
            <Link to="/hint" className="hover:text-gray-300 flex flex-col space-y-1 items-center">
              <FontAwesomeIcon icon={faCircleQuestion} size="lg"/>
              <span className="text-xs text-gray-600">ヒント</span>
            </Link>
          </li>
          <li>
          {!isLoggedIn ? (
              <Link to="/login" className="flex flex-col space-y-1 hover:text-gray-200 items-center">
                <FontAwesomeIcon icon={faRightToBracket} size="lg" className="hover:text-gray-300 transition duration-300"/>
                <span className="text-xs text-gray-600">ログイン</span>
              </Link>
            ) : (
              <Link to="/mypage" className="hover:text-gray-200 flex flex-col space-y-1 items-center">
                <FontAwesomeIcon icon={faCircleUser} size="lg" className="hover:text-gray-300 transition duration-300"/>
                <span className="text-xs text-gray-600">マイページ</span>
              </Link>
            )}
          </li>
        </ul>
      </nav>

      {/*ハンバーガ中身*/}
      {isMenuOpen && (
        <div className="absolute top-0.5 right-1 md:hidden mt-2 space-y-4 bg-gray-200 px-6 py-8 shadow z-50">
          <span className="flex justify-end mb-8"><FontAwesomeIcon icon={faXmark} size="xl" onClick={toggleMenu}/></span>

          <ul className="space-y-4">
            <li>
              <Link to="/home" className="hover:text-gray-300 flex flex-col space-y-1 items-center" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faCube} size="lg" />
                <span className="text-xs text-gray-600">切断</span>
              </Link>
            </li>

            <li>
              <Link to="/boards" className="hover:text-gray-300 flex flex-col space-y-1 items-center" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faSchool} size="lg" />
                <span className="text-xs text-gray-600">まなび</span>
              </Link>
            </li>

            <li>
              <Link to="/history" className="hover:text-gray-300 flex flex-col space-y-1 items-center" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faClockRotateLeft} size="lg"/>
                <span className="text-xs text-gray-600">りれき</span>
              </Link>
            </li>

            <li>
              <Link to="/hint" className="hover:text-gray-300 flex flex-col space-y-1 items-center" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faCircleQuestion} size="lg"/>
                <span className="text-xs text-gray-600">ヒント</span>
              </Link>
            </li>

            <li>
            {!isLoggedIn ? (
                <Link to="/login" className="flex flex-col space-y-1 hover:text-gray-200 items-center" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faRightToBracket} size="lg" className="hover:text-gray-300 transition duration-300"/>
                  <span className="text-xs text-gray-600">ログイン</span>
                </Link>
              ) : (
                <Link to="/mypage" className="hover:text-gray-200 flex flex-col space-y-1 items-center" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faCircleUser} size="lg" className="hover:text-gray-300 transition duration-300"/>
                  <span className="text-xs text-gray-600">マイページ</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;

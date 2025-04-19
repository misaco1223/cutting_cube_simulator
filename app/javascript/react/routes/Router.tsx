import { Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../features/user/LoginForm";
import CreateUserForm from "../features/user/CreateUserForm";
import Result from "../pages/Result"
import History from "../pages/History"
import MyPage from "../pages/MyPage"
import Hint from "../pages/Hint"
import Boards from "../pages/Boards"
import CreateBoard from "../features/board/create/CreateBoard"
import Board from "../pages/Board";
import { PrivacyPolicy } from "../pages/Footer";
import { ServiceTerms } from "../pages/Footer";
import UserMe from "../features/user/UserMe"
import LandingPage from "../pages/LandingPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/user/new" element={<CreateUserForm />} />
      <Route path="/user" element={<UserMe/>} />
      <Route path="/result/:id" element={<Result />} />
      <Route path="/history" element={<History/>} />
      <Route path="/mypage" element={<MyPage/>} />
      <Route path="/hint" element={<Hint/>} />
      <Route path="/boards" element={<Boards/>}/>
      <Route path="/board/new/*" element={<CreateBoard/>}/>
      <Route path="/board/:id" element={<Board/>}/>
      <Route path="/privacy_policy" element={<PrivacyPolicy/>} />
      <Route path="/service_terms" element={<ServiceTerms/>} />
      <Route path="/" element={<LandingPage/>} />
    </Routes>
  )
};

export default Router;
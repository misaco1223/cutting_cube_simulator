import { Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../features/user/LoginForm";
import CreateUserForm from "../features/user/CreateUserForm";
import Result from "../pages/Result"
import History from "../pages/History"
import MyPage from "../pages/MyPage"
import Hint from "../pages/Hint"
import Board from "../pages/Board"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/users" element={<CreateUserForm />} />
      <Route path="/result/:id" element={<Result />} />
      <Route path="/history" element={<History/>} />
      <Route path="/mypage" element={<MyPage/>} />
      <Route path="/hint" element={<Hint/>} />
      <Route path="/board" element={<Board/>}/>
    </Routes>
  )
};

export default Router;
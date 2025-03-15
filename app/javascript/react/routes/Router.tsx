import { Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../features/user/LoginForm";
import CreateUserForm from "../features/user/CreateUserForm";
import Result from "../pages/Result"

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/users" element={<CreateUserForm />} />
      <Route path="/result/:id" element={<Result />} />
    </Routes>
  )
};

export default Router;
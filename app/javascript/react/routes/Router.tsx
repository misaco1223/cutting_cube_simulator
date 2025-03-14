import { Routes, Route} from "react-router-dom";
import Home from "../pages/Home";
import LoginForm from "../features/user/LoginForm";
import CreateUserForm from "../features/user/CreateUserForm";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/users" element={<CreateUserForm />} />
    </Routes>
  )
};

export default Router;
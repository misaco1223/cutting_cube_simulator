import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./routes/Router";
import CookieConsent from "./features/cookie/CookieConsent";
import Header from "./features/Header";

const App = () => {
  return(
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Header/>
          <Router/>
        </BrowserRouter>
        <CookieConsent/>
      </AuthProvider>
    </div>
  );
};

export default App;
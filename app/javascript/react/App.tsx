import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Router from "./routes/Router";
import CookieConsent from "./features/cookie/CookieConsent";
import Header from "./pages/Header";
import { Footer } from "./pages/Footer";

const App = () => {
  return(
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header/>
            <div className="flex-grow">
              <Router/>
            </div>
            <Footer/>
          </div>
        </BrowserRouter>
        <CookieConsent/>
      </AuthProvider>
    </div>
  );
};

export default App;
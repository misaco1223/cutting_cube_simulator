import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import CookieConsent from "./features/cookie/CookieConsent";

const App = () => {
  return(
    <div className="container mx-auto mt-28 px-5">
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
      <CookieConsent/>
    </div>
  );
};

export default App;
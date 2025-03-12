import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";

const App = () => {
  return(
    <div className="container mx-auto mt-28 px-5">
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </div>
  );
};

export default App;
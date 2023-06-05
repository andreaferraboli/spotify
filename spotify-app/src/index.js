import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import MyNavbar from "./components/navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <div className="container mt-2" style={{ marginTop: 40 }}>
        <Routes>
          <Route exact path="/">
            <Home />
          </Route>
          </Routes>
          <Routes>
          <Route path="/layout">
            <Layout />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

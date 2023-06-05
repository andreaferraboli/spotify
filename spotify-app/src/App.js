import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/navbar';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './components/home';

import './App.css';

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

export default App;

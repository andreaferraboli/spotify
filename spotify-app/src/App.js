import 'bootstrap/dist/css/bootstrap.min.css';
import MyNavbar from './components/navbar';
import SideBar from './components/Sidebar'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from '../src/pages/Home';
import Layout from '../src/pages/Layout';

import '../src/style/App.css';

function App() {
  return (
    <>
    <BrowserRouter>
      <SideBar />
      <div className="container mt-2" style={{ marginTop: 40 }}>
        <Routes>
          <Route exact path="/" Component={Home}>
          </Route>
        </Routes>
        <Routes>
          <Route exact path="/layout" Component={Layout}>
          </Route>
        </Routes>
      </div>
    </BrowserRouter></>
  );
}

export default App;

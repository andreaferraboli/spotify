import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/Sidebar'
import Navbar from './components/navbar'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from '../src/pages/Home';
import Layout from '../src/pages/Layout';

import '../src/style/App.css';

function App() {
  return (
    <>
      <SideBar />
      <Navbar/>
    <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={Home}>
          </Route>
        </Routes>
        <Routes>
          <Route exact path="/layout" Component={Layout}>
          </Route>
        </Routes>
    </BrowserRouter></>
  );
}

export default App;

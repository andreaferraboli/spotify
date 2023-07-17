import 'bootstrap/dist/css/bootstrap.min.css';
import SideBar from './components/Sidebar'
import Navbar from './components/navbar'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from '../src/pages/Home';
import Layout from '../src/pages/Layout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import '../src/style/App.css';

function App() {
  return (
    <><Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={0} md={2} lg={2}>
          <SideBar/>
        </Grid>
        <Grid direction="column" item xs={12} md={10} lg={10}>
          <Navbar/>
          <Home/>
        </Grid>
      </Grid>
    </Box>
    {/* <BrowserRouter>
        <Routes>
          <Route exact path="/" Component={Home}>
          </Route>
        </Routes>
        <Routes>
          <Route exact path="/layout" Component={Layout}>
          </Route>
        </Routes>
      </BrowserRouter> */}
      </>
  );
}

export default App;

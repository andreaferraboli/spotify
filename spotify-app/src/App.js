import React, { useEffect, useState } from "react";
import SideBar from './components/Sidebar'
import Navbar from './components/navbar'
import Home from '../src/pages/Home';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import "./style/home.css";

function App() {
  const [user, setUser] = useState({ my_playlists: [], favourite_artists:[]  });

  useEffect(() => {
    // Funzione per ottenere le playlist dall'API del database
    const fetchUser = async () => {
      const user_id = "64b6c955fd83c6a0836c3419";

      try {
        const response = await fetch(`http://localhost:3100/user/${user_id}?apikey=123456`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            console.log(data[0]);
            setUser(data[0]);
          }
        } else {
          console.log('Errore nella richiesta');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Chiamata alla funzione per ottenere le playlist quando il componente Sidebar viene montato
    fetchUser();
  }, []);
  return (
    <><Box className="home-box">
      <Grid container spacing={0}>
        <Grid item xs={0} md={2} lg={2} >
          <SideBar playlists={user.my_playlists}/>
        </Grid>
        <Grid direction="column" item xs={12} md={10} lg={10}>
          <Navbar user={user}/>
          <Home user={user} />
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

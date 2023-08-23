import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import SideBar from './components/Sidebar';
import Navbar from './components/navbar';
import NewPlaylist from './components/NewPlaylist';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Search from '../src/pages/Search';
import Album from '../src/pages/Album';
import Playlist from '../src/pages/Playlist';
import Artist from '../src/pages/Artist';
import Account from '../src/pages/Account';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import "./style/home.css";

function App() {
  const defaultUser = { my_playlists: [], favourite_artists: [] };
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) !== null ? JSON.parse(localStorage.getItem("user")) : defaultUser);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [query, setQuery] = useState('');


  // Funzione per ottenere le playlist dall'API del database
  useEffect(() => {
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : defaultUser;
  
    if (storedUser && storedUser._id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3100/user/${storedUser._id}?apikey=123456`);
          if (response.ok) {
            const data = await response.json();
  
            // Verifica se i dati dell'utente sono diversi da quelli presenti in localStorage
            if (JSON.stringify(data[0]) !== JSON.stringify(user)) {
              setUser(data[0]);
              // Aggiorna anche i dati in localStorage
              localStorage.setItem('user', JSON.stringify(data[0]));
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
    }
  }, []);

  useEffect(() => {
    if (query !== null && query !== undefined && query !== '')
      navigate(`/search/${query}`);
  }, [query])


  const navigate = useNavigate(); // Hook per ottenere la funzione di navigazione

  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    navigate(`/playlist/${playlistId}`);
  };

  const handleArtistClick = (artistId) => {
    setSelectedArtistId(artistId);
    navigate(`/artist/${artistId}`);
  };

  const handleBackToHome = () => {
    setSelectedPlaylistId(null);
    setSelectedArtistId(null);
    navigate(`/`);
  };

  const handleLogin = async (user) => {
    if (user?._id) {
      try {
        const response = await fetch(`http://localhost:3100/user/${user._id}?apikey=123456`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setUser(data[0]);
          }
        } else {
          console.log('Errore nella richiesta');
        }
      } catch (error) {
        console.log(error);
      }

    } else {
      setUser(user)
    }
    localStorage.setItem('user', JSON.stringify(user));
    navigate(`/`);

  };

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div>
      {!(isLoginPage || isRegisterPage) && ( // Condizione per mostrare il Box e Grid esterni
        <Box className="home-box">
          <Grid container spacing={0}>
            {!isLoginPage && !isRegisterPage && (
              <Grid item xs={0} md={2} lg={2}>
                <SideBar playlists={user?.my_playlists} onPlaylistClick={handlePlaylistClick} />
              </Grid>
            )}
            <Grid style={{ height: "100%" }} item xs={12} md={10} lg={10}>
              {!isLoginPage && !isRegisterPage && <Navbar user={user} setQuery={setQuery} />}
              <Routes>
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search/:query" element={<Search user={user} />} />

                <Route path="/newPlaylist" element={<NewPlaylist user={user} onBack={handleBackToHome} />} />
                <Route path="/myAccount" element={<Account user={user} onBack={handleBackToHome} handleLogin={handleLogin} />} />
                <Route
                  path="/playlist/:playlistId"
                  element={
                    <Playlist
                      user={user}
                      playlistId={selectedPlaylistId}
                      onBack={handleBackToHome}
                    />
                  }
                />
                <Route
                  path="/album/:albumId"
                  element={
                    <Album
                      user={user}
                      onBack={handleBackToHome}
                    />
                  }
                />
                <Route
                  path="/artist/:artistId"
                  element={
                    <Artist
                      user={user}
                      artistId={selectedArtistId}
                      onBack={handleBackToHome}
                    />
                  }
                />
                <Route
                  path="/"
                  element={
                    <Home
                      user={user}
                      onPlaylistClick={handlePlaylistClick}
                      onArtistClick={handleArtistClick}
                    />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Box>
      )}
      {isLoginPage && <Login handleLogin={handleLogin} />}
      {isRegisterPage && <Register />}
    </div>
  );
}

export default App;
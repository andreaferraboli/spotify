import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import SideBar from './components/Sidebar';
import Navbar from './components/navbar';
import NewPlaylist from './components/NewPlaylist';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Search from '../src/pages/Search';
import Playlist from '../src/pages/Playlist';
import Artist from '../src/pages/Artist';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import "./style/home.css";

function App() {
  const [user, setUser] = useState({ my_playlists: [], favourite_artists: [] });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [query, setQuery] = useState('');


  // Funzione per ottenere le playlist dall'API del database
  useEffect(() => {
    // Funzione per ottenere le playlist dall'API del database
    const fetchUser = async () => {
      const user_id = "64d22a8c6b6f0c5f086a149c";

      try {
        const response = await fetch(`http://localhost:3100/user/${user_id}?apikey=123456`);
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
    };

    // Chiamata alla funzione per ottenere le playlist quando il componente Sidebar viene montato
    fetchUser();
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

  const handleLogin = (user) => {
    setUser(user);
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
                <SideBar playlists={user.my_playlists} onPlaylistClick={handlePlaylistClick} />
              </Grid>
            )}
            <Grid item xs={12} md={10} lg={10}>
              {!isLoginPage && !isRegisterPage && <Navbar user={user} setQuery={setQuery} />}
              <Routes>
                <Route path="/login" element={<Login handleLogin={handleLogin} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search/:query" element={<Search />} />

                <Route path="/newPlaylist" element={<NewPlaylist user={user} onBack={handleBackToHome} />} />
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
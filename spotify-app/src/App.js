import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SideBar from './components/Sidebar';
import Navbar from './components/navbar';
import Home from '../src/pages/Home';
import Playlist from '../src/pages/Playlist';
import Artist from '../src/pages/Artist';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import "./style/home.css";

function App() {
  const [user, setUser] = useState({ my_playlists: [], favourite_artists: [] });
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);


    // Funzione per ottenere le playlist dall'API del database
    useEffect(() => {
      // Funzione per ottenere le playlist dall'API del database
      const fetchUser = async () => {
        const user_id = "64ce1a3a831ac534ca7695f9";
  
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
  
    return (
        <Box className="home-box">
          <Grid container spacing={0}>
            <Grid item xs={0} md={2} lg={2}>
              <SideBar playlists={user.my_playlists} onPlaylistClick={handlePlaylistClick} />
            </Grid>
            <Grid direction="column" item xs={12} md={10} lg={10}>
              <Navbar user={user} />
              <Routes>
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
                      onPlaylistClick={handlePlaylistClick} // Passa la funzione senza chiamare useNavigate qui
                      onArtistClick={handleArtistClick} // Passa la funzione senza chiamare useNavigate qui
                    />
                  }
                />
              </Routes>
            </Grid>
          </Grid>
        </Box>
    );
  }
  
  export default App;
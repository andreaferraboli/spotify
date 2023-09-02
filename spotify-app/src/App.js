import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import SideBar from './components/Sidebar';
import Navbar from './components/navbar';
import NewPlaylist from './components/NewPlaylist';
import Home from '../src/pages/Home';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Search from '../src/pages/Search';
import SearchTrack from '../src/pages/SearchTrack';
import Album from '../src/pages/Album';
import Track from '../src/pages/Track';
import Playlist from '../src/pages/Playlist';
import Artist from '../src/pages/Artist';
import Account from '../src/pages/Account';
import { useMediaQuery, Drawer } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserPage from '../src/pages/User';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import "./styles/home.css";
const theme = createTheme();
function App() {
  const defaultUser = { my_playlists: [], favourite_artists: [] };
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) !== null ? JSON.parse(localStorage.getItem("user")) : defaultUser);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [query, setQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const apiKey = process.env.REACT_APP_API_KEY;
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Funzione per ottenere le playlist dall'API del database
  useEffect(() => {
    const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem("user")) : defaultUser;

    if (storedUser && storedUser._id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3100/user/${storedUser._id}?apikey=${apiKey}`);
          if (response.ok) {
            const data = await response.json();

            // Verifica se i dati dell'utente sono diversi da quelli presenti in localStorage
            if (JSON.stringify(data[0]) !== JSON.stringify(user)) {
              console.log("useer", data[0])
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
        const response = await fetch(`http://localhost:3100/user/${user._id}?apikey=${apiKey}`);
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  console.log(isSmallScreen);
  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  return (
    <>
      <ThemeProvider theme={theme}>


        <div>
          {!(isLoginPage || isRegisterPage) && ( // Condizione per mostrare il Box e Grid esterni
            <Box className="home-box">
              <Grid container spacing={0}>
                {!isLoginPage && !isRegisterPage && (
                  <Grid item xs={0} md={2} lg={2}>
                    {isSmallScreen ? (
                      <Drawer
                        anchor="left"
                        open={isDrawerOpen}
                        onClose={closeDrawer}
                      >
                        <SideBar
                          playlists={user?.my_playlists}
                          public_playlists={user?.playlists}
                          onPlaylistClick={handlePlaylistClick}
                          onDrawerToggle={handleDrawerToggle}
                        />
                      </Drawer>
                    ) : (
                      <SideBar
                        playlists={user?.my_playlists}
                        public_playlists={user?.playlists}
                        onPlaylistClick={handlePlaylistClick}
                      />
                    )}
                  </Grid>
                )}
                <Grid style={{ height: "100%" }} item xs={12} md={10} lg={10}>
                  {!isLoginPage && !isRegisterPage && <Navbar user={user} setQuery={setQuery} onDrawerToggle={handleDrawerToggle} isSmallScreen={isSmallScreen} />}
                  <Routes>
                    <Route path="/login" element={<Login handleLogin={handleLogin} snackbar={showSnackbar} />} />
                    <Route path="/register" element={<Register snackbar={showSnackbar} />} />
                    <Route path="/search/:query" element={<Search user={user} />} />
                    <Route path="/searchTrack/:idTrack" element={<SearchTrack user={user} />} />

                    <Route path="/newPlaylist" element={<NewPlaylist user={user} onBack={handleBackToHome} snackbar={showSnackbar} />} />
                    <Route path="/myAccount" element={<Account user={user} onBack={handleBackToHome} handleLogin={handleLogin} snackbar={showSnackbar} />} />
                    <Route path="/user/:userId" element={<UserPage user={user} onBack={handleBackToHome} />} />
                    <Route
                      path="/playlist/:playlistId"
                      element={<Playlist
                        user={user}
                        playlistId={selectedPlaylistId}
                        onBack={handleBackToHome}
                        snackbar={showSnackbar} />} />
                    <Route
                      path="/album/:albumId"
                      element={<Album
                        user={user}
                        onBack={handleBackToHome}
                        snackbar={showSnackbar} />} />
                    <Route
                      path="/track/:trackId"
                      element={<Track
                        onBack={handleBackToHome} />} />
                    <Route
                      path="/artist/:artistId"
                      element={<Artist
                        user={user}
                        artistId={selectedArtistId}
                        onBack={handleBackToHome}
                        snackbar={showSnackbar} />} />
                    <Route
                      path="/"
                      element={<Home
                        user={user}
                        onPlaylistClick={handlePlaylistClick}
                        onArtistClick={handleArtistClick}
                        snackbar={showSnackbar} />} />
                  </Routes>
                </Grid>
              </Grid>
            </Box>
          )}
          {isLoginPage && <Login handleLogin={handleLogin} snackbar={showSnackbar} />}
          {isRegisterPage && <Register snackbar={showSnackbar} />}
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </>
  );
}

export default App;
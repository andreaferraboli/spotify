import React, {useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
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
import Library from '../src/pages/Library';
import {Drawer, useMediaQuery} from '@mui/material';
import Scrollbar from "react-scrollbars-custom";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import UserPage from '../src/pages/User';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import "./styles/home.css";

const theme = createTheme();

function App() {
    const defaultUser = {my_playlists: [], favourite_artists: []};
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
                            setUser(data[0]);
                            // Aggiorna anche i dati in localStorage
                            localStorage.setItem('user', JSON.stringify(data[0]));
                        }
                    } else {
                        showSnackbar('Errore nella richiesta', "error");
                    }
                } catch (error) {
                    showSnackbar(error, "error");
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
                    showSnackbar('Errore nella richiesta di login', "error");
                }
            } catch (error) {
                showSnackbar(error, "error");
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
                                    <Grid item xs={0} md={1.5} lg={1.5}>
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

                                <Grid style={{height: "100vh"}} item xs={12} md={10.5} lg={10.5}>
                                    {!isLoginPage && !isRegisterPage &&
                                        <Navbar user={user} setQuery={setQuery} onDrawerToggle={handleDrawerToggle}
                                                isSmallScreen={isSmallScreen}/>}

                                    <Scrollbar style={{height: "94vh", marginBottom: "5%"}}>
                                        <Routes>
                                            <Route path="/login" element={<Login handleLogin={handleLogin}
                                                                                 snackbar={showSnackbar}/>}/>
                                            <Route path="/register" element={<Register snackbar={showSnackbar}/>}/>
                                            <Route path="/search/:query"
                                                   element={<Search user={user} snackbar={showSnackbar}/>}/>
                                            <Route path="/searchTrack/:idTrack"
                                                   element={<SearchTrack user={user} snackbar={showSnackbar}/>}/>

                                            <Route path="/newPlaylist"
                                                   element={<NewPlaylist user={user} snackbar={showSnackbar}/>}/>
                                            <Route path="/myAccount"
                                                   element={<Account user={user} handleLogin={handleLogin}
                                                                     snackbar={showSnackbar}/>}/>
                                            <Route path="/myLibrary"
                                                   element={<Library user={user} snackbar={showSnackbar}/>}/>
                                            <Route path="/user/:userId"
                                                   element={<UserPage user={user} snackbar={showSnackbar}/>}/>
                                            <Route
                                                path="/playlist/:playlistId"
                                                element={<Playlist
                                                    user={user}
                                                    playlistId={selectedPlaylistId}
                                                    snackbar={showSnackbar}/>}/>
                                            <Route
                                                path="/album/:albumId"
                                                element={<Album
                                                    user={user}
                                                    snackbar={showSnackbar}/>}/>
                                            <Route
                                                path="/track/:trackId"
                                                element={<Track
                                                    snackbar={showSnackbar}/>}/>
                                            <Route
                                                path="/artist/:artistId"
                                                element={<Artist
                                                    user={user}
                                                    artistId={selectedArtistId}
                                                    snackbar={showSnackbar}/>}/>
                                            <Route
                                                path="/"
                                                element={
                                                    <Home
                                                        user={user}
                                                        onPlaylistClick={handlePlaylistClick}
                                                        onArtistClick={handleArtistClick}
                                                        snackbar={showSnackbar}/>
                                                }/>
                                        </Routes>
                                        <div style={{height: "5vh"}}>
                                        </div>
                                    </Scrollbar>
                                </Grid>

                            </Grid>
                        </Box>
                    )}
                    {isLoginPage && <Login handleLogin={handleLogin} snackbar={showSnackbar}/>}
                    {isRegisterPage && <Register snackbar={showSnackbar}/>}
                </div>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: '100%'}}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </>
    );
}

export default App;
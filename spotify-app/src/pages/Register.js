import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import LoadArtist from "../components/LoadArtist"
import LoadGenres from "../components/LoadGenres"

import "../styles/login.css"; // Importa il file CSS con gli stili personalizzati

const RegisterPage = ({ snackbar }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [favouriteArtists, setFavouriteArtists] = useState([]);
    const [loadGenres, setLoadGenres] = useState(false);
    const [loadArtist, setLoadArtist] = useState(false);

    const navigate = useNavigate();
    const getFavouriteArtists = () => {
        return favouriteArtists.length;
    };

    const handleRegister = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            // Effettua la richiesta POST al server Node
            let response = await axios.post(`https://spotify-server-kohl.vercel.app/register?apikey=${apiKey}`, {
                "name": firstName,
                "surname": lastName,
                "profile_name": username,
                "image": '',
                "email": email,
                "password": password,
                "favourite_genres": favouriteGenres,
                "favourite_artists": favouriteArtists,
                "my_playlists": []
            });

            // Controlla la risposta del server
            if (response.status === 201) {
                if (imageFile !== "") {
                    await publicFile(imageFile, response.data.userId);
                }
                snackbar('Registrazione effettuata con successo!', "success");
                navigate("/login")
            } else {
                snackbar('Errore durante la registrazione', "error");
            }
        } catch (error) {
            snackbar('Errore durante la richiesta di registrazione:' + error.message, "error");
        }
    };

    const handleProfileImageChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setImageFile(selectedFile)
        }
    };

    async function publicFile(selectedFile, userId) {
        const apiKey = process.env.REACT_APP_API_KEY;
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`https://spotify-server-kohl.vercel.app/uploadFile/${userId}?apikey=${apiKey}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                snackbar("informazioni caricate correttamente", "success")
                const responseImage = await axios.post(`https://spotify-server-kohl.vercel.app/setUserImage/${userId}?apikey=${apiKey}`, { "fileUrl": response.data.fileUrl })
                if (responseImage.status === 200) {
                    snackbar("immagine caricata correttamente", "success")
                    navigate("/login")
                } else {
                    snackbar("immagine non caricata correttamente", "error")
                }
            } else {
                snackbar('Errore durante l\'upload del file.', "error");
            }
        } catch (error) {
            snackbar('Errore:' + error, "error");
        }
    }

    const validateRegistrationData = async () => {
        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            snackbar('Compila tutti i campi.', "warning");
            return false;
        }

        if (!validateEmail(email)) {
            snackbar('Inserisci un indirizzo email valido.', "warning");
            return false;
        }
        if (await checkDuplicateEmail(email) === true) {
            snackbar("email già presente, prova con un'altra", "warning");
            return false;
        }
        if (password !== confirmPassword) {
            snackbar('Le password non corrispondono.', "warning");
            return false;
        }

        return true;
    };
    const checkDuplicateEmail = async (email) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            const response = await axios.get(`https://spotify-server-kohl.vercel.app/check-email/${email}?apikey=${apiKey}`);
            // Controlla la risposta dal server
            if (response.data.exists === true) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return true;
        }
    };

    const validateEmail = (email) => {
        // Utilizza una regex per validare l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const loadedGenres = async () => {
        if (await validateRegistrationData()) {
            snackbar("informazioni salvate correttamente", "success")
            setLoadGenres(true);
            setLoadArtist(false);
        }
    }
    const loadedArtist = () => {
        setLoadArtist(true);
        setLoadGenres(false);
    }
    return (
        <>
            <div className='background'>
                {loadGenres ? (
                    <LoadGenres setFavouriteGenres={setFavouriteGenres} loadArtist={loadedArtist} snackbar={snackbar} />
                ) : loadArtist ? (
                    <LoadArtist
                        favouriteGenres={favouriteGenres}
                        getFavouriteArtists={getFavouriteArtists}
                        setFavouriteArtists={setFavouriteArtists}
                        register={handleRegister}
                        snackbar={snackbar}
                    ></LoadArtist>
                ) : (
                    <><Grid container direction="column" alignItems="center" spacing={3} className="container">
                        <Grid item>
                            <Link to="/">
                                <img
                                    src="https://firebasestorage.googleapis.com/v0/b/spotify-7a2ad.appspot.com/o/ScreenShot_20230917174348-transformed.png?alt=media&token=34269302-a665-4cf8-9622-f72d95d25727"
                                    alt="Spotify Logo"
                                    className="logo"
                                />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4" className="title">
                                Registrati
                            </Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Nome"
                                variant="outlined"
                                fullWidth
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="input" /><TextField
                                label="Cognome"
                                variant="outlined"
                                fullWidth
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="input" />

                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input" />
                            <TextField
                                label="Nome utente"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input" />
                            <TextField
                                label="Password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input" /><TextField
                                label="Conferma password"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input" />
                            <Typography style={{ paddingLeft: "10%" }} variant="body2">Immagine Profilo</Typography>
                            <TextField
                                type="file"
                                variant="outlined"
                                fullWidth
                                onChange={(e) => handleProfileImageChange(e)}
                                className="input" />
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={loadedGenres}
                                className="button"
                            >
                                Avanti
                            </Button>
                        </Grid>
                        <Grid item>
                            <Typography variant="body2">
                                Hai già un account? <Link to="/login" className='link'>Accedi qui</Link>
                            </Typography>
                        </Grid>
                    </Grid>

                    </>
                )}
            </div>
        </>

    );
};

export default RegisterPage;



import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Grid, TextField, Typography} from '@mui/material';
import axios from 'axios';
import "../styles/login.css";

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            const response = await axios.post(`https://spotify-server-kohl.vercel.app/login?apikey=${apiKey}`, {
                email,
                password,
            });

            if (response.status === 200) {
                props.snackbar("Login avvenuto con successo!", "success");
                props.handleLogin(response.data);
            } else if (response.status === 404) {
                props.snackbar("Combinazione email/password errata", "warning");
            } else {
                props.snackbar("Errore durante la richiesta di login", "error");
            }
        } catch (error) {
            if (error.response ?? '') {
                if (error.response.status === 404) {
                    props.snackbar("Combinazione email/password errata", "warning");

                } else if (error.message.includes("Network Error")) {
                    props.snackbar("Impossibile raggiungere il server", "error");
                } else {
                    props.snackbar('Errore durante la richiesta di login:' + error.message, "error");
                }
            } else {
                props.snackbar('Errore,server non raggiungibile', "error");
            }
        }
    };


    return (
        <>
            <div className='background'>

                <Grid container direction="column" alignItems="center" spacing={3} className="container">
                    <Grid item>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/800px-Spotify_logo_with_text.svg.png"
                            alt="Spotify Logo" className="logo"/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4" className="title">
                            Accedi
                        </Typography>
                    </Grid>
                    <Grid item>

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"/>

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"/>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleLogin}
                            className="button"
                        >
                            Accedi
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            Non hai un account? <Link to="/register" className='link'>Registrati</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </div>

        </>
    );
};

export default LoginPage;
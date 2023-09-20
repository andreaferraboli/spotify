import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Grid, TextField, Typography} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import "../styles/login.css";

const LoginPage = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleLogin = async () => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            const response = await axios.post(`http://localhost:3100/login?apikey=${apiKey}`, {
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
                            type={showPassword ? 'text' : 'password'} // Cambia il tipo in base a showPassword
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={toggleShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon className="visible-icon"/> :
                                                <VisibilityOffIcon className="visible-icon"/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import "../style/login.css";

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Implementa la logica di autenticazione qui
    try {
      // Effettua la richiesta POST al server Node
      const response = await axios.post('http://localhost:3100/login', {
        email,
        password,
      });


      // Controlla la risposta del server
      if (response.status === 200) {
        props.handleLogin(response.data)
        // navigate(`/`);
        // Aggiungi qui il codice per gestire il successo del login, come il reindirizzamento alla home page
      } else {
        console.log('Errore durante il login');
        // Aggiungi qui il codice per gestire l'errore durante il login
      }
    } catch (error) {
      console.log('Errore durante la richiesta di login:', error.message);
      // Aggiungi qui il codice per gestire l'errore di rete o altre eccezioni
    }
  };

  return (
    <div className='background'>

      <Grid container direction="column" alignItems="center" spacing={3} className="container">
        <Grid item>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/800px-Spotify_logo_with_text.svg.png" alt="Spotify Logo" className="logo" />
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
            className="input"
          />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
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

  );
};

export default LoginPage;
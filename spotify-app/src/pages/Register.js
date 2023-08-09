import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import LoadArtist from "../components/LoadArtist"
import LoadGenres from "../components/LoadGenres"

import "../style/login.css"; // Importa il file CSS con gli stili personalizzati

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favouriteGenres, setFavouriteGenres] = useState([]);
  const [favouriteArtist, setFavouriteArtist] = useState([]);
  const [loadGenres, setLoadGenres] = useState(false);
  const [loadArtist, setLoadArtist] = useState(false);
  const handleRegister = async () => {
    try {
      // Verifica se le password corrispondono prima di inviare la richiesta
      if (password !== confirmPassword) {
        console.log('Le password non corrispondono.');
        return;
      }

      // Effettua la richiesta POST al server Node
      const response = await axios.post('http://localhost:3100/register',
        {
          "name": firstName,
          "surname": lastName,
          "profile_name": username,
          "email": email,
          "password": password,
        }
      );

      // Controlla la risposta del server
      if (response.status === 201) {
        console.log('Registrazione effettuata con successo!');
        // Aggiungi qui il codice per gestire il successo della registrazione, come il reindirizzamento alla pagina di login
      } else {
        console.log('Errore durante la registrazione');
        // Aggiungi qui il codice per gestire l'errore durante la registrazione
      }
    } catch (error) {
      console.log('Errore durante la richiesta di registrazione:', error.message);
      // Aggiungi qui il codice per gestire l'errore di rete o altre eccezioni
    }
  };

  const loadedGenres = () => {
    setLoadGenres(true);
    setLoadArtist(false)
  }
  const loadedArtist = () => {
    setLoadArtist(true);
    setLoadGenres(false);
  }
  return (
    <div className='background'>
      {loadGenres ? (
        <LoadGenres setFavouriteGenres={setFavouriteGenres} loadArtist={loadedArtist} />
      ) : loadArtist ? (
        <LoadArtist favouriteGenres={favouriteGenres} setFavouriteArtist={setFavouriteArtist} register={handleRegister}></LoadArtist>
      ) : (
        <Grid container direction="column" alignItems="center" spacing={3} className="container">
          <Grid item>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/800px-Spotify_logo_with_text.svg.png" alt="Spotify Logo" className="logo" />
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
              className="input"
            /><TextField
              label="Cognome"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input"
            />

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <TextField
              label="Nome utente"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            /><TextField
              label="Conferma password"
              variant="outlined"
              fullWidth
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
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
              Hai già un account? <Link to="/login">Accedi qui</Link>
            </Typography>
          </Grid>
        </Grid>
      )}

    </div>

  );
};

export default RegisterPage;
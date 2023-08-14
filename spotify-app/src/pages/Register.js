import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, TextField, Button, Typography, Snackbar } from '@mui/material';
import axios from 'axios';
import LoadArtist from "../components/LoadArtist"
import LoadGenres from "../components/LoadGenres"
import MuiAlert from '@mui/material/Alert';

import "../style/login.css"; // Importa il file CSS con gli stili personalizzati

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [favouriteGenres, setFavouriteGenres] = useState([]);
  const [favouriteArtists, setFavouriteArtists] = useState([]);
  const [loadGenres, setLoadGenres] = useState(false);
  const [loadArtist, setLoadArtist] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  const getFavouriteArtists = () => {
    return favouriteArtists.length;
  };

  const handleRegister = async () => {
    try {
      // Verifica se le password corrispondono prima di inviare la richiesta


      // Effettua la richiesta POST al server Node
      const response = await axios.post('http://localhost:3100/register',
        {
          "name": firstName,
          "surname": lastName,
          "profile_name": username,
          "email": email,
          "password": password,
          "favourite_genres": favouriteGenres,
          "favourite_artists": favouriteArtists
        }
      );

      // Controlla la risposta del server
      if (response.status === 201) {
        console.log('Registrazione effettuata con successo!');
        window.location.href = "/login";
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
  const validateRegistrationData = async () => {
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      showSnackbar('Compila tutti i campi.');
      return false;
    }

    if (!validateEmail(email)) {
      showSnackbar('Inserisci un indirizzo email valido.');
      return false;
    }
    if (await checkDuplicateEmail(email) === true) {
      showSnackbar("email già presente, prova con un'altra");
      return false;
    }
    if (password !== confirmPassword) {
      showSnackbar('Le password non corrispondono.');
      return false;
    }

    return true;
  };
  const checkDuplicateEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3100/check-email/${email}`);
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
      setLoadGenres(true);
      setLoadArtist(false);
    }
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
        <LoadArtist favouriteGenres={favouriteGenres} getFavouriteArtists={getFavouriteArtists} setFavouriteArtists={setFavouriteArtists} register={handleRegister}></LoadArtist>
      ) : (
        <><Grid container direction="column" alignItems="center" spacing={3} className="container">
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
        </Grid><Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar></>
      )}

    </div>

  );
};

export default RegisterPage;
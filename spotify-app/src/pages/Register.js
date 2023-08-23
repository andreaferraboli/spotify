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
  const [imageFile, setImageFile] = useState('');
  const [favouriteGenres, setFavouriteGenres] = useState([]);
  const [favouriteArtists, setFavouriteArtists] = useState([]);
  const [loadGenres, setLoadGenres] = useState(false);
  const [loadArtist, setLoadArtist] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const getFavouriteArtists = () => {
    return favouriteArtists.length;
  };

  const handleRegister = async () => {
    try {
      // let response = await axios.get('http://localhost:3100/get-profile-image', imageFile); // Sostituisci l'URL con quello corretto

      // // Estrai l'indirizzo dell'immagine dalla risposta
      // const profileImageUrl = response.data.profileImageUrl;

      // Effettua la richiesta POST al server Node
      let response = await axios.post('http://localhost:3100/register',
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
        await publicFile(imageFile, response.data.userId);
        showSnackbar('Registrazione effettuata con successo!', "success");
        // window.location.href = "/login";
        // Aggiungi qui il codice per gestire il successo della registrazione, come il reindirizzamento alla pagina di login
      } else {
        showSnackbar('Errore durante la registrazione', "error");
        // Aggiungi qui il codice per gestire l'errore durante la registrazione
      }
    } catch (error) {
      showSnackbar('Errore durante la richiesta di registrazione:' + error.message, "error");
      // Aggiungi qui il codice per gestire l'errore di rete o altre eccezioni
    }
  };
  const handleProfileImageChange = async (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setImageFile(selectedFile)
      console.log('Nome del file:', selectedFile.name);
      
      // Puoi anche mostrare il nome del file all'utente, ad esempio aggiungendolo a uno stato o visualizzandolo nella UI.
    }
  };
  async function publicFile(selectedFile,userId) {
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await axios.post('http://localhost:3100/uploadFile/' + userId, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.ok) {
        return response.data.fileUrl

      } else {
        showSnackbar('Errore durante l\'upload del file.',"error");
      }
    } catch (error) {
      showSnackbar('Errore:'+ error,"error");
    }
  }
  const validateRegistrationData = async () => {
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      showSnackbar('Compila tutti i campi.', "warning");
      return false;
    }

    if (!validateEmail(email)) {
      showSnackbar('Inserisci un indirizzo email valido.', "warning");
      return false;
    }
    if (await checkDuplicateEmail(email) === true) {
      showSnackbar("email già presente, prova con un'altra", "warning");
      return false;
    }
    if (password !== confirmPassword) {
      showSnackbar('Le password non corrispondono.', "warning");
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
      showSnackbar("informazioni salvate correttamente", "success")
      setLoadGenres(true);
      setLoadArtist(false);
    }
  }
  const loadedArtist = () => {
    setLoadArtist(true);
    setLoadGenres(false);
  }
  return (
    <><div className='background'>
      {loadGenres ? (
        <LoadGenres setFavouriteGenres={setFavouriteGenres} loadArtist={loadedArtist} snackbar={showSnackbar} />
      ) : loadArtist ? (
        <LoadArtist
          favouriteGenres={favouriteGenres}
          getFavouriteArtists={getFavouriteArtists}
          setFavouriteArtists={setFavouriteArtists}
          register={handleRegister}
          snackbar={showSnackbar}
        ></LoadArtist>
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
            <TextField
              type="file"
              label="Carica immagine del profilo"
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
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>

  );
};

export default RegisterPage;



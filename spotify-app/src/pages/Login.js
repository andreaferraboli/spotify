import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Paper, TextField, Button, Typography, Snackbar } from '@mui/material';
import axios from 'axios';
import "../style/login.css";
import MuiAlert from '@mui/material/Alert';

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
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
        showSnackbar("login avvenuto con successo!")
        props.handleLogin(response.data)
      } else {
        showSnackbar("Combinazione email/password sbagliata")
      }
    } catch (error) {
      showSnackbar('Errore durante la richiesta di login')
      console.log('Errore durante la richiesta di login:', error.message);
    }
  };

  return (
    <><div className='background'>

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
            className="input" />

          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input" />
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
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </>
  );
};

export default LoginPage;
import React, { useState, useEffect } from "react";
import { Container, Grid, Avatar, TextField, Button, Typography, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import Scrollbar from "react-scrollbars-custom";
import MuiAlert from '@mui/material/Alert';

import "../style/account.css";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Account = ({ user, handleLogin }) => {

    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [profileName, setProfileName] = useState(user.profile_name);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState(user.favourite_genres);
    const [genres, setGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAvatarClick = () => {
      setIsDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };
    useEffect(() => {
        // Effettua la chiamata al server solo una volta durante il montaggio iniziale
        axios.get(`http://localhost:3100/genres`)
            .then(response => {
                setGenres(response.data);
                setAllGenres(response.data)
            })
            .catch(error => console.error(error));
    }, []);
    const handleGenreSelect = (genre) => {
        if (genre !== null && genre !== undefined) {
            if (!selectedGenres?.some(g => g.id === genre.id)) {
                setSelectedGenres(prevSelectedGenres => [...prevSelectedGenres, genre]);
            } else {
                setSelectedGenres(prevSelectedGenres =>
                    prevSelectedGenres.filter(g => g.id !== genre.id)
                );
            }
        }
    };

    const updateGenres = (query) => {
        if (query !== "") {
            let newList = [];
            for (let i in allGenres)
                if (allGenres[i].name.toLowerCase().includes(query.toLowerCase()))
                    newList.push(allGenres[i])
            setGenres(newList)
        } else {
            setGenres(allGenres)
        }

    }
    const handleChangeImage = async (event) => {
        
        const newImage = event.target.files[0];
        await publicFile(newImage,user._id)
        handleCloseDialog();
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
    
        if (response.status === 200) {
          showSnackbar("informazioni caricate correttamente", "success")
          let responseImage=await axios.post("http://localhost:3100/setUserImage/"+userId,{"fileUrl":response.data.fileUrl}) 
          if(responseImage.status === 200){
            showSnackbar("immagine caricata correttamente", "success")
            window.location.href="/"
          }
          else
          showSnackbar("immagine non caricata correttamente", "error")
        } else {
          showSnackbar('Errore durante l\'upload del file.',"error");
        }
      } catch (error) {
        showSnackbar('Errore:'+ error,"error");
      }
    }

    const handleSaveInfo = async () => {
        try {
            const response = await axios.post("http://localhost:3100/updateInfo", {
                "id": user._id,
                "name": name,
                "surname": surname,
                "profile_name": profileName,
            });
            if (response.status === 200) {
                showSnackbar(response.data.message, "success")
                handleLogin(user)
            } else {
                showSnackbar(response.data.message, "error")
            }
            handleLogin(user)
            // Handle success or display a message to the user
        } catch (error) {
            // Handle error
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await axios.post("http://localhost:3100/changePassword", {
                "id": user._id,
                "oldPassword": oldPassword,
                "newPassword": newPassword,
            });
            if (response.status === 200) {
                showSnackbar(response.data.message, "success")
                handleLogin(user)
            } else {
                showSnackbar(response.data.message, "error")
            }
        } catch (error) {
            // Handle error
        }
    };

    const changeGenres = async (genres) => {
        try {
            const response = await axios.put("http://localhost:3100/changeGenres", {
                "id": user._id,
                "genres": genres
            })
            if (response.status === 200) {
                showSnackbar(response.data.message, "success")
                handleLogin(user)
            } else {
                showSnackbar(response.data.message, "error")
            }
        } catch (error) {
            // Handle error
        }
    }
    const handleDeleteProfile = async () => {
        try {
            const response = await axios.delete("http://localhost:3100/deleteProfile/" + user._id);

            if (response.status === 200) {
                showSnackbar(response.data.message, "success")
                handleLogin(user)
            } else {
                showSnackbar(response.data.message, "error")
            }
            handleLogout()
        } catch (error) {
            // Handle error
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        showSnackbar("logout eseguito correttamente", "success")
        handleLogin({});
    };

    return (
        <><Container>
            <Grid container spacing={3}>
                {/* Sezione Avatar */}
                <Grid item xs={12} sm={4}>
                    <Avatar
                        style={{ width: "auto", height: "100%", cursor: 'pointer' }}
                        alt={profileName}
                        src={user.image}
                        onClick={handleAvatarClick}
                    />
                    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Modifica foto profilo</DialogTitle>
                        <DialogContent>
                            {/* File input for selecting a new image */}
                            <input type="file" accept="image/*" onChange={handleChangeImage} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Annulla
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                {/* Sezione Info Utente */}
                <Grid container xs={12} sm={2} style={{ paddingTop: "2%", paddingBottom: "2%", display: "flex", alignItems: "left", justifyContent: "space-around" }} direction="column">
                    <TextField
                        label="Nome"
                        className="account-textfield"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                    <TextField
                        label="Cognome"
                        className="account-textfield"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)} />
                    <TextField
                        label="Nome Profilo"
                        className="account-textfield"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)} />
                    <Button variant="contained" className="add-button" onClick={handleSaveInfo}>
                        Salva Modifiche
                    </Button>
                </Grid>
            </Grid>

            {/* Sezione Cambio Password */}
            <Grid item xs={12}>
                <Typography variant="h6">Cambio Password</Typography>
                <TextField
                    type="password"
                    className="account-textfield"
                    label="Vecchia Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)} />
                <TextField
                    type="password"
                    label="Nuova Password"
                    className="account-textfield"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} />
                <TextField
                    type="password"
                    label="Conferma Password"
                    className="account-textfield"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button variant="contained" className="add-button" onClick={handleChangePassword}>
                    Cambia Password
                </Button>
            </Grid>
            <div style={{ height: "5vh" }}>
                <TextField
                    label="Cerca generi musicali"
                    fullWidth
                    className='input'
                    onChange={(event) => {
                        updateGenres(event.target.value);
                    }} />
            </div>
            <h2 className='subtitle'>Generi Musicali</h2>
            <Scrollbar style={{ height: '30vh' }}>
                <Grid container justifyContent="space-around">
                    {genres?.map((genre) => (
                        <Grid xs={2} item>
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>

            <h2 className='subtitle'>Generi Musicali Selezionati</h2>
            <Scrollbar style={{ height: '25vh' }}>
                <Grid container justifyContent="space-around">
                    {selectedGenres?.map((genre) => (
                        <Grid xs={2} item>
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>
            <div style={{ height: '10vh' }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => { changeGenres(selectedGenres); }}
                    className="button"
                >
                    Avanti
                </Button>
            </div>


            <Button
                variant="contained"
                className="delete-button"
                onClick={handleDeleteProfile}
            >
                Elimina Profilo
            </Button>
            <Button
                variant="contained"
                className="edit-button"
                onClick={handleLogout}
            >
                Disconnettiti
            </Button>
        </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Account;

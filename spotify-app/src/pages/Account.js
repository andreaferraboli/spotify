import React, {useEffect, useState} from "react";
import {
    Avatar,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import Scrollbar from "react-scrollbars-custom";
import {useNavigate} from "react-router-dom";

import "../styles/account.css";

const Account = ({user, handleLogin, snackbar}) => {

    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [profileName, setProfileName] = useState(user.profile_name);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedGenres, setSelectedGenres] = useState(user.favourite_genres);
    const [genres, setGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const apiKey = process.env.REACT_APP_API_KEY;
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const navigate = useNavigate();
    const handleAvatarClick = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        // Effettua la chiamata al server solo una volta durante il montaggio iniziale
        axios.get(`http://localhost:3100/genres?apikey=${apiKey}`)
            .then(response => {
                setGenres(response.data);
                setAllGenres(response.data);
            })
            .catch(error => snackbar("errore caricamento generi" + error, "error"));
    }, [apiKey, snackbar]);

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
        await publicFile(newImage, user._id)
        handleCloseDialog();
    };

    async function publicFile(selectedFile, userId) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const uploadUrl = `http://localhost:3100/uploadFile/${userId}?apikey=${apiKey}`;
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                snackbar("Informazioni caricate correttamente", "success");
                const setImageUrlUrl = `http://localhost:3100/setUserImage/${userId}?apikey=${apiKey}`;
                let responseImage = await axios.post(setImageUrlUrl, {"fileUrl": response.data.fileUrl});

                if (responseImage.status === 200) {
                    snackbar("Immagine caricata correttamente", "success");
                    navigate("/")
                    window.location.reload(true);

                } else {
                    snackbar("Immagine non caricata correttamente", "error");
                }
            } else {
                snackbar('Errore durante l\'upload del file.', "error");
            }
        } catch (error) {
            snackbar('Errore: ' + error, "error");
        }
    }


    const handleSaveInfo = async () => {
        try {
            const updateInfoUrl = `http://localhost:3100/updateInfo?apikey=${apiKey}`;
            const response = await axios.post(updateInfoUrl, {
                "id": user._id,
                "name": name,
                "surname": surname,
                "profile_name": profileName,
            });

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                handleLogin(user);
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            // Handle error
            snackbar("error:" + error, "error");
        }
    };

    const handleChangePassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                snackbar("La nuova password e la conferma della nuova password non corrispondono", "error");
                return; // Esci dalla funzione in caso di errore
            }

            const changePasswordUrl = `http://localhost:3100/changePassword?apikey=${apiKey}`;
            const response = await axios.post(changePasswordUrl, {
                "id": user._id,
                "oldPassword": oldPassword,
                "newPassword": newPassword,
            });

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                handleLogin(user);
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            if (error.response ?? '') {
                if (error.response.status === 400) {
                    snackbar(error.response.data.message, "warning");

                } else if (error.message.includes("Network Error")) {
                    snackbar("Impossibile raggiungere il server", "error");
                } else {
                    snackbar('Errore durante la richiesta di login:' + error.message, "error");
                }
            } else {
                snackbar('Errore, server non raggiungibile', "error");
            }
        }
    };


    const changeGenres = async (genres) => {
        try {
            const changeGenresUrl = `http://localhost:3100/changeGenres?apikey=${apiKey}`;
            const response = await axios.put(changeGenresUrl, {
                "id": user._id,
                "genres": genres
            });

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                handleLogin(user);
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            // Handle error
            snackbar("error:" + error, "error");
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const deleteProfileUrl = `http://localhost:3100/deleteProfile/${user._id}?apikey=${apiKey}`;
            const response = await axios.delete(deleteProfileUrl);

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                handleLogout();
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            // Handle error
            snackbar("error:" + error, "error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        snackbar("logout eseguito correttamente", "success")
        handleLogin({});
    };

    return (
        <><Container>
            <Grid container spacing={3}>
                {/* Sezione Avatar */}
                <Grid item xs={12} sm={4} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Avatar
                        style={{
                            width: "auto",
                            height: "100%",
                            maxHeight: "300px",
                            maxWidth: "300px",
                            cursor: 'pointer'
                        }}
                        alt={profileName}
                        src={user.image}
                        onClick={handleAvatarClick}
                    />
                    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                        <DialogTitle>Modifica foto profilo</DialogTitle>
                        <DialogContent>
                            {/* File input for selecting a new image */}
                            <input type="file" accept="image/*" onChange={handleChangeImage}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Annulla
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>

                {/* Sezione Info Utente */}
                <Grid container xs={12} sm={2} style={{
                    paddingTop: "2%",
                    paddingBottom: "2%",
                    display: "flex",
                    alignItems: "left",
                    justifyContent: "space-around"
                }} direction="column">
                    <br></br>
                    <TextField
                        label="Nome"
                        className="account-textfield"
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    <br></br>
                    <TextField
                        label="Cognome"
                        className="account-textfield"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}/>
                    <br></br>
                    <TextField
                        label="Nome Profilo"
                        className="account-textfield"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}/>
                    <br></br>
                    <Button variant="contained" className="add-button" onClick={handleSaveInfo}>
                        Salva Modifiche
                    </Button>
                </Grid>
            </Grid>

            {/* Sezione Cambio Password */}
            <Grid item xs={12}>
                <Typography variant="h6">Cambio Password</Typography>
                <TextField
                    label="Vecchia Password"
                    variant="outlined"
                    type={showOldPassword ? 'text' : 'password'} // Cambia il tipo in base a showPassword
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="account-textfield"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={toggleShowOldPassword}
                                    edge="end"
                                >
                                    {showOldPassword ? <VisibilityIcon className="visible-icon"/> :
                                        <VisibilityOffIcon className="visible-icon"/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    label="Nuova Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'} // Cambia il tipo in base a showPassword
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="account-textfield"
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
                <TextField
                    label="Conferma nuova password"
                    variant="outlined"
                    type={showConfirmPassword ? 'text' : 'password'} // Cambia il tipo in base a showPassword
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="account-textfield"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={toggleShowConfirmPassword}
                                    edge="end"
                                >
                                    {showConfirmPassword ? <VisibilityIcon className="visible-icon"/> :
                                        <VisibilityOffIcon className="visible-icon"/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button variant="contained" className="add-button" onClick={handleChangePassword}>
                    Cambia Password
                </Button>
            </Grid>
            <br></br>
            <br></br>
            <div style={{height: "5vh"}}>
                <TextField
                    label="Cerca generi musicali"
                    fullWidth
                    className='input'
                    onChange={(event) => {
                        updateGenres(event.target.value);
                    }}/>
            </div>
            <br></br>
            <br></br>
            <h2 className='subtitle'>Generi Musicali</h2>
            <br></br>
            <Scrollbar style={{height: '30vh'}}>
                <Grid container justifyContent="space-around">
                    {genres?.map((genre) => (
                        <Grid xs={2} item>
                            <div onClick={() => handleGenreSelect(genre)} style={{cursor: 'pointer'}}>
                                <div
                                    className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>
            <br></br>
            <h2 className='subtitle'>Generi Musicali Selezionati</h2>
            <br></br>
            <Scrollbar style={{height: '25vh'}}>
                <Grid container justifyContent="space-around">
                    {selectedGenres?.map((genre) => (
                        <Grid xs={2} item>
                            <div onClick={() => handleGenreSelect(genre)} style={{cursor: 'pointer'}}>
                                <div
                                    className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>
            <div style={{height: '10vh'}}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        changeGenres(selectedGenres);
                    }}
                    className="button"
                >
                    Cambia Generi
                </Button>
            </div>

            <div className="button-container">
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
            </div>

        </Container>
        </>
    );
};

export default Account;

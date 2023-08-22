import React, { useState } from "react";
import { Container, Grid, Avatar, TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import "../style/account.css";
const Account = ({ user,  handleLogin}) => {
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [profileName, setProfileName] = useState(user.profile_name);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSaveInfo = async () => {
        try {
            const response = await axios.post("http://localhost:3100/updateInfo", {
                "id":user._id,
                "name":name,
                "surname":surname,
                "profile_name":profileName,
            });
            console.log(response)
            handleLogin(user)
            // Handle success or display a message to the user
        } catch (error) {
            // Handle error
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await axios.post("http://localhost:3100/changePassword", {
                "id":user._id,
                "oldPassword":oldPassword,
                "newPassword":newPassword,
            });
            console.log(response)
        } catch (error) {
            // Handle error
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const response = await axios.delete("http://localhost:3100/deleteProfile/"+user._id);
            console.log(response)
            if(response.status===200)
                handleLogout()
        } catch (error) {
            // Handle error
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('user');
        handleLogin({});
      };

    return (
        <Container>
            <Grid container spacing={3}>
                {/* Sezione Avatar */}
                <Grid item xs={12} sm={4}>
                    <Avatar style={{ width: "auto", height: "100%" }} alt={profileName} src={user.image} />
                </Grid>

                {/* Sezione Info Utente */}
                <Grid container xs={12} sm={2} style={{ paddingTop: "2%", paddingBottom: "2%", display: "flex", alignItems: "left", justifyContent: "space-around" }} direction="column">
                    <TextField
                        label="Nome"
                        className="account-textfield"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Cognome"
                        className="account-textfield"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                    />
                    <TextField
                        label="Nome Profilo"
                        className="account-textfield"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                    />
                    <Button variant="contained" className="add-button" onClick={handleSaveInfo}>
                        Salva Modifiche
                    </Button>
                </Grid>
            </Grid>

            {/* Sezione Cambio Password */}
            <Grid item xs={12} >
                <Typography variant="h6">Cambio Password</Typography>
                <TextField
                    type="password"
                    className="account-textfield"
                    label="Vecchia Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                    type="password"
                    label="Nuova Password"
                    className="account-textfield"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                    type="password"
                    label="Conferma Password"
                    className="account-textfield"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button variant="contained" className="add-button" onClick={handleChangePassword}>
                    Cambia Password
                </Button>
            </Grid>


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
        </Container >
    );
};

export default Account;

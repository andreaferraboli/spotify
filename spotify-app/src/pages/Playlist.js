import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Track from "../components/track";
import {
  Typography,
  Avatar,
  Grid,
  IconButton, Button, Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePlaylist from '../components/UpdatePlaylist';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert';
import "../style/playlist.css";

export function formatDuration(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  if (hours === 0) {
    return `${minutes} minuti`;
  }

  return `${hours} ore e ${minutes} minuti`;
}
const Playlist = ({ user, onBack }) => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState();
  const [editing, setEditing] = useState(false);
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

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:3100/playlist/${playlistId}?apikey=123456`);

        setPlaylist(response.data[0].my_playlists);

      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  const handleEditPlaylist = () => {
    setEditing(true);
  };

  const handleEditName = () => {
    const newName = prompt("Inserisci il nuovo nome della playlist:");
    if (newName) {
      setPlaylist((prevPlaylist) => ({ ...prevPlaylist, name: newName }));
    }
  };
  const handleDeletePlaylist = async () => {
    try {
      const response = await axios.delete(`http://localhost:3100/playlist/${playlist.id}`);
      showSnackbar('Playlist eliminato');
      window.location.href = "/"
    } catch (error) {
      showSnackbar('Error deleting playlist:', error);
    }
  };
  async function publishPlaylist() {
    const url = `http://localhost:3100/movePlaylist/${playlist.id}`;
    const requestData = { user_id: user._id };
  
    try {
      const response = await axios.put(url, requestData);
      if(response.status===200){
        showSnackbar(response.data.message)
        window.location.href="/"
      }
      else
        showSnackbar("errore nel pubblicare la playlist")
    } catch (error) {
      showSnackbar("Errore durante la pubblicazione della playlist:", error);
      throw error;
    }
  }


  return (
    <>
      <Grid container style={{ margin: 0 }} spacing={1}>
        <Grid item xs={12} sm={3}>
          <img id="playlist_image" src={playlist?.image} alt="Playlist" className="playlist-image" />
        </Grid>
        <Grid item xs={12} sm={9} className="info-section">
          <div className="playlist-info-container">
            <Typography variant="body1">Playlist</Typography>
          </div>
          <div className="playlist-info-container">
            <Typography variant="h3">
              {playlist?.name}


            </Typography>
            <IconButton onClick={handleEditName}>
              <EditIcon className="icon-button" />
            </IconButton>
            <IconButton onClick={handleDeletePlaylist}>
              <DeleteIcon className="icon-button" />
            </IconButton>

          </div>
          <div className="playlist-info-container">
            <Avatar
              src={user.image}
              alt={user.profile_name}
              style={{ marginRight: "10px" }}
            />
            <div>
              <Typography variant="body1">
                {user.profile_name} - {playlist?.tracks.length} brani, circa{" "}
                {formatDuration(
                  playlist?.tracks.reduce(
                    (total, song) => total + song.duration,
                    0
                  )
                )}
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
      <div >
        <Grid style={{ justifyContent: "flex-start", display: "flex" }} xs={12}>
          <Typography variant="h4" className="title-section">
            Tracks
          </Typography>
          {!editing && (
            <>
            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
              <Button
                variant="outlined"
                className="edit-button"
                onClick={() => handleEditPlaylist()}
              >
                Modifica
              </Button>
            </div>
            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  className="edit-button"
                  onClick={() => publishPlaylist(playlist.id,user._id)}
                >
                  Pubblica Playlist 
                </Button>
              </div>
              <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  className="edit-button"
                  onClick={() => handleEditPlaylist()}
                >
                  Rendi Collaborativa
                </Button>
              </div></>

          )}
        </Grid>
        <Grid container spacing={2} style={{ margin: 0 }}>
          {editing ? (
            <UpdatePlaylist user={user} playlist={playlist} onClose={() => setEditing(false)} />
          ) : (
            <div className="top-tracks-section">
              <Grid container spacing={2} >
                {playlist?.tracks.map((track, index) => (
                  <Track key={track.id} userPlaylists={user.my_playlists} track={track} index={index + 1}></Track>

                ))}
              </Grid>
            </div>
          )}
        </Grid>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;
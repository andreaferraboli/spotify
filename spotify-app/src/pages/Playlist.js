import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Track from "../components/track";
import {
  Typography,
  Avatar,
  Grid,
  IconButton, Button, Snackbar, TextField
} from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';
import Scrollbar from "react-scrollbars-custom";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
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
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axios.get(`http://localhost:3100/playlist/${playlistId}?apikey=123456`);
        setPlaylist(response.data);

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
      showSnackbar('Playlist eliminata', "success");
      window.location.href = "/"
    } catch (error) {
      showSnackbar('Error deleting playlist:' + error, "error");
    }
  };
  async function publishPlaylist() {
    const url = `http://localhost:3100/movePlaylist/${playlist.id}`;
    const requestData = { user_id: user._id, image: user.image, profile_name: user.profile_name, type: 'private' };

    try {
      const response = await axios.put(url, requestData);
      if (response.status === 200) {
        showSnackbar(response.data.message, "success")
        window.location.href = "/playlist/" + playlistId
      }
      else
        showSnackbar("errore nel pubblicare la playlist", "error")
    } catch (error) {
      showSnackbar("Errore durante la pubblicazione della playlist:" + error, "error");
      throw error;
    }
  }
  async function makePlaylistPrivate(playlist) {
    const url = `http://localhost:3100/movePlaylist/${playlist.id}`;
    const requestData = { user_id: user._id, type: 'public' };

    try {
      const response = await axios.put(url, requestData);
      if (response.status === 200) {
        showSnackbar(response.data.message, "success")
        window.location.href = "/playlist/" + playlistId
      }
      else
        showSnackbar("errore nel rendere la playlist privata", "error")
    } catch (error) {
      showSnackbar("Errore durante il rendere la playlist privata: " + error, "error");
      throw error;
    }
  }
  const handleSetCollaborative = async (collaborative) => {
    try {
      const response = await axios.put(`http://localhost:3100/setCollaborative/${playlistId}`, { "collaborative": collaborative });
      if (response.status === 200) {
        showSnackbar(response.data.message, "success")
        window.location.href = "/playlist/" + playlistId
      }
    } catch (error) {
      showSnackbar("Errore durante l'impostazione della playlist come collaborativa:" + error, "error");
    }
  };
  async function changeFollow(playlistId, userId, action) {
    try {
      const response = await axios.put(`http://localhost:3100/updatePlaylistFollowers/${playlistId}/${userId}?action=${action}`);
      if (response.status === 200) {
        showSnackbar(response.data.message, "success")
        window.location.href = "/playlist/" + playlistId
      }
      else
        showSnackbar(response.data.message, "error")


    } catch (error) {
      throw error;
    }
  }
  
  const changeTag = async (playlistId, tag, action) => {
    try {
      const response = await axios.post('http://localhost:3100/changeTag', {
        playlistId: playlistId,
        tag: tag,
        action: action,
      });
      if(response.status === 200){
        showSnackbar(response.data.message,"success");
        window.location.href="/playlist/"+playlistId
      }
      else
        showSnackbar("errore","error")
    } catch (error) {
      throw error;
    }
  };
  const handleAddTag = () => {
    setIsAddingTag(true);
  };

  const handleConfirmAddTag = () => {
    if (newTag.trim() !== '') {
      addTag(newTag);
    }
  };
  const addTag = async () => {
    if (newTag.trim() !== '') {
      try {
        await changeTag(playlist.id, newTag, 'add');
        setIsAddingTag(false);
        setNewTag('');
        // Aggiorna lo stato della playlist per riflettere i cambiamenti
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };
  
  const removeTag = async (tag) => {
    try {
      await changeTag(playlist.id, tag, 'remove');
      // Aggiorna lo stato della playlist per riflettere i cambiamenti
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };
  return (
    <>
      <Grid container style={{ margin: 0 }} spacing={1}>
        <Grid item xs={12} sm={3}>
          <img id="playlist_image" src={playlist?.image} alt="Playlist" className="playlist-image" />
        </Grid>
        <Grid item xs={12} sm={9} className="info-section">
          <div className="playlist-info-container">
            <Typography variant="body1">{playlist?.type === "private" ? "Playlist" : "Playlist Pubblica"}</Typography>
          </div>
          <div className="playlist-info-container">
            <Typography variant="h3">
              {playlist?.name}


            </Typography>


            {playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
              <IconButton onClick={handleEditName}>
                <EditIcon className="icon-button" />
              </IconButton>
            ) : null}
            {playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
              <IconButton onClick={handleDeletePlaylist}>
                <DeleteIcon className="icon-button" />
              </IconButton>
            ) : null}


          </div>
          <div className="playlist-info-container">
            <Scrollbar variant="h3">
              {playlist?.tags?.map((item) => (
                <Button
                  key={item}
                  variant="outlined"
                  className="info-button"
                  onClick={() => removeTag(item)}
                >
                  {item}
                </Button>
              ))}

              {isAddingTag ? (
                <div className="tag-input">
                  <TextField
                    variant="outlined"
                    value={newTag}
                    className="input_playlist"
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleConfirmAddTag();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    className="add-button"
                    onClick={handleConfirmAddTag}
                  >
                    Add
                  </Button>
                </div>
              ) : (
                  <IconButton className="add-button"
                  onClick={handleAddTag}>
                    <AddCircleOutline  />
                  </IconButton>
              )}
            </Scrollbar>
          </div>
          <div className="playlist-info-container">
            {playlist?.type === "private" ? (
              <Avatar
                src={user.image}
                alt={user.profile_name}
                style={{ marginRight: "10px" }}
              />
            ) : (
              <Avatar
                src={playlist?.owner.image}
                alt={playlist?.owner.profile_name}
                style={{ marginRight: "10px" }}
              />
            )}

            <div>
              <Typography variant="body1">
                {playlist?.type === 'public' ? (
                  <Link to={`/user/${playlist?.owner.id}`}>
                    {playlist?.owner.profile_name}
                  </Link>
                ) : (
                  <Link to={`/user/${user._id}`}>
                    {user.profile_name}
                  </Link>
                )}{" "}
                - {playlist?.tracks.length} brani, circa{" "}
                {formatDuration(
                  playlist?.tracks.reduce((total, song) => total + song.duration, 0)
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
                {playlist?.type === "private" || (playlist?.type === "public" && (playlist.collaborative === true || playlist.owner.id === user._id)) ? (
                  <Button
                    variant="outlined"
                    className="edit-button"
                    onClick={() => handleEditPlaylist()}
                  >
                    Modifica
                  </Button>
                ) : null}

              </div>
              <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                {playlist?.type === "private" ? (
                  <Button
                    variant="outlined"
                    className="edit-button"
                    onClick={() => publishPlaylist(playlist.id, user._id)}
                  >
                    Pubblica Playlist
                  </Button>
                ) : (
                  playlist?.owner.id === user._id && (
                    <Button
                      variant="outlined"
                      className="edit-button"
                      onClick={() => makePlaylistPrivate(playlist)}
                    >
                      Rendi Playlist Privata
                    </Button>
                  )
                )}

              </div>
              <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                {playlist?.type === "public" && (playlist?.followers.includes(user._id) && playlist?.owner.id !== user._id) ? (
                  <Button
                    variant="outlined"
                    className="delete-button"
                    onClick={() => changeFollow(playlist.id, user._id, "remove")}
                  >
                    Smetti di seguire
                  </Button>
                ) : (
                  playlist?.type === "public" && (!playlist?.followers.includes(user._id) && playlist?.owner.id !== user._id) && (
                    <Button
                      variant="outlined"
                      className="add-button"
                      onClick={() => changeFollow(playlist.id, user._id, "add")}
                    >
                      Segui Playlist
                    </Button>
                  )
                )}

              </div>
              <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                {(playlist?.type === "public" && playlist.collaborative === false && playlist.owner.id === user._id) ? (
                  <Button
                    variant="outlined"
                    className="edit-button"
                    onClick={() => handleSetCollaborative(true)}
                  >
                    Rendi Collaborativa
                  </Button>
                ) : (
                  (playlist?.type === "public" && playlist.collaborative === true && playlist.owner.id === user._id) && (
                    <Button
                      variant="outlined"
                      className="edit-button"
                      onClick={() => handleSetCollaborative(false)}
                    >
                      Rendi Non Collaborativa
                    </Button>
                  )
                )}
              </div></>

          )}
        </Grid>
          {editing ? (
            <UpdatePlaylist user={user} playlist={playlist} snackbar={showSnackbar} onClose={() => setEditing(false)} />
          ) : (
            <div className="top-tracks-section">
              <Grid container spacing={2} >
                {playlist?.tracks.map((track, index) => (
                  <Track key={track.id} userPlaylists={user.my_playlists} track={track} index={index + 1}></Track>

                ))}
              </Grid>
            </div>
          )}
        
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;
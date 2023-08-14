import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Track from "../components/track";
import {
  Typography,
  Avatar,
  Grid,
  IconButton, Button
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePlaylist from '../components/UpdatePlaylist';
import axios from 'axios';
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
  }, []);

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
      console.log('Playlist deleted:', response.data);
      window.location.href="/"
      // Redirect to a specific page after successful deletion
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  
  return (
    <>
      <Grid container style={{margin:0}} spacing={1}>
        <Grid item xs={12} sm={3}>
          <img src={playlist?.image} alt="Playlist" className="playlist-image" />
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
        <Grid item xs={12}>
          <Typography variant="h4" className="title-section">
            Tracks
            {!editing && (
              <Button
                variant="outlined"
                className="edit-button"
                onClick={() => handleEditPlaylist()}
              >
                Modifica
              </Button>
            )}
          </Typography>
        </Grid>
        <Grid container spacing={2} style={{margin:0}}>
          {editing ? (
            <UpdatePlaylist playlist={playlist} onClose={() => setEditing(false)} />
          ) : (
            <div className="top-tracks-section">
              <Grid container spacing={2} >
                {playlist?.tracks.map((track, index) => (
                  <Track key={track.id} track={track} index={index + 1}></Track>

                ))}
              </Grid>
            </div>
          )}
        </Grid>
      </div>
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;
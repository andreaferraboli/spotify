import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Track from "../components/track";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Grid,
  IconButton, Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpdatePlaylist from '../components/UpdatePlaylist';
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
        const response = await fetch(
          `http://localhost:3100/playlist/${playlistId}?apikey=123456`
        );
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data[0].my_playlists);
        } else {
          console.log("Errore nella richiesta");
        }
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


  
  return (
    <>
      <Grid container spacing={1}>
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
              <IconButton onClick={handleEditName}>
                <EditIcon className="icon-button" />
              </IconButton>
            </Typography>
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
        <Grid container spacing={2}>
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
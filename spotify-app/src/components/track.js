import React, { useState, useEffect } from "react";
import { Grid, Typography, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import axios from 'axios';
import "../style/track.css";
const Track = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(new Audio(props.track.preview_url));

  const toggleAudio = () => {
    if (!props.track.preview_url) {
      props.snackbar("anteprima canzone non disponibile", "warning");
      return;
    }
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    setAudioElement(new Audio(props.track.preview_url));

  }, [props.track.preview_url]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePlaylistSelect = (playlistId) => {
    axios.post(`http://localhost:3100/playlists/${playlistId}/add-track`, props.track)
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error('Errore durante l\'aggiunta della traccia alla playlist', error);
      });
    handleMenuClose();
  };
  return (
    <>
      <Grid container spacing={1} style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "center" }} className="track" >
        <Grid item xs={12} sm={1} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography variant="body1">{props.index}</Typography>
        </Grid>
        <Grid xs={12} sm={1} item className="image-container-wrapper" onClick={toggleAudio}>
          <div className={`image-container ${isPlaying ? 'playing' : ''}`} style={{ backgroundImage: `url(${props.track.image})` }}>
            {isPlaying ? (
              <div className="play-icon"fontSize="13rem">
                {/* Icona Play al centro dell'immagine */}
                <PlayCircleOutlineIcon  />
              </div>
            ) : null}
          </div>
        </Grid>







        <Grid style={{ paddingLeft: "3%" }} xs={12} sm={7} onClick={() => { window.location.href = "/track/" + props.track.id }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography variant="h6" style={{ marginBottom: "8px" }}>
              {props.track.name}
            </Typography>
            <Typography variant="subtitle2">
              {props.track.artists.map((artist, index) => (
                <span key={artist.id}>
                  {artist.name}
                  {index !== props.track.artists.length - 1 && ", "}
                </span>
              ))}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="body2">{formatDuration(props.track.duration)}</Typography>
        </Grid>
        <Grid item xs={1}>
          <MoreVertIcon onClick={handleMenuOpen} />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}

          >
            <MenuItem disabled className="menu-heading ">Aggiungi alla playlist:</MenuItem>
            {props.userPlaylists?.map((playlist) => (
              <MenuItem className="menu-heading " key={playlist.id} onClick={() => handlePlaylistSelect(playlist.id)}>
                {playlist.name}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Grid>
    </>
  );
};

export default Track;

// Funzione per formattare la durata in minuti e secondi
export const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

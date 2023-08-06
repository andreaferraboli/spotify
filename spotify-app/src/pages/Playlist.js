import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Track from "../components/track"
import { Card, CardHeader, CardContent, CardMedia, Typography, Avatar, Grid } from '@mui/material';
const Playlist = ({ user, onBack }) => {
  const playlistId = useParams();
  // Qui implementi il codice per visualizzare la pagina della playlist utilizzando l'id ricevuto
  const [playlist, setPlaylist] = useState();
  useEffect(() => {
    // Funzione per ottenere le playlist dall'API del database
    const fetchPlaylist = async () => {

      try {
        const response = await fetch(`http://localhost:3100/playlist/${playlistId.playlistId}?apikey=123456`);
        if (response.ok) {
          const data = await response.json();
          setPlaylist(data[0].my_playlists);

        } else {
          console.log('Errore nella richiesta');
        }
      } catch (error) {
        console.log(error);
      }
    };

    // Chiamata alla funzione per ottenere le playlist quando il componente Sidebar viene montato
    fetchPlaylist();
  }, []);
  function formatDuration(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    if (hours === 0) {
      return `${minutes} minuti`;
    }

    return `${hours} ore e ${minutes} minuti`;
  }
  return (
    <>
      {/* Mostra la pagina della playlist */}
      {/* ... Aggiungi altre informazioni sulla playlist ... */}
      

      {/* Resto del codice come prima */}
      {/* ... */}
      <Grid container spacing={1}>
      {/* Immagine della playlist a sinistra */}
      <Grid item xs={12} sm={3}>
        <img src={playlist?.image} alt="Playlist" className="playlist-image" />
      </Grid>

      {/* Informazioni sulla playlist a destra */}
      <Grid item xs={12} sm={9} className="info-section">
        {/* Titolo "Playlist" */}
        

        {/* Nome della playlist in grosso */}
        <div className="playlist-info-container">
          <Typography variant="body1">Playlist</Typography>
        </div>
        <div className="playlist-info-container">
<Typography variant="h3">{playlist?.name}</Typography>
        </div>
        

        {/* Avatar dell'utente e informazioni */}
        <div className="playlist-info-container">
          <Avatar src={user.image} alt={user.profile_name} style={{ marginRight: '10px' }} />
          <div>
            <Typography variant="body1">{user.profile_name} - {playlist?.tracks.length} brani, circa {formatDuration(playlist?.tracks.reduce((total, song) => total + song.duration, 0))}</Typography>
          </div>
        </div>
      </Grid>
    </Grid>
      <div className="top-tracks-section">
        <Grid container spacing={2} >
          <Typography variant="h4" style={{ margin: "4%" }}>Tracks</Typography>
          {playlist?.tracks.map((track, index) => (
            <Track key={track.id} track={track} index={index + 1}></Track>

          ))}
        </Grid>
      </div>
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;
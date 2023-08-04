import React, { useEffect, useState } from "react";
import Track from "../components/track"
import { Card, CardHeader, CardContent, CardMedia, Typography, Avatar, Grid } from '@mui/material';
const Playlist = ({ user, playlistId, onBack }) => {
  // Qui implementi il codice per visualizzare la pagina della playlist utilizzando l'id ricevuto
  const [playlist, setPlaylist] = useState();
  useEffect(() => {
    // Funzione per ottenere le playlist dall'API del database
    const fetchPlaylist = async () => {

      try {
        const response = await fetch(`http://localhost:3100/playlist/${playlistId}?apikey=123456`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setPlaylist(data[0].my_playlists);
          }
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
  return (
    <>
      {/* Mostra la pagina della playlist */}
      {/* ... Aggiungi altre informazioni sulla playlist ... */}

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
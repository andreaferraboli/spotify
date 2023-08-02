import React, { useEffect, useState } from "react";
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
            console.log(data[0].my_playlists)
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
      <h1>Playlist {playlistId}</h1>
      {/* ... Aggiungi altre informazioni sulla playlist ... */}
      
      <Grid container spacing={2}>

      {
          playlist?.tracks.map((song) => (
        <Grid item xs={12} sm={6} md={4} key={song.id}>
          <Card>
            <CardHeader
              avatar={<Avatar src={song.artists[0].image} />}
              title={song.name}
              subheader={song.album_name}
            />
            <CardMedia component="img" height="200" image={song.image} alt={song.name} />
            <CardContent>
              <Typography variant="subtitle1">Artists:</Typography>
              {song.artists.map((artist) => (
                <Typography key={artist.id} variant="body2">
                  {artist.name}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
       
    </Grid>
      {/* Pulsante per tornare alla pagina Home */}
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Playlist;
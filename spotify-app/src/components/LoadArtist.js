import React, { useState } from 'react';
import { Slider, Avatar, TextField, Grid } from '@mui/material';

const LoadArtist = () => {
  // Stato per memorizzare gli artisti selezionati
  const [selectedAvatars, setSelectedAvatars] = useState([]);

  // Mock degli artisti. Sostituisci questo con i tuoi dati reali.
  const artists = [
    { id: 1, name: 'Artist 1', avatarUrl: 'url/to/avatar1.jpg' },
    { id: 2, name: 'Artist 2', avatarUrl: 'url/to/avatar2.jpg' },
    { id: 3, name: 'Artist 3', avatarUrl: 'url/to/avatar3.jpg' },
    // Aggiungi altri artisti qui
  ];

  // Funzione per gestire la selezione degli artisti
  const handleAvatarSelect = (artistId) => {
    // Verifica se l'ID dell'artista è già presente nell'array selectedAvatars
    if (!selectedAvatars.includes(artistId)) {
      setSelectedAvatars((prevSelectedAvatars) => [
        ...prevSelectedAvatars,
        artistId,
      ]);
    }
  };

  return (
    <div>
      {/* Barra di ricerca */}
      <TextField label="Cerca artisti" fullWidth />

      {/* Slider verticale con gli avatar degli artisti */}
      <Slider
        orientation="vertical"
        defaultValue={0}
        aria-labelledby="discrete-slider"
        step={1}
        marks
        min={0}
        max={artists.length - 1}
        valueLabelDisplay="auto"
        onChange={(event, value) => handleAvatarSelect(artists[value].id)}
      >
        {artists.map((artist) => (
          <Avatar key={artist.id} alt={artist.name} src={artist.avatarUrl} />
        ))}
      </Slider>

      {/* Visualizza gli artisti selezionati */}
      <Grid container spacing={1}>
        {selectedAvatars.map((artistId) => {
          const artist = artists.find((artist) => artist.id === artistId);
          return (
            <Grid item key={artistId}>
              <Avatar alt={artist.name} src={artist.avatarUrl} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default LoadArtist;
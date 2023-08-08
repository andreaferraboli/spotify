import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import ArtistCard from "./ArtistCard"
const LoadArtist = () => {
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Effettua la chiamata al server quando la query cambia
    axios.get(`http://localhost:3100/artists/${query}`)
      .then(response => {
        console.log('Data from server:', response.data);
        const sortedArtists = response.data.sort((a, b) => {
          if (a.name.toLowerCase().includes(query.toLowerCase()) && !b.name.toLowerCase().includes(query.toLowerCase())) {
            return -1; // a viene prima di b
          } else if (!a.name.toLowerCase().includes(query.toLowerCase()) && b.name.toLowerCase().includes(query.toLowerCase())) {
            return 1; // b viene prima di a
          } else {
            // Se la query è contenuta in entrambi o in nessuno, ordina per popolarità
            return b.popularity - a.popularity; // ordinamento decrescente per popolarità
          }
        });
        setArtists(sortedArtists);
      setArtists(sortedArtists);
      })
      .catch(error => console.error(error));
  }, [query]);

  const handleAvatarSelect = (artist) => {
    if (artist != null && artist != undefined) {
      if (!selectedAvatars?.some(a => a.id === artist.id)) {
        setSelectedAvatars(prevSelectedAvatars => [...prevSelectedAvatars, artist]);
      } else {
        setSelectedAvatars(prevSelectedAvatars =>
          prevSelectedAvatars.filter(a => a.id !== artist.id)
        );
      }
    }

  };

  
  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Benvenuto<br />
        Scegli i tuoi artisti per consigli più personalizzati!
      </Typography>
      <TextField
        label="Cerca artisti"
        fullWidth
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <h2>Artisti</h2>
      <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '30vh' }}>
  <Grid container justifyContent="space-around" >
    {artists?.map((artist) => (
      <Grid item xs={2} key={artist.id}>
        <ArtistCard artist={artist} selectedArtistId={null} handleAvatarSelect={handleAvatarSelect} />
      </Grid>
    ))}
  </Grid>
</div>

      <h2>Artisti Selezionati</h2>
      <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '30vh' }}>
        <Grid container justifyContent="space-around">
          {selectedAvatars?.map((artist) => (
            <Grid xs={2} item key={artist.id}>
              <ArtistCard artist={artist} selectedArtistId={null} handleAvatarSelect={handleAvatarSelect} />
            </Grid>
          ))}
        </Grid>
      </div>
    </Container>
  );
};

export default LoadArtist;

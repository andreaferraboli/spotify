import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import ArtistCard from "./ArtistCard"
const LoadArtist = (props) => {
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const fetchData = async () => {
    try {
      setError(null);
      setNoResults(false);
      if (query !== '') {
        const response = await axios.get(`http://localhost:3100/artists/${query}`);
        console.log('Data from server:', response.data);
        const sortedArtists = response.data.sort((a, b) => {
          if (a.name.toLowerCase().includes(query.toLowerCase()) && !b.name.toLowerCase().includes(query.toLowerCase())) {
            return -1; // a comes before b
          } else if (!a.name.toLowerCase().includes(query.toLowerCase()) && b.name.toLowerCase().includes(query.toLowerCase())) {
            return 1; // b comes before a
          } else {
            // If query is present in both or in neither, sort by popularity
            return b.popularity - a.popularity; // descending popularity order
          }
        });
        if (sortedArtists.length === 0) {
          setNoResults(true); // Set noResults state if no artists match the query
        }
        setArtists(sortedArtists);
      } else {
        const genres = props.favouriteGenres.map(genre => genre.name);
        const limit = Math.floor(20 / (props.favouriteGenres?.length || 1));
        console.log("genres:", genres);
        console.log("limit:", limit);
        const response = await axios.post('http://localhost:3100/genre', {
          genres: genres,
          limit: limit
        });
        setArtists(response.data);
        if (response.data.length === 0) {
          setNoResults(true); // Set noResults state if no artists are available
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred while fetching data. Please try again later.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [query]);

  const handleAvatarSelect = (artist) => {
    if (artist !== null && artist !== undefined) {
      if (!selectedAvatars?.some(a => a.id === artist.id)) {
        setSelectedAvatars(prevSelectedAvatars => [...prevSelectedAvatars, artist]);
      } else {
        setSelectedAvatars(prevSelectedAvatars =>
          prevSelectedAvatars.filter(a => a.id !== artist.id)
        );
      }
    }

  };
  const arraysAreEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i].id !== array2[i].id) {
        return false;
      }
      // Aggiungi altri controlli qui se necessario
    }

    return true;
  };
  const handleRegisterClick =  () => {
    // Wait for setFavouriteArtists to complete
    setTimeout(() => {
      // Questo codice verrà eseguito dopo 1000 millisecondi (1 secondo)
      if (selectedAvatars.length === props.getFavouriteArtists()) {
        props.register();
      } else {
        handleRegisterClick()
      }
    }, 1000);

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
      <div style={{ height: '10vh' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => { props.setFavouriteArtists(selectedAvatars); handleRegisterClick() }}
          className="button"
        >
          Avanti
        </Button>
      </div>
      {noResults && <p>No artists match your search or no artists are available.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
};

export default LoadArtist;

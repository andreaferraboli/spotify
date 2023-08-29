import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import ArtistCard from "./ArtistCard"
import Carousel from "react-multi-carousel";
import { responsive } from "../pages/Search"
import Scrollbar from "react-scrollbars-custom";
import "react-multi-carousel/lib/styles.css";
import '../styles/artist.css';
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
        const artistsReceived = response.data
        if (artistsReceived.length === 0) {
          setNoResults(true); // Set noResults state if no artists match the query
        }
        setArtists(artistsReceived);
      } else {
        const genres = props.favouriteGenres.map(genre => genre.name);
        const limit = Math.floor(20 / (props.favouriteGenres?.length || 1));
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
      props.snackbar('An error occurred while fetching data. Please try again later.');
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
  const handleRegisterClick = async () => {
    try {
      // Mostra i puntini nel pulsante
      const nextButton = document.getElementById("next-button");
      const originalButtonText = nextButton.textContent;
      nextButton.textContent = "...";

      await props.setFavouriteArtists(selectedAvatars); // Attendere il completamento di setFavouriteArtists

      while (selectedAvatars.length !== props.getFavouriteArtists()) {
        // Aggiungi animazione dei puntini
        nextButton.textContent = "...";
        await wait(500); // Attendi 500ms
        nextButton.textContent = "..";
        await wait(500);
        nextButton.textContent = ".";
        await wait(500);
      }

      // Ripristina il testo originale nel pulsante
      nextButton.textContent = originalButtonText;

      props.snackbar("artisti caricati correttamente");
      props.register();
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      // Gestire l'errore in qualche modo
    }
  };

  // Funzione di utilità per l'attesa
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <Container>
      <div style={{ height: "17vh" }}>
        <Typography variant="h6" gutterBottom className='title'>
          Benvenuto
        </Typography>
        <Typography className='title' style={{ marginBottom: "2%" }}>
          Scegli i tuoi artisti per consigli più personalizzati!
        </Typography>
        <TextField
          label="Cerca artisti"
          fullWidth
          className='input'
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

      </div>

      <h2 className='subtitle'>Artisti</h2>
      <Scrollbar style={{ height: '30vh' }}>
        <Grid container justifyContent="space-around" >
          {artists?.map((artist) => (
            <Grid item xs={3} >
              <ArtistCard artist={artist} selectedArtistId={null} handleAvatarSelect={handleAvatarSelect} />
            </Grid>
          ))}
        </Grid>
      </Scrollbar>

      <h2 className='subtitle'>Artisti Selezionati</h2>
      <div style={{ height: '30vh' }}>
        <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container" responsive={responsive}>
          {selectedAvatars?.map((artist) => (
            <ArtistCard artist={artist} selectedArtistId={null} handleAvatarSelect={handleAvatarSelect} />
          ))}
        </Carousel>
      </div>
      <div style={{ height: '10vh' }}>
        <Button
          id='next-button'
          variant="contained"
          fullWidth
          onClick={() => { handleRegisterClick() }}
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

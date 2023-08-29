import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Avatar, Grid, TextField } from '@mui/material';
import "../styles/artist.css";
import axios from 'axios';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from "./Search"
import Album from "../components/Album"
import Track from "../components/track"
const Artist = ({ user, onBack, snackbar }) => {
  const { artistId } = useParams(); // Ottieni l'id dell'artista dall'URL della pagina
  const [artist, setArtist] = useState([{}]);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://localhost:3100/artist/${artistId}?apikey=123456`);
        if (response.status === 200) {
          console.log(response)
          setArtist(response.data.artist);
          const artistSection = document.getElementById('myArtistSection');
          setTracks(response.data.artist.top_tracks); 
          // Imposta l'immagine di sfondo utilizzando la proprietà style.backgroundImage
          artistSection.style.backgroundImage = `url(${response.data.artist.info.image})`;

        } else {
          console.log("Errore nella richiesta");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchArtist();
  }, []);

  useEffect(() => {
    const fetchQuery = async () => {
      if (query.trim() !== '' && query !== null) {
        try {
          const response = await axios.get(`http://localhost:3100/searchTracksArtist/${artistId}/${query}`);
          console.log(query,response.data)
          setTracks(response.data);
        } catch (error) {
          console.error('Error fetching tracks:', error);
        }
      } else {
        setTracks(artist.top_tracks);
      }
    };
    fetchQuery();
  }, [query, artist.top_tracks, artistId]);

  function addDotsToNumberString(str) {
    return new String(str).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <>
      {artist.info ? (

        <>
          <div className="artist-container" id="myArtistSection" style={{ backgroundImage: `url(${artist.info?.image})` }}>
            <div className="artist-avatar-info">
              <Avatar src={artist.info?.image} alt={artist.info?.name} className="artist-avatar" />
              <div className="artist-info">
                <Typography variant="h3">{artist.info?.name}</Typography>
                <Typography variant="h5">Popolarità: {artist.info?.popularity}</Typography>
                <Typography variant="h5">Followers: {addDotsToNumberString(artist.info?.followers)}</Typography>
              </div>
            </div>
          </div>
          <br></br>
          <div className="top-tracks-section">
            <TextField
              label={`Cerca una canzone di ${artist.info?.name}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              className="input"
              margin="normal"
              variant="outlined"
            />
            <Grid container spacing={2} >
              <Typography variant="h4" style={{ margin: "4%" }}>Top Tracks</Typography>
              {tracks?.map((track, index) => (
                <Track userPlaylists={user.my_playlists.concat(user.playlists)} key={track.id} track={track} index={index + 1} snackbar={snackbar}></Track>
              ))}
            </Grid>
          </div>
          <div className="top-tracks-section">
            <Typography variant="h4" style={{ margin: "4%" }}>Albums</Typography>
            {artist.albums?.length > 0 ? ( // Controlla se c'è almeno un elemento nell'array
              <Carousel
                showDots={true}
                itemClass="carousel-item-album"
                containerClass="carousel-container"
                responsive={responsive}
              >
                {artist.albums.map((album) => (
                  <Link key={album.id} to={`/album/${album.id}`}>
                    <Album key={album.id} album={album} />
                  </Link>
                ))}
              </Carousel>
            ) : (
              <p>Nessun album da mostrare.</p>
            )}
          </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
      {/* Mostra la pagina dell'artista */}


      {/* Pulsante per tornare alla pagina Home */}
      <button onClick={onBack}>Torna alla Home</button>
    </>
  );
};

export default Artist;
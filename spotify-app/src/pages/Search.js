import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Grid } from '@mui/material';
import Track from '../components/track';
import PlaylistCard from '../components/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import Album from '../components/Album';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

export default function SearchResults({ onPlaylistClick, onArtistClick }) {
  const { query } = useParams(); // Preleva la query dall'URL
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    // Invia la richiesta al server
    axios.get(`http://localhost:3100/search/${query}`)
      .then(response => {
        console.log("response.data", response.data);
        setSearchResults(response.data); // Imposta i risultati della ricerca
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  }, [query]);

  return (
    <div>
    <h1>Risultati della ricerca per "{query}"</h1>
    {searchResults && (
      <div>
        {/* Sezione Brani */}
        <h2>Brani</h2>
        <Grid container spacing={2}>
          {searchResults.tracks?.map((track, index) => (
              <Track track={track} index={index + 1} />
          ))}
        </Grid>

        {/* Sezione Album */}
        <h2>Album</h2>

        <Carousel showDots={true} responsive={responsive}>
        {searchResults.albums?.map(album => (
              <Album key={album.id} album={album} />
          ))}
      </Carousel>
          

        {/* Sezione Playlist */}
        <h2>Playlist</h2>
        <Grid container spacing={2}>
          {searchResults.playlists?.map(playlist => (
            <Grid item key={playlist.id} xs={12} sm={6} md={4} lg={3}>
              <PlaylistCard
                playlist={playlist}
                owner={playlist.owner}
                selectedPlaylistId={onPlaylistClick}
              />
            </Grid>
          ))}
        </Grid>

        {/* Sezione Artisti */}
        <h2>Artisti</h2>
        <Grid container spacing={2}>
          {searchResults.artists?.map(artist => (
            <Grid item key={artist.id} xs={12} sm={6} md={4} lg={3}>
              <ArtistCard
                artist={artist}
                selectedArtistId={onArtistClick}
              />
            </Grid>
          ))}
        </Grid>

        {/* Sezione Utente */}
        <h2>Utente</h2>
        <Grid container spacing={2}>
          {searchResults.users?.map(user => (
            <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
              <ArtistCard
                artist={user}
                selectedArtistId={onArtistClick}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    )}
  </div>
  );
}
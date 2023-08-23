import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Grid } from '@mui/material';
import Track from '../components/track';
import PlaylistCard from '../components/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import UserCard from '../components/UserCard';
import Album from '../components/Album';
import Scrollbar from "react-scrollbars-custom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../style/search.css";
export const responsive = {
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

export default function SearchResults({ user }) {
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
      {searchResults && (
        <div>
          {/* Sezione Brani */}
          {searchResults.tracks && searchResults.tracks.length > 0 && (
            <h2>Brani</h2>
          )}
          <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '50vh' }}>
            <Scrollbar >
              {searchResults.tracks?.map((track, index) => (
                <Track track={track} index={index + 1} />
              ))}
            </Scrollbar>
          </div>

          {/* Sezione Album */}
          {searchResults.albums && searchResults.albums.length > 0 && (
            <>
            <h2>Album</h2>
            <Carousel showDots={true} itemClass="carousel-item-album" containerClass="carousel-container" responsive={responsive}>

              {searchResults.albums?.map(album => (
                <Link key={album.id} to={`/album/${album.id}`}>
                  <Album album={album} />
                </Link>
              ))}
            </Carousel></>
          )}

          {/* Sezione Playlist */}
          {searchResults?.playlists && searchResults.playlists?.length > 0 && (
            <>
              <h2>Playlist</h2>
              <Carousel
                showDots={true}
                itemClass="carousel-item"
                containerClass="carousel-container"
                responsive={responsive}
              >
                {searchResults.playlists?.map(playlist => (
                  <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                    <PlaylistCard
                      playlist={playlist}
                      owner={playlist.type === "public"
                        ? `${playlist.owner.profile_name} • pubblica`
                        : user.profile_name}
                      selectedPlaylistId={null} />
                  </Link>
                ))}
              </Carousel></>
          )}

          {/* Sezione Artisti */}
          {searchResults.artists && searchResults.artists.length > 0 && (
            <>
              <h2>Artisti</h2>
              <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container" responsive={responsive}>
                {searchResults.artists?.map(artist => (
                  <Link key={artist.id} to={`/artist/${artist.id}`}>
                    <ArtistCard
                      artist={artist}
                      selectedArtistId={""} />
                  </Link>

                ))}
              </Carousel></>
          )}
          {/* Sezione Utente */}
          {searchResults.users && searchResults.users.length > 0 && (
            <>
              <h2>Utenti</h2>
              <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container" responsive={responsive}>
                {searchResults.users?.map(user => (
                  <Link key={user.id} to={`/user/${user.id}`}>
                    <UserCard
                      user={user} />
                  </Link>

                ))}
              </Carousel></>
          )}
        </div>
      )}
    </div>
  );
}
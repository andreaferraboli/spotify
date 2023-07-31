import React from 'react';
import PlaylistCard from "../components/PlaylistCard"
import ArtistCard from "../components/ArtistCard"
import Box from "@mui/material/Box";
import "../style/home.css";

const Home = (props) => {
  return (
    
    <><div className='home-section'>
      <h2>Le mie PLAYLIST</h2>
      <Box display="flex" justifyContent="space-between">
        {props.user.my_playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} owner={props.user.profile_name} />
        ))}
      </Box>
    </div><div  className='home-section'>
        <h2>I miei ARTISTI</h2>
        <Box display="flex" justifyContent="space-between">
          {props.user.favourite_artists.map((artist) => (
            <ArtistCard key={artist.id} name={artist.name} image={artist.images} />
          ))}
        </Box>
      </div></>
  );
};

export default Home;

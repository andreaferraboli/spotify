import React from 'react';
import PlaylistCard from "../components/PlaylistCard"
import ArtistCard from "../components/ArtistCard"
import Box from "@mui/material/Box";

const Home = (props) => {
  return (
    
    <><Box display="flex" justifyContent="space-between">
      {props.user.my_playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </Box><Box display="flex" justifyContent="space-between">
        {props.user.favourite_artists.map((artist) => (
          <ArtistCard key={artist.id} name={artist.name} image={artist.images}/>
        ))}
      </Box></>
  );
};

export default Home;

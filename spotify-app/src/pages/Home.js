import React from 'react';
import PlaylistCard from "../components/PlaylistCard"
import ArtistCard from "../components/ArtistCard"
import Box from "@mui/material/Box";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {responsive} from "./Search"
import "../style/home.css";
const Home = (props) => {
  return (
    
    <><div className='home-section'>
      <h2>Le mie PLAYLIST</h2>
      <Carousel showDots={true} centerMode={true} itemClass="carousel-item"  containerClass="carousel-container" responsive={responsive}>
        {props.user.my_playlists?.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} owner={props.user.profile_name} selectedPlaylistId={props.onPlaylistClick} />
        ))}
      </Carousel>
    </div><div  className='home-section'>
        <h2>I miei ARTISTI</h2>
        <Carousel showDots={true} centerMode={true} itemClass="carousel-item" containerClass="carousel-container" responsive={responsive}>
          {props.user.favourite_artists?.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} selectedArtistId={props.onArtistClick} />
          ))}
        </Carousel>
      </div></>
  );
};

export default Home;

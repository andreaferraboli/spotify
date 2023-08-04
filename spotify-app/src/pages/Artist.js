import React, { useEffect, useState } from "react";
import { Card, CardHeader, Box, CardContent, CardMedia, Typography, Avatar, Grid } from '@mui/material';
import "../style/artist.css";
import Album from "../components/Album"
import Track from "../components/track"
const Artist = ({ user, artistId, onBack }) => {
  const [artist, setArtist] = useState([{}]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await fetch(`http://localhost:3100/artist/${artistId}?apikey=123456`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setArtist(data.info);
        } else {
          console.log("Errore nella richiesta");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchArtist();
  }, []);
  function addDotsToNumberString(str) {
    return new String(str).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return (
    <>
      {artist ? (

        <>

          <div className="artist-section" style={{ backgroundImage: `url(${artist[0].image})` }}>
          
            <Avatar src={artist[0].image} alt={artist[0].name} className="artist-avatar" />
            <Grid container spacing={3} className="artist-div">
              <Grid item xs={12} sm={6}>
                <Typography variant="h3">{artist[0].name}</Typography>
                <Typography variant="h5">Popolarità: {artist[0].popularity}</Typography>
                <Typography variant="h5">Followers: {addDotsToNumberString(artist[0].followers)}</Typography>
              </Grid>
            </Grid>
          </div> 
          <div className="top-tracks-section">
            <Grid container spacing={2} >
          <Typography variant="h4" style={{margin:"4%"}}>Top Tracks</Typography>
              {artist[1]?.map((track, index) => (
                <Track key={track.id} track={track} index={index + 1}></Track>
              ))}
            </Grid>
          </div>
          <div className="top-tracks-section">
            <Typography variant="h4" style={{margin:"4%"}}>Albums</Typography>
            <Box display="flex" justifyContent="space-between">
              {artist[2]?.map((album) => (
                <Album key={album.id} album={album} />
              ))}
            </Box>
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
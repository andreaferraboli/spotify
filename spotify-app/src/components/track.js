import React from "react";
import { Grid, Typography } from "@mui/material";
import "../style/track.css";
const Track = (props) => {
    
  return (
    <>
    <Grid container spacing={3} className="track">

    
      <Grid item xs={1}>
        <Typography variant="body1">{props.index}</Typography>
      </Grid>
      <Grid xs={1} item >
        <img
          src={props.track.image}
          alt={props.track.name}
          style={{width:"auto", height: "100px" }}
        />
      </Grid>
      <Grid xs={8} item >
      <Typography variant="h6">{props.track.name}</Typography>
            <Typography  variant="subtitle2">
              {props.track.artist.map((artist, index) => (
              <span key={index}>
                {artist}
                {index !== props.track.artist.length - 1 && ", "}
              </span>
            ))}
            </Typography>
           
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2">
           {formatDuration(props.track.duration)}
        </Typography>
      </Grid>
      </Grid>
    </>
  );
};

export default Track;

// Funzione per formattare la durata in minuti e secondi
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

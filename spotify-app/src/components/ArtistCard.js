import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, Avatar } from '@mui/material';
import "../styles/card.css";

export default function ArtistCard(props) {
  return (
    <Card className='circular-card' onClick={() => {
      if (props.selectedArtistId === "") {
        // Fai qualcosa quando selectedArtistId è "undefined"
      } else if (props.selectedArtistId === null) {
        props.handleAvatarSelect(props.artist);
      } else {
        props.selectedArtistId(props.artist.id); // Assumi che selectedArtistId sia una funzione
      }
    }}>
      <CardActionArea>
        <div className="circular-image">
          <img src={props.artist.image} alt={props.artist.name} />
        </div>
        <CardContent>
          <Typography style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}} gutterBottom variant="h5" component="div" className='artist-name'>
            {props.artist.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
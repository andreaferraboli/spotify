import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import "../style/card.css";
export default function PlaylistCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }} className='card-playlist' onClick={()=> props.selectedPlaylistId(props.playlist.id)} >
      <CardActionArea>
        <CardMedia
          component="img"
          className='card-media'
          image={props.playlist.image}
          alt={props.playlist.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.playlist.name}
          </Typography>
          <Typography variant="h7" >
            {props.owner}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
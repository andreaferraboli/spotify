import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import "../style/card.css";

export default function PlaylistCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }} className='circular-card'>
      <CardActionArea>
        <CardMedia
          component="img"
          className='circular-image'
          image={props.image}
          alt={props.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className='artist-name'>
            {props.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
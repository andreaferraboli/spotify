import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Avatar } from '@mui/material';
import "../style/card.css";

export default function UserCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }} className='circular-card' onClick={() => {
      // if (props.selectedArtistId == null)
      //   props.handleAvatarSelect(props.user)
      // else
      //   props.selectedArtistId(props.user.id)
    }} >
      <CardActionArea>
        <Avatar src={props.user.image} alt={props.user.name} sx={{ width: "100%", height: "10rem" }} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" className='artist-name'>
            {props.user.profile_name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
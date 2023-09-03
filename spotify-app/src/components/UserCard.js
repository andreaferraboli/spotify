import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Avatar } from '@mui/material';
import "../styles/card.css";

export default function UserCard(props) {
  return (
    <Card sx={{ maxWidth: 345 }} className='circular-card' onClick={() => {
      
    }} >
      <CardActionArea>
        <Avatar src={props.user.image} alt={props.user.name} sx={{ width: "100%", height: "10rem" }} />
        <CardContent>
          <Typography style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}} gutterBottom variant="h5" component="div" className='artist-name'>
            {props.user.profile_name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
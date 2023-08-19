import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import "../style/album.css"; // Importa il file CSS

const Album = ({ album }) => {
  const fontSize = Math.max(12, album.name.length -5);
  return (
    <Card className="album-card">
      <CardMedia className="album-image" component="img" image={album.image} alt={album.name} />
      <CardContent>
        <Typography variant="h6" className="album-name" style={{ fontSize: `${fontSize}px` }}>{album.name}</Typography>
        <Typography variant="body2"  >
          {album.year}
        </Typography>
        {/* ... Aggiungi altre informazioni dell'album ... */}
      </CardContent>
    </Card>
  );
};

export default Album;
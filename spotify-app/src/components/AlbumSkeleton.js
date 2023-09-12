import React from "react";
import { Card, CardContent, CardMedia, Typography, Skeleton } from "@mui/material";
import "../styles/album.css"; // Importa il file CSS

const AlbumSkeleton = () => {
  return (
    <Card className="album-card">
      <CardMedia className="album-image skeleton" component={Skeleton} animation="wave" />
      <CardContent>
        <Typography variant="h6" className="album-name skeleton">
          <Skeleton animation="wave" width="80%" />
        </Typography>
        <Typography variant="body2" className="album-year skeleton">
          <Skeleton animation="wave" width="50%" />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AlbumSkeleton;


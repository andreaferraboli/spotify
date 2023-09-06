import React from "react";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import "../styles/album.css"; // Importa il file CSS

const Album = ({album}) => {
    return (
        <Card className="album-card">
            <CardMedia className="album-image" component="img" image={album.image} alt={album.name}/>
            <CardContent>
                <Typography variant="h6" className="album-name" style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: `${270}px`
                }}>
                    {album.name}
                </Typography>
                <Typography variant="body2">
                    {album.year} {/* Aggiungi eventuali altre informazioni sull'album */}
                </Typography>
                {/* ... Aggiungi altre informazioni dell'album ... */}
            </CardContent>
        </Card>
    );
};

export default Album;
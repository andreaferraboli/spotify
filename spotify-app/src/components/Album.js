import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardMedia, Typography} from "@mui/material";
import "../styles/album.css"; // Importa il file CSS

const Album = ({album}) => {
    return (
        <Card className="album-card">
            <CardMedia className="album-image" component="img" image={album.image} alt={album.name}/>
            <CardContent className="div-info-album">
                <Typography variant="h6" className="album-name" style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: `9em`
                }}>
                    {album.name}
                </Typography>
                <Typography variant="body2">
                    {album.artists.map((artist, index) => (
                        <span key={artist.id}>
                            <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                            {index !== album.artists.length - 1 && ", "}
                        </span>
                    ))}{" • " + album.year} {/* Aggiungi eventuali altre informazioni sull'album */}
                </Typography>
                {/* ... Aggiungi altre informazioni dell'album ... */}
            </CardContent>
        </Card>
    );
};

export default Album;
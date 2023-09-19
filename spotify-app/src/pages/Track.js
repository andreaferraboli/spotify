import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ColorThief from "colorthief";
import {Grid, Typography,} from "@mui/material";
import axios from 'axios';
import {formatDuration} from "../components/track"
import "../styles/album.css"; // Assumi che tu abbia uno stile CSS per l'album

const TrackPage = ({snackbar}) => {
    const {trackId} = useParams();
    const [track, setTrack] = useState();
    const [trackColors, setTrackColors] = useState([]);

    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;
        const fetchTrack = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/track/${trackId}?apikey=${apiKey}`);
                setTrack(response.data);
                if (response.data.album.images[0]?.url) {
                    const image = new Image();
                    image.crossOrigin = "anonymous"; // Assicurati che l'immagine possa essere letta come dati dai domini esterni
                    image.src = response.data.album.images[0].url;

                    image.onload = () => {
                        const colorThief = new ColorThief();
                        const colorPalette = colorThief.getPalette(image, 3); // Ottieni una sfumatura di 3 colori
                        setTrackColors(colorPalette.map(color => `rgb(${color[0]}, ${color[1]}, ${color[2]})`));
                    };
                }
            } catch (error) {
                snackbar(error, "error");
            }
        };
        fetchTrack();
    }, [trackId]);


    return (
        <>
            <div
                style={{background: `linear-gradient(0deg, ${trackColors[0]} 0%, ${trackColors[1]} 80%, ${trackColors[2]}) 20%`}}>
                <Grid container style={{margin: 0}} spacing={1}>
                    <Grid item xs={12} sm={3}>
                        <img id="playlist_image" src={track?.album.images[0].url} alt="album"
                             className="playlist-image"/>
                    </Grid>
                    <Grid item xs={12} sm={9} className="info-section">
                        <div className="playlist-info-container vh33">
                            <Typography variant="body1">Track</Typography>
                        </div>
                        <div className="playlist-info-container vh33">
                            <Typography variant="h3">
                                {track?.name}
                            </Typography>

                        </div>
                        <div className="playlist-info-container vh33">
                            <div>
                                <Typography variant="body1">
                                    {track?.artists?.map((artist, index) => (
                                        <span key={artist.id}>
                                            <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                                            {index !== track.artists.length - 1 && ", "}
                                        </span>
                                    ))} • {<Link
                                    to={`/album/${track?.album?.id}`}>{track?.album?.name}</Link>} • {track?.album?.release_date.slice(0, 4)} •
                                    {" " + formatDuration(
                                        track?.duration_ms
                                    )}
                                </Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{background: `linear-gradient(${trackColors[0]}, rgba(0, 0, 0, 0))`, height: "30vh"}}>
                {/* Content after the track details */}
            </div>
        </>
    );
};


export default TrackPage;
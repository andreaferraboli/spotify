import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Track from "../components/track";
import {
    Typography,
    Avatar,
    Grid,
    IconButton,
    Button,
} from "@mui/material";
import axios from 'axios';
import { formatDuration } from "../components/track"
import "../style/album.css"; // Assumi che tu abbia uno stile CSS per l'album

const Album = ({ onBack }) => {
    const { trackId } = useParams();
    const [track, setTrack] = useState();

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/track/${trackId}?apikey=123456`);
                console.log(response);
                setTrack(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchTrack();
    }, [trackId]);
    return (
        <>
            <Grid container style={{ margin: 0 }} spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img id="playlist_image" src={track?.album.images[0].url} alt="album" className="playlist-image" />
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
                                ))} • {<Link to={`/album/${track?.album?.id}`}>{track?.album?.name}</Link>} • {track?.album?.release_date.slice(0, 4)} •
                                {" "+ formatDuration(
                                    track?.duration_ms
                                )}
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <button onClick={onBack}>Torna alla Home</button>
        </>
    );
};


export default Album;
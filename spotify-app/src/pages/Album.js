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
import { formatDuration } from "./Playlist"
import "../style/album.css"; // Assumi che tu abbia uno stile CSS per l'album

const Album = ({ user, onBack }) => {
    const { albumId } = useParams();
    const [album, setAlbum] = useState();

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/album/${albumId}?apikey=123456`);
                console.log(response);
                setAlbum(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAlbum();
    }, [albumId]);
    return (
        <>
            <Grid container style={{ margin: 0 }} spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img id="playlist_image" src={album?.image} alt="album" className="playlist-image" />
                </Grid>
                <Grid item xs={12} sm={9} className="info-section">
                    <div className="playlist-info-container vh33">
                        <Typography variant="body1">album</Typography>
                    </div>
                    <div className="playlist-info-container vh33">
                        <Typography variant="h3">
                            {album?.name}
                        </Typography>

                    </div>
                    <div className="playlist-info-container vh33">
                        <div>
                            <Typography variant="body1">
                                {album?.artists?.map((artist, index) => (
                                    <span key={artist.id}>
                                        <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                                        {index !== album.artists.length - 1 && ", "}
                                    </span>
                                ))} - {album?.tracks?.length} brani, circa{" "}
                                {formatDuration(
                                    album?.tracks?.reduce(
                                        (total, song) => total + song.duration,
                                        0
                                    )
                                )}
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <div >
                <Grid item xs={12}>
                    <Typography variant="h4" className="title-section">
                        Tracks
                    </Typography>
                </Grid>
                <Grid container spacing={2} style={{ margin: 0 }}>
                    <div className="top-tracks-section">
                        <Grid container spacing={2} >
                            {album?.tracks?.map((track, index) => (
                                <Track key={track.id} userPlaylists={user.my_playlists} track={track} index={index + 1}></Track>

                            ))}
                        </Grid>
                    </div>
                </Grid>
            </div>
            <button onClick={onBack}>Torna alla Home</button>
        </>
    );
};


export default Album;
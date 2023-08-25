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
import "../style/user.css"; // Assumi che tu abbia uno stile CSS per l'user

const User = ({ onBack }) => {
    const { userId } = useParams();
    const [user, setUser] = useState();

    useEffect(() => {
        const fetchUser = async () => {
            if (userId ?? "") {
                try {
                    const response = await axios.get(`http://localhost:3100/showUser/${userId}?apikey=123456`);
                    console.log(response);
                    setUser(response.data);
                } catch (error) {
                    console.log(error);
                }
            }

        };
        fetchUser();
    }, [userId]);
    return (
        <>
            <Grid container style={{ margin: 0 }} spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img id="playlist_image" src={user?.image} alt="user" className="playlist-image" />
                </Grid>
                <Grid item xs={12} sm={9} className="info-section">
                    <div className="playlist-info-container">
                        <Typography variant="body1">Profilo</Typography>
                    </div>
                    <div className="playlist-info-container">
                        <Typography variant="h3">
                            {user?.profile_name}
                        </Typography>

                    </div>
                    <div className="playlist-info-container">
                        <div>
                            <Typography variant="body1">
                                {user?.playlists?.length} playlist pubbliche, {"followers: "}
                                {formatDuration(
                                    user?.playlist?.reduce(
                                        (total, playlist) => total + playlist.followers.length,
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
                            {user?.tracks?.map((track, index) => (
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


export default User;
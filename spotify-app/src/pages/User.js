import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Typography,
    Avatar,
    Grid
} from "@mui/material";
import axios from 'axios';
import PlaylistCard from "../components/PlaylistCard"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive } from "./Search"
import "../styles/user.css"; // Assumi che tu abbia uno stile CSS per l'user

const User = ({ snackbar }) => {
    const { userId } = useParams();
    const [user, setUser] = useState();
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
    
        const fetchUser = async () => {
            if (userId ?? "") {
                try {
                    const response = await axios.get(`http://localhost:3100/showUser/${userId}?apikey=${apiKey}`);
                    setUser(response.data);
                } catch (error) {
                    snackbar(error,"error");
                }
            }
        };
        fetchUser();
    }, [userId, apiKey, snackbar]);
    
    return (
        <>
            <Grid container style={{ margin: 0 }} spacing={1}>
                <Grid item xs={12} sm={3} style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                    <Avatar src={user?.image} alt={user?.profile_name} className="user-avatar" />
                </Grid>
                <Grid item xs={12} sm={9} className="info-section">
                    <div className="user-info-container">
                        <Typography variant="body1">Profilo</Typography>
                    </div>
                    <div className="user-info-container">
                        <Typography variant="h3">
                            {user?.profile_name}
                        </Typography>

                    </div>
                    <div className="user-info-container">
                        <div>
                            <Typography variant="body1">
                                {user?.playlists?.length} playlist pubbliche, {"followers: "}
                                {
                                    user?.playlists?.reduce((total, playlist) => total + playlist.followers.length, 0)
                                }
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
            {user?.playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist pubbliche create da {user.profile_name}</h2>
                    <Carousel showDots={true} itemClass="carousel-item-playlist" containerClass="carousel-container" responsive={responsive}>
                        {user.playlists.map((playlist) => (
                            <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                                <PlaylistCard
                                    playlist={playlist}
                                    owner={`${playlist.owner.profile_name} • pubblica`
                                    }
                                    selectedPlaylistId={null} />
                            </Link>
                        ))}
                    </Carousel>
                </div>
            )}
        </>
    );
};


export default User;
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Grid} from '@mui/material';
import PlaylistCard from '../components/PlaylistCard';
import {Link} from 'react-router-dom';

export default function Library({user, snackbar}) {
    const [followed_playlists, setFollowedPlaylists] = useState([]);
    const [your_public_playlists, setYourPublicPlaylists] = useState([]);

    useEffect(() => {
        // Chiamata alla funzione che ottiene le playlist correlate
        GetRelatedPlaylists(user._id);
    }, [user._id]);

    const GetRelatedPlaylists = async (userId) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            const response = await axios.get(`https://spotify-server-kohl.vercel.app/relatedPlaylists/${userId}?apikey=${apiKey}`);
            if (response.status === 200) {
                const data = response.data;
                setFollowedPlaylists(data.followed_playlists || []);
                setYourPublicPlaylists(data.your_public_playlists || []);
            } else {
                snackbar('Error get related playlists', "error");
            }
        } catch (error) {
            snackbar('Error fetching related playlists', "error");
        }
    };

    return (
        <div>
            {user?.my_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Le mie PLAYLIST</h2>
                    <Grid container spacing={2} style={{marginLeft:"0px"}}>
                        {user.my_playlists.map((playlist) => (
                            <Grid key={playlist.id} item xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/playlist/${playlist.id}`}>
                                    <PlaylistCard
                                        playlist={playlist}
                                        owner={user.profile_name}
                                        selectedPlaylistId={null}
                                    />
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}

            {/* Aggiungi la sezione delle playlist seguite */}
            {followed_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist che segui</h2>
                    <Grid container spacing={2} style={{marginLeft:"0px"}}>
                        {followed_playlists.map((playlist) => (
                            <Grid key={playlist.id} item xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/playlist/${playlist.id}`}>
                                    <PlaylistCard
                                        playlist={playlist}
                                        owner={playlist.owner.profile_name}
                                        selectedPlaylistId={null}
                                    />
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}

            {/* Aggiungi la sezione delle playlist pubbliche create da te */}
            {your_public_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist pubbliche create da te</h2>
                    <Grid container spacing={2} style={{marginLeft:"0px"}}>
                        {your_public_playlists.map((playlist) => (
                            <Grid key={playlist.id} item xs={12} sm={6} md={4} lg={3}>
                                <Link to={`/playlist/${playlist.id}`}>
                                    <PlaylistCard
                                        playlist={playlist}
                                        owner={user.profile_name}
                                        selectedPlaylistId={null}
                                    />
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </div>
    );
}

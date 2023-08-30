import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Track from '../components/track';
import PlaylistCard from '../components/PlaylistCard';
import { Grid } from '@mui/material'; // Import the Grid component from Material-UI
import ArtistCard from '../components/ArtistCard';
import UserCard from '../components/UserCard';
import Album from '../components/Album';
import "../styles/search.css";


export default function SearchResults({ user }) {
    const { idTrack } = useParams(); // Preleva la query dall'URL
    const [searchResults, setSearchResults] = useState(null);



    useEffect(() => {
        const apiKey = process.env.REACT_APP_API_KEY;
        // Invia la richiesta al server con l'API key nell'URL come query parameter
        axios.get(`http://localhost:3100/searchTrack/${idTrack}?id=${user._id}&apikey=${apiKey}`)
        .then(response => {
            setSearchResults(response.data); // Imposta i risultati della ricerca
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
    }, [idTrack]);
    

    return (
        <div>
            {searchResults && (
                <div>
                    {/* Sezione Playlist */}
                    {searchResults?.playlists && searchResults.playlists.length > 0 && (
                        <>
                            <h2>Nelle Tue Playlist Private</h2>
                            <Grid container spacing={2}>
                                {searchResults.playlists.map(playlist => (
                                    <Grid key={playlist.id} item xs={12} sm={6} md={4} lg={3}>
                                        <Link to={`/playlist/${playlist.id}`}>
                                            <PlaylistCard
                                                playlist={playlist}
                                                owner={playlist.type === "public"
                                                    ? `${playlist.owner.profile_name} • pubblica`
                                                    : user.profile_name}
                                                selectedPlaylistId={null}
                                            />
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    {/* Sezione Playlist */}
                    {searchResults?.public_playlists && searchResults.public_playlists.length > 0 && (
                        <>
                            <h2>Nelle Playlist Pubbliche</h2>
                            <Grid container spacing={2}>
                                {searchResults.public_playlists.map(playlist => (
                                    <Grid key={playlist.id} item xs={12} sm={6} md={4} lg={3}>
                                        <Link to={`/playlist/${playlist.id}`}>
                                            <PlaylistCard
                                                playlist={playlist}
                                                owner={playlist.type === "public"
                                                    ? `${playlist.owner.profile_name} • pubblica`
                                                    : user.profile_name}
                                                selectedPlaylistId={null}
                                            />
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                </div>
            )}
        </div>
    );
}
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Avatar, Button, Grid, TextField, Typography} from '@mui/material';
import "../styles/artist.css";
import axios from 'axios';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {responsive} from "./Search"
import Album from "../components/Album"
import Track from "../components/track"

const Artist = ({user, snackbar}) => {
    const {artistId} = useParams(); // Ottieni l'id dell'artista dall'URL della pagina
    const [artist, setArtist] = useState([{}]);
    const [query, setQuery] = useState("");
    const [tracks, setTracks] = useState([]);
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/artist/${artistId}?apikey=${apiKey}`);

                if (response.status === 200) {
                    const {artist} = response.data;
                    setArtist(artist);

                    const artistSection = document.getElementById('myArtistSection');
                    setTracks(artist.top_tracks);

                    // Imposta l'immagine di sfondo utilizzando il CSS invece di manipolare il DOM direttamente
                    artistSection.style.backgroundImage = `url(${artist.info.image})`;
                } else {
                    snackbar("Errore nella richiesta:" + response.status, "error");
                }
            } catch (error) {
                snackbar("Errore:" + error, "error");
            }
        };

        fetchArtist();
    }, [artistId, apiKey, snackbar]);


    useEffect(() => {
        const fetchQuery = async () => {
            if (query.trim() !== '' && query !== null) {
                try {
                    const response = await axios.get(`http://localhost:3100/searchTracksArtist/${artistId}/${query}?apikey=${apiKey}`);
                    if (response.status === 200) {
                        setTracks(response.data);
                    } else {
                        snackbar('Error fetching tracks:' + response.data.message, "error");
                    }
                } catch (error) {
                    snackbar('Error fetching tracks:' + error, "error");
                }
            } else {
                setTracks(artist.top_tracks);
            }
        };
        fetchQuery();
    }, [query, artist.top_tracks, artistId, apiKey, snackbar]);

    async function changeFollow(userId, action) {
        try {
            const response = await axios.put(`http://localhost:3100/updateFavouriteArtists/${userId}?action=${action}&apikey=${apiKey}`, {artist: artist.info});

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload();
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            snackbar(error.message, "error");
        }
    }

    function addDotsToNumberString(str) {
        const number = parseFloat(str); // Converte la stringa in un numero, se necessario
        if (!isNaN(number)) {
            return number.toLocaleString();
        } else {
            return str; // Restituisce la stringa originale se non è un numero valido
        }
    }

    return (
        <>
            {artist.info ? (

                <>
                    <div className="artist-container" id="myArtistSection"
                         style={{backgroundImage: `url(${artist.info?.image})`}}>
                        <div className="artist-avatar-info">
                            <Avatar src={artist.info?.image} alt={artist.info?.name} className="artist-avatar"/>
                            <div className="artist-info">
                                <Typography variant="h3">{artist.info?.name}</Typography>
                                <Typography variant="h5">Popolarità: {artist.info?.popularity}</Typography>
                                <Typography
                                    variant="h5">Followers: {addDotsToNumberString(artist.info?.followers)}</Typography>
                                {user?.favourite_artists.some(favoriteArtist => favoriteArtist.id === artist.info?.id) ? (
                                    <Button
                                        variant="outlined"
                                        className="delete-button"
                                        onClick={() => changeFollow(user._id, "remove")}
                                    >
                                        Smetti di seguire
                                    </Button>
                                ) : (
                                    user?.favourite_artists && (
                                        <Button
                                            variant="outlined"
                                            className="add-button"
                                            onClick={() => changeFollow(user._id, "add")}
                                        >
                                            Segui Artista
                                        </Button>
                                    )
                                )}

                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="top-tracks-section">
                        <TextField
                            label={`Cerca una canzone di ${artist.info?.name}`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            fullWidth
                            className="input"
                            margin="normal"
                            variant="outlined"
                        />
                        <Grid container spacing={2}>
                            <Typography variant="h4" style={{margin: "4%"}}>Top Tracks</Typography>
                            {tracks?.map((track, index) => (
                                <Track userPlaylists={user.my_playlists.concat(user.playlists)} key={track.id}
                                       track={track} index={index + 1} snackbar={snackbar}></Track>
                            ))}
                        </Grid>
                    </div>
                    <div className="top-tracks-section">
                        <Typography variant="h4" style={{margin: "4%"}}>Albums</Typography>
                        {artist.albums?.length > 0 ? ( // Controlla se c'è almeno un elemento nell'array
                            <Carousel
                                showDots={true}
                                itemClass="carousel-item-album"
                                containerClass="carousel-container"
                                responsive={responsive}
                            >
                                {artist.albums.map((album) => (
                                    <Link key={album.id} to={`/album/${album.id}`}>
                                        <Album key={album.id} album={album}/>
                                    </Link>
                                ))}
                            </Carousel>
                        ) : (
                            <p>Nessun album da mostrare.</p>
                        )}
                    </div>
                </>
            ) : (
                <h1>Loading...</h1>
            )}
            {/* Mostra la pagina dell'artista */}


        </>
    );
};

export default Artist;
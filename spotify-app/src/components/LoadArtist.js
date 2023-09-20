import React, {useEffect, useState} from 'react';
import {Button, Container, Grid, TextField, Typography} from '@mui/material';
import axios from 'axios';
import ArtistCard from "./ArtistCard"
import Carousel from "react-multi-carousel";
import {responsive} from "../pages/Search"
import Scrollbar from "react-scrollbars-custom";
import "react-multi-carousel/lib/styles.css";
import '../styles/artist.css';

const LoadArtist = (props) => {
    const [selectedAvatars, setSelectedAvatars] = useState([]);
    const [artists, setArtists] = useState([]);
    const [query, setQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [isRegistrationInProgress, setIsRegistrationInProgress] = useState(false);
    const apiKey = process.env.REACT_APP_API_KEY;

    const fetchData = async () => {
        try {
            setNoResults(false);

            if (query !== '') {
                const response = await axios.get(`http://localhost:3100/artists/${query}?apikey=${apiKey}`);
                const artistsReceived = response.data;
                if (artistsReceived.length === 0) {
                    setNoResults(true); // Set noResults state if no artists match the query
                }
                setArtists(artistsReceived);
            } else {
                const genres = props.favouriteGenres.map(genre => genre.name);
                const limit = Math.floor(20 / (props.favouriteGenres?.length || 1));
                const response = await axios.post(`http://localhost:3100/genre?apikey=${apiKey}`, {
                    genres: genres,
                    limit: limit
                });
                setArtists(response.data);
                if (response.data.length === 0) {
                    setNoResults(true); // Set noResults state if no artists are available
                }
            }
        } catch (error) {
            props.snackbar('An error occurred while fetching data ' + error, "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, [query]);


    const handleAvatarSelect = (artist) => {
        if (artist !== null && artist !== undefined) {
            if (!selectedAvatars?.some(a => a.id === artist.id)) {
                setSelectedAvatars(prevSelectedAvatars => [...prevSelectedAvatars, artist]);
            } else {
                setSelectedAvatars(prevSelectedAvatars =>
                    prevSelectedAvatars.filter(a => a.id !== artist.id)
                );
            }
        }

    };


    const handleRegisterClick = async () => {
        const nextButton = document.getElementById("next-button");
        try {
            if (!isRegistrationInProgress) {
                setIsRegistrationInProgress(true)
                nextButton.textContent = "conferma registrazione";
                await props.setFavouriteArtists(selectedAvatars);

                props.snackbar("Artisti caricati correttamente");
            } else {
                // Second click: Call props.register
                props.register();
            }
        } catch (error) {
            setIsRegistrationInProgress(false);
            props.snackbar("Errore durante la registrazione: " + error, "error");
            // Handle the error in some way
        }
    };


    return (
        <Container>
            <div style={{height: "17vh"}}>
                <Typography variant="h6" gutterBottom className='title'>
                    Benvenuto
                </Typography>
                <Typography className='title' style={{marginBottom: "2%"}}>
                    Scegli i tuoi artisti per consigli più personalizzati!
                </Typography>
                <TextField
                    label="Cerca artisti"
                    fullWidth
                    className='input'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />

            </div>

            <h2 className='subtitle'>Artisti</h2>
            <Scrollbar style={{height: '30vh'}}>
                <Grid container justifyContent="space-around">
                    {artists?.map((artist) => (
                        <Grid item xs={3}>
                            <ArtistCard artist={artist} selectedArtistId={null}
                                        handleAvatarSelect={handleAvatarSelect}/>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>

            <h2 className='subtitle'>Artisti Selezionati</h2>
            <div style={{height: '30vh'}}>
                <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container"
                          responsive={responsive}>
                    {selectedAvatars?.map((artist) => (
                        <ArtistCard artist={artist} selectedArtistId={null} handleAvatarSelect={handleAvatarSelect}/>
                    ))}
                </Carousel>
            </div>
            <div style={{height: '10vh'}}>
                <Button
                    id='next-button'
                    variant="contained"
                    fullWidth
                    onClick={() => {
                        handleRegisterClick()
                    }}
                    className="button"
                >
                    Avanti
                </Button>
            </div>
            {noResults && <p>No artists match your search or no artists are available.</p>}
        </Container>
    );
};

export default LoadArtist;

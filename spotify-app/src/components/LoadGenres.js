import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import Scrollbar from "react-scrollbars-custom";
import "../styles/login.css";
const LoadGenres = (props) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {
        // Effettua la chiamata al server solo una volta durante il montaggio iniziale
        axios.get(`https://spotify-server-kohl.vercel.app/genres?apikey=${apiKey}`)
            .then(response => {
                if (response.status === 200) {
                    setGenres(response.data);
                    setAllGenres(response.data);
                } else {
                    props.snackbar('Error fetching genres:'+ response.statusText,"error");
                    // Aggiungi qui il codice per gestire l'errore nella richiesta
                }
            })
            .catch(error => {
                props.snackbar('Error fetching genres:'+ error,"error");
                // Aggiungi qui il codice per gestire l'errore nella richiesta
            });
    }, []); // Array di dipendenze vuoto
    

    const handleGenreSelect = (genre) => {
        if (genre !== null && genre !== undefined) {
            if (!selectedGenres?.some(g => g.id === genre.id)) {
                setSelectedGenres(prevSelectedGenres => [...prevSelectedGenres, genre]);
            } else {
                setSelectedGenres(prevSelectedGenres =>
                    prevSelectedGenres.filter(g => g.id !== genre.id)
                );
            }
        }
    };

    const updateGenres = (query) => {
        if (query !== "") {
            let newList = [];
            for (let i in allGenres)
                if (allGenres[i].name.toLowerCase().includes(query.toLowerCase()))
                    newList.push(allGenres[i])
            setGenres(newList)
        } else {
            setGenres(allGenres)
        }

    }
    return (
        <Container>
            <div style={{ height: "20vh" }}>
                <Typography variant="h6" gutterBottom className='title'>
                    Benvenuto
                </Typography >
                <Typography className='title' paragraph>
                    Scegli i tuoi generi musicali preferiti per consigli più personalizzati!
                </Typography>
                <TextField
                    label="Cerca generi musicali"
                    fullWidth
                    className='input'
                    onChange={(event) => {
                        updateGenres(event.target.value)
                    }
                    } />
            </div>

            <h2 className='subtitle'>Generi Musicali</h2>
            <Scrollbar style={{ height: '30vh' }}>
                <Grid container justifyContent="space-around">
                    {genres?.map((genre) => (
                        <Grid xs={2} item >
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>

            <h2 className='subtitle'>Generi Musicali Selezionati</h2>
            <Scrollbar style={{ height: '25vh' }}>
                <Grid container justifyContent="space-around">
                    {selectedGenres?.map((genre) => (
                        <Grid xs={2} item >
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div className={selectedGenres.some(g => g.id === genre.id) ? 'selected-genre-item' : 'genre-item'}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Scrollbar>
            <div style={{ height: '10vh' }}>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => { props.setFavouriteGenres(selectedGenres); props.loadArtist() }}
                    className="button"
                >
                    Avanti
                </Button>
            </div>

        </Container>
    );
};

export default LoadGenres;

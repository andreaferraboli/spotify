import React, { useState, useEffect } from 'react';
import { TextField, Grid, Container, Typography, useThemeProps, Button } from '@mui/material';
import axios, { all } from 'axios';

const LoadGenres = (props) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);

    useEffect(() => {
        // Effettua la chiamata al server solo una volta durante il montaggio iniziale
        axios.get(`http://localhost:3100/genres`)
            .then(response => {
                setGenres(response.data);
                setAllGenres(response.data)
            })
            .catch(error => console.error(error));
    }, []); // Array di dipendenze vuoto

    const handleGenreSelect = (genre) => {
        if (genre != null && genre != undefined) {
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
        if (query != "") {
            let newList = [];
            for (let i in allGenres)
                if (allGenres[i].name.toLowerCase().includes(query.toLowerCase()))
                    newList.push(allGenres[i])
            setGenres(newList)
        }

    }
    return (
        <Container>
            <Typography variant="h6" gutterBottom>
                Benvenuto<br />
                Scegli i tuoi generi musicali preferiti per consigli più personalizzati!
            </Typography>
            <TextField
                label="Cerca generi musicali"
                fullWidth
                onChange={(event) =>{
                    updateGenres(event.target.value)}
                }  />
            <h2>Generi Musicali</h2>
            <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '30vh' }}>
                <Grid container justifyContent="space-around">
                    {genres?.map((genre) => (
                        <Grid xs={2} item key={genre.id}>
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div style={{ border: '1px solid gray', padding: '8px', borderRadius: '4px', backgroundColor: selectedGenres.some(g => g.id === genre.id) ? 'lightblue' : 'white' }}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>

            <h2>Generi Musicali Selezionati</h2>
            <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '30vh' }}>
                <Grid container justifyContent="space-around">
                    {selectedGenres?.map((genre) => (
                        <Grid xs={2} item key={genre.id}>
                            <div onClick={() => handleGenreSelect(genre)} style={{ cursor: 'pointer' }}>
                                <div style={{ border: '1px solid gray', padding: '8px', borderRadius: '4px', backgroundColor: selectedGenres.some(g => g.id === genre.id) ? 'lightblue' : 'white' }}>
                                    {genre.name}
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div style={{ height: '10vh' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={()=>{props.setFavouriteGenres(selectedGenres);props.loadArtist()}}
              className="button"
            >
              Avanti
            </Button>
            </div>

        </Container>
    );
};

export default LoadGenres;

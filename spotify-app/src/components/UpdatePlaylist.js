import React, { useState } from 'react';
import {
    TextField,
    Grid,
    IconButton,
    Button, // Aggiunto il componente Button
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Track from "./track";
import "../style/playlist.css";
import axios from 'axios'; // Assicurati di aver importato correttamente Axios

function UpdatePlaylist({ playlist }) {
    const [searchResults, setSearchResults] = useState([]);
    const [localPlaylist, setLocalPlaylist] = useState(playlist); // Inizializza con l'ID corretto della playlist
    const [searchValue, setSearchValue] = useState('');
    const handleSearch = async (query) => {
        try {
            if (query.trim() === '') {
                setSearchResults([]);
                return;
            }

            const response = await axios.get(`http://localhost:3100/searchTracks/${query}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching tracks:', error);
        }
    };
    const handleRemoveTrack = (trackId) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: prevPlaylist.tracks.filter((track) => track.id !== trackId),
        }));
    };

    const handleReorderTracks = (startIndex, endIndex) => {
        const newTracks = Array.from(playlist.tracks);
        const [movedTrack] = newTracks.splice(startIndex, 1);
        newTracks.splice(endIndex, 0, movedTrack);
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: newTracks,
        }));
    };
    // Funzione per spostare una traccia in alto nell'array
    const handleMoveTrackUp = (currentIndex) => {
        if (currentIndex > 0) {
            const updatedTracks = [...playlist.tracks];
            const temp = updatedTracks[currentIndex - 1];
            updatedTracks[currentIndex - 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            // Esegui qui l'aggiornamento dello stato o dell'array delle tracce nella playlist
        }
    };

    // Funzione per spostare una traccia in basso nell'array
    const handleMoveTrackDown = (currentIndex) => {
        if (currentIndex < playlist.tracks.length - 1) {
            const updatedTracks = [...playlist.tracks];
            const temp = updatedTracks[currentIndex + 1];
            updatedTracks[currentIndex + 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            // Esegui qui l'aggiornamento dello stato o dell'array delle tracce nella playlist
        }
    };
    const handleAddTrackToPlaylist = async (track) => {
        console.log("track",track)
        console.log("prevPlaylist prima dell'aggiunta:", localPlaylist);
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: [...prevPlaylist.tracks, track]
          }));
        setSearchValue('');
        setSearchResults([]);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put(`http://localhost:3100/playlist/${playlist.id}`, localPlaylist);
            console.log('Changes saved:', response.data);
            // Esegui qui l'azione per reindirizzare l'utente alla pagina della playlist
            // Ad esempio: history.push(`/playlist/${playlist.id}`);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };
    return (
        <div>
            <div style={{marginBottom:"4%",backgroundColor:"inherit"}}>
                <TextField
                label="Search Track"
                variant="outlined"
                fullWidth
                value={searchValue}
                onChange={(e) => {
        setSearchValue(e.target.value);
        handleSearch(e.target.value); // Chiama la funzione handleSearch con il nuovo valore
    }}
            /><Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Salva modifiche
        </Button>
            </div>
            
            {searchResults.length > 0 ? (
                <Grid container spacing={2}>
                    {searchResults.map((track) => (
                        <React.Fragment key={track.id}>
                            <Grid item xs={10}>
                                <div>
                                    <Track track={track} />
                                </div>
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton
                                    onClick={() => handleAddTrackToPlaylist(track)}
                                >
                                    <AddCircleOutline /> {/* Icona "Add" per aggiungere alla playlist */}
                                </IconButton>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2} className="top-tracks-section">
                    {localPlaylist?.tracks?.map((track, index) => (
                        <><Grid item xs={10}>
                            <div className="track-item">
                                <Track
                                    track={track}
                                    index={index + 1}
                                    onReorder={(startIndex, endIndex) => handleReorderTracks(startIndex, endIndex)} />
                            </div>
                        </Grid><Grid item xs={1} className="icon-section">
                                <DeleteIcon
                                    className="icon-button delete-icon"
                                    onClick={() => handleRemoveTrack(track.id)} />
                            </Grid><Grid item xs={1} className="icon-section">
                                {index !== 0 && (
                                    <KeyboardArrowUpIcon
                                        className="icon-button"
                                        onClick={() => handleMoveTrackUp(index)} />
                                )}
                                {index !== playlist.tracks.length - 1 && (
                                    <KeyboardArrowDownIcon
                                        className="icon-button"
                                        onClick={() => handleMoveTrackDown(index)} />
                                )}
                            </Grid></>
                    ))}
                </Grid>
            )}

        </div>
    );
}

export default UpdatePlaylist;

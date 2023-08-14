import React, { useState,useEffect } from 'react';
import {
    TextField,
    Grid,
    Button, Typography,
    Avatar,
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import Track from "./track";
import "../style/playlist.css";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import { formatDuration } from "../pages/Playlist"

function NewPlaylist({ user, onBack }) {
    const [searchResults, setSearchResults] = useState([]);
    const [localPlaylist, setLocalPlaylist] = useState({
        id: "",
        name: "",
        image: "https://is3-ssl.mzstatic.com/image/thumb/Purple116/v4/03/3f/2f/033f2ffa-2747-96c6-39f1-3b577fea0ba5/source/512x512bb.jpg", // Aggiungi altre proprietà della playlist se necessario
        tracks: [],
    });
    const [searchValue, setSearchValue] = useState('');
    const [playlistId, setPlaylistId] = useState('');

    useEffect(() => {
        async function fetchPlaylistId() {
            try {
                const id = await searchId();
                setPlaylistId(id);
                console.log(playlistId)
            } catch (error) {
                console.error('Error fetching new id:', error);
            }
        }
        fetchPlaylistId();
    }, []);

    async function searchId() {
        try {

            const response = await axios.get(`http://localhost:3100/newId`);
            console.log(response)
            return response.data.id;
        } catch (error) {
            console.error('Error found new id:', error);
        }
    }
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
    const handleMoveTrackUp = (currentIndex) => {
        if (currentIndex > 0) {
            const updatedTracks = [...localPlaylist.tracks];
            const temp = updatedTracks[currentIndex - 1];
            updatedTracks[currentIndex - 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            // Esegui qui l'aggiornamento dello stato o dell'array delle tracce nella playlist
        }
    };

    // Funzione per spostare una traccia in basso nell'array
    const handleMoveTrackDown = (currentIndex) => {
        if (currentIndex < localPlaylist.tracks.length - 1) {
            const updatedTracks = [...localPlaylist.tracks];
            const temp = updatedTracks[currentIndex + 1];
            updatedTracks[currentIndex + 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            // Esegui qui l'aggiornamento dello stato o dell'array delle tracce nella localPlaylist
        }
    };
    const handleRemoveTrack = (trackId) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: prevPlaylist.tracks.filter((track) => track.id !== trackId),
        }));
        console.log(generatePlaylistImage(localPlaylist.tracks));
    };
    const handleAddTrackToPlaylist = async (track) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: [...prevPlaylist.tracks, track]
        }));
        setSearchValue('');
        setSearchResults([]);
        console.log(generatePlaylistImage(localPlaylist));
    };

    const handleSavePlaylist = async () => {
        try {
            localPlaylist.id=playlistId
            const response = await axios.post(`http://localhost:3100/playlist`, {
                "playlist": localPlaylist,
                "userId": user._id
            });

            window.location.href="/playlist/"+playlistId;
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    };

    function generatePlaylistImage(playlist) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const imageSize = 300; // Dimensione dell'immagine (px)
        canvas.width = imageSize;
        canvas.height = imageSize;
      
        ctx.fillStyle = '#0f0'; // Colore di sfondo
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log(playlist)
        if (playlist.length > 0) {
          const imagesToUse = playlist.slice(0, 4); // Prendi fino a 4 immagini
      
          if (imagesToUse.length === 1) {
            const image = new Image();
            image.src = imagesToUse[0].image;
            console.log(image)
            image.onload = () => {
              ctx.drawImage(image, 0, 0, imageSize, imageSize);
            };
          } else {
            const quadrantSize = imageSize / 2;
            imagesToUse.forEach((song, index) => {
              if (index < 2) {
                const image = new Image();
                image.src = song.image;
                console.log(image)
                image.onload = () => {
                  ctx.drawImage(image, index * quadrantSize, 0, quadrantSize, quadrantSize);
                };
              } else {
                const image = new Image();
                image.src = song.image;
                console.log(image)
                image.onload = () => {
                  ctx.drawImage(image, (index - 2) * quadrantSize, quadrantSize, quadrantSize, quadrantSize);
                };
              }
            });
          }
        }
      
        return canvas.toDataURL(); // Restituisci l'immagine come data URL
      }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img src={localPlaylist?.image} alt="Playlist" className="playlist-image" />
                </Grid>
                <Grid item xs={12} sm={9} className="info-section">
                    <div className="playlist-info-container">
                        <Typography variant="body1">Playlist</Typography>
                    </div>
                    <div className="playlist-info-container">
                        <TextField
                            label="Titolo della Playlist"
                            variant="outlined"
                            fullWidth
                            className='input-new-playlist'
                            value={localPlaylist?.name}
                            onChange={(e) => setLocalPlaylist({ ...localPlaylist, name: e.target.value })}
                        />
                    </div>
                    <div className="playlist-info-container">
                        <Avatar
                            src={user.image}
                            alt={user.profile_name}
                            style={{ marginRight: "10px" }}
                        />
                        <div>
                            <Typography variant="body1">
                                {user.profile_name} - {localPlaylist?.tracks.length} brani, circa{" "}
                                {formatDuration(
                                    localPlaylist?.tracks.reduce(
                                        (total, song) => total + song.duration,
                                        0
                                    )
                                )}
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <div>
                <div style={{ marginBottom: "4%", backgroundColor: "inherit" }}>
                    <TextField
                        label="Search Track"
                        variant="outlined"
                        fullWidth
                        className='input-playlist'
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            handleSearch(e.target.value);
                        }} />
                    <Button className='save-changes' variant="contained" color="primary" onClick={handleSavePlaylist}>
                        Salva playlist
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAddTrackToPlaylist(track)}
                                        startIcon={<AddCircleOutline />}
                                    >
                                        Aggiungi
                                    </Button>
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
                                        index={index + 1} />
                                </div>
                            </Grid>
                                <Grid item xs={1} className="icon-section">
                                    <DeleteIcon
                                        className="icon-button delete-icon"
                                        onClick={() => handleRemoveTrack(track.id)} />
                                </Grid>
                                <Grid item xs={1} className="icon-section">
                                    {index !== 0 && (
                                        <KeyboardArrowUpIcon
                                            className="icon-button"
                                            onClick={() => handleMoveTrackUp(index)} />
                                    )}
                                    {index !== localPlaylist.tracks.length - 1 && (
                                        <KeyboardArrowDownIcon
                                            className="icon-button"
                                            onClick={() => handleMoveTrackDown(index)} />
                                    )}
                                </Grid>
                            </>
                        ))}
                    </Grid>
                )}

                {/* Qui puoi aggiungere la visualizzazione della lista di tracce nella nuova playlist */}

                <button onClick={onBack}>Torna alla Home</button>
            </div></>
    );
}

export default NewPlaylist;

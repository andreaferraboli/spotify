import React, { useState, useEffect } from 'react';
import {
    TextField,
    Grid,
    IconButton,
    Button
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Track from "./track";
import "../style/playlist.css";
import axios from 'axios'; // Assicurati di aver importato correttamente Axios

function UpdatePlaylist({ playlist, user, snackbar }) {
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

    useEffect(() => {
        createImageCollage(localPlaylist.tracks.map((track) => track.image));
    }, [localPlaylist.tracks]);
    // Funzione per spostare una traccia in alto nell'array
    const handleMoveTrackUp = (currentIndex) => {
        if (currentIndex > 0) {
            const updatedTracks = [...localPlaylist.tracks];
            const temp = updatedTracks[currentIndex - 1];
            updatedTracks[currentIndex - 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            setLocalPlaylist((prevPlaylist) => ({
                ...prevPlaylist,
                tracks: updatedTracks,
            }));
        }
    };

    const handleMoveTrackDown = (currentIndex) => {
        if (currentIndex < localPlaylist.tracks.length - 1) {
            const updatedTracks = [...localPlaylist.tracks];
            const temp = updatedTracks[currentIndex + 1];
            updatedTracks[currentIndex + 1] = updatedTracks[currentIndex];
            updatedTracks[currentIndex] = temp;
            setLocalPlaylist((prevPlaylist) => ({
                ...prevPlaylist,
                tracks: updatedTracks,
            }));
        }
    };
    const handleAddTrackToPlaylist = async (track) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: [...prevPlaylist.tracks, track]
        }));
        setSearchValue('');
        setSearchResults([]);
    };

    const handleSaveChanges = async () => {
        try {
            let response = await axios.post("http://localhost:3100/upload", {
                dataUrl: document.getElementById("playlist_image").src,
                id: localPlaylist.id
            })
            localPlaylist.image = response.data.imageUrl
            response = await axios.put(`http://localhost:3100/playlist/${playlist.id}`, localPlaylist);
            if(response.status===200){
                snackbar(response.data.message,"success")
                window.location.href = "/playlist/" + localPlaylist.id;
            }else{
                snackbar(response.data.message,"error")
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };
    function createImageCollage(imageUrls) {
        if (imageUrls.length !== 0) {
            const uniqueImageUrls = [...new Set(imageUrls)];

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const collageSize = 400; // Dimensione del collage (px)
            canvas.width = collageSize;
            canvas.height = collageSize;

            const imagesToUse = uniqueImageUrls.length > 3 ? uniqueImageUrls.slice(0, 4) : uniqueImageUrls.slice(0, 1); // Prendi fino a 4 immagini
            console.log("imageTouse", imagesToUse)
            const quadrantSize = imagesToUse.length === 1 ? collageSize : collageSize / 2;

            const imagesLoaded = [];
            let imagesToLoad = imagesToUse.length < 4 ? 1 : 4;

            imagesToUse.forEach((imageUrl, index) => {
                const image = new Image();
                image.crossOrigin = 'Anonymous'; // Enable CORS for cross-origin images
                image.src = imageUrl;
                let dataURL;
                image.onload = () => {
                    if (imagesToUse.length === 4) {
                        imagesLoaded[index] = image;
                        imagesToLoad--;

                        if (imagesToLoad === 0) {
                            imagesLoaded.forEach((img, imgIndex) => {
                                const row = Math.floor(imgIndex / 2);
                                const col = imgIndex % 2;
                                const offsetX = col * quadrantSize;
                                const offsetY = row * quadrantSize;
                                ctx.drawImage(img, offsetX, offsetY, quadrantSize, quadrantSize);
                            });
                            dataURL = canvas.toDataURL('image/png');
                            document.getElementById("playlist_image").src = dataURL; // Append the collage image to the document
                        }

                    }
                    else {
                        ctx.drawImage(image, 0, 0, quadrantSize, quadrantSize);
                        dataURL = canvas.toDataURL('image/png');


                        document.getElementById("playlist_image").src = dataURL;
                    }
                };
            });
        } else {
            document.getElementById("playlist_image").src = "https://is3-ssl.mzstatic.com/image/thumb/Purple116/v4/03/3f/2f/033f2ffa-2747-96c6-39f1-3b577fea0ba5/source/512x512bb.jpg"
        }
        // Remove duplicate image URLs

    }
    return (
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
                        handleSearch(e.target.value); // Chiama la funzione handleSearch con il nuovo valore
                    }}
                />
                <Button className='save-changes' variant="contained" color="primary" onClick={handleSaveChanges}>
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
                            <Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Button
                                    variant="contained"
                                    className='add-button'
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
                        <>
                            <Grid item xs={10}>
                                <div className="track-item">
                                    <Track
                                        userPlaylists={user.my_playlists}
                                        track={track}
                                        index={index + 1} />
                                </div>
                            </Grid>
                            <Grid style={{ display: "flex", margin: "auto", alignItems: "center", justifyContent: "center" }} item xs={1} className="icon-section">
                                <DeleteIcon
                                    className="icon-button delete-icon"
                                    onClick={() => handleRemoveTrack(track.id)} />
                            </Grid>
                            <Grid style={{ display: "flex", alignItems: "center", justifyContent: "center" }} item xs={1} className="icon-section">
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
                            </Grid>
                        </>
                    ))}
                </Grid>
            )}

        </div>
    );
}

export default UpdatePlaylist;

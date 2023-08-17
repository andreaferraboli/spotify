import React, { useState, useEffect } from 'react';
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
        image: "", // Aggiungi altre proprietà della playlist se necessario
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
    useEffect(() => {
        createImageCollage(localPlaylist.tracks.map((track) => track.image));
    }, [localPlaylist.tracks]);
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
    const handleRemoveTrack = (trackId) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: prevPlaylist.tracks.filter((track) => track.id !== trackId),
        }));
    };
    const handleAddTrackToPlaylist = (track) => {
        setLocalPlaylist((prevPlaylist) => ({
            ...prevPlaylist,
            tracks: [...prevPlaylist.tracks, track]
        }));
        setSearchValue('');
        setSearchResults([]);
    };

    const handleSavePlaylist = async () => {
        try {
           
            let response=await axios.post("http://localhost:3100/upload",{
                "id":playlistId
            } )
            console.log(response,"res")
            localPlaylist.id = playlistId
            // localPlaylist.image = response.data.imageUrl
            response = await axios.post(`http://localhost:3100/playlist`, {
                "playlist": localPlaylist,
                "userId": user._id
            });
            window.location.href = "/playlist/" + playlistId;
        } catch (error) {
            console.error('Error saving playlist:', error);
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
    const base64ToBlob = (dataurl) => {
          const arr = dataurl.split(',');
          const mime = arr[0].match(/:(.*?);/)[1]
          const sliceSize = 1024;
          const byteChars = window.atob(arr[1]);
          const byteArrays = [];
    
          for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            let slice = byteChars.slice(offset, offset + sliceSize);
    
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
    
            byteArrays.push(byteArray);
          }
    
          return new Blob(byteArrays, {type: mime});
        }
        const getFilename = (dataUrl) => {
          const arr = dataUrl.split(',');
          const mime = arr[0].match(/:(.*?);/)[1];
    
          return Math.round(+new Date()/1000) + '.' + mime.split('/').pop();
        }
    function getExportFile (dataUrl) {
        const blob = base64ToBlob(dataUrl);
        blob.name = getFilename(dataUrl);
    
        // generate file from base64 string
        return blob;
      }
    function convertDataURLToBlob(dataURL) {
        const byteString = atob(dataURL.split(',')[1]); // Rimuovi il prefisso "data:image/png;base64,"
        const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]; // Ottieni il tipo MIME dell'immagine
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ab], { type: mimeString });
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img id='playlist_image' src={localPlaylist?.image} alt="Playlist" className="playlist-image" />
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

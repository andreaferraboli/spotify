import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Grid, Menu, MenuItem, Typography} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import axios from 'axios';
import "../styles/track.css";

const Track = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(new Audio(props.track.preview_url));

    const navigate = useNavigate();

    const toggleAudio = () => {
        if (!props.track.preview_url) {
            props.snackbar("Anteprima canzone non disponibile", "warning");
            return;
        }

        if (props.currentPlayingIndex === props.index) {
            // Se la traccia corrente è già in riproduzione, interrompi la riproduzione
            props.currentAudioElement?.pause();
            setIsPlaying(false);
            props.setCurrentPlayingIndex(null); // Aggiorna l'indice corrente a null
            props.setCurrentAudioElement(null); // Imposta l'elemento audio corrente a null
        } else {
            // Se c'è un'altra traccia in riproduzione, interrompi la riproduzione
            if (props.currentAudioElement) {
                props.currentAudioElement?.pause();
            }

            // Avvia la nuova traccia
            audioElement.play();
            setIsPlaying(true);
            props.setCurrentPlayingIndex(props.index); // Imposta l'indice corrente
            props.setCurrentAudioElement(audioElement); // Imposta l'elemento audio corrente
        }
    };
    useEffect(() => {
        // Quando il componente viene smontato, imposta l'elemento audio corrente a null
        return () => {
            if (props.currentAudioElement) {
                props.currentAudioElement?.pause();
            }
            props.setCurrentAudioElement(null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setAudioElement(new Audio(props.track.preview_url));
    }, [props.track.preview_url]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const searchTrack = (id_track) => {
        navigate("/searchTrack/" + id_track)
    };

    const handlePlaylistSelect = (playlistId, type) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        axios.post(`http://localhost:3100/playlists/${playlistId}/add-track?apikey=${apiKey}`, {
            trackData: props.track,
            type: type,
            "apikey": apiKey
        })
            .then(response => {
                props.snackbar(response.data.message, "success");
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    props.snackbar('Traccia già presente', "error");
                } else {
                    props.snackbar('Errore durante l\'aggiunta della traccia alla playlist', "error");
                }
            });
        handleMenuClose();
    };

    return (
        <>
            <Grid container spacing={1}
                  style={{margin: 0, display: "flex", alignItems: "center", justifyContent: "center"}}
                  className="track">
                <Grid item xs={1} sm={1} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <Typography variant="body1">{props.index}</Typography>
                </Grid>
                <Grid xs={1} sm={1} item className="image-container-wrapper" onClick={toggleAudio}>
                    <div
                        className={`image-container ${isPlaying && props.currentPlayingIndex === props.index ? 'playing' : ''}`}
                        style={{backgroundImage: `url(${props.track.image})`}}>
                        {(isPlaying && props.currentPlayingIndex === props.index) ? (
                            <div className="play-icon-div">
                                {isPlaying ? (
                                    <PauseCircleOutlineIcon className="play-icon"/>
                                ) : (
                                    <PlayCircleOutlineIcon className="play-icon"/>
                                )}
                            </div>
                        ) : null}
                    </div>
                </Grid>
                <Grid style={{paddingLeft: "3%"}} xs={7} sm={7}>
                    <div className="div-info">
                        <Typography className="song-title">
                            <span key={props.track.id}>
                                <Link to={`/track/${props.track.id}`}>{props.track.name}</Link>
                            </span>
                        </Typography>
                        <Typography className="song-artists">
                            {props.track.artists.map((artist, index) => (
                                <span key={artist.id}>
                                    <Link to={`/artist/${artist.id}`}>{artist.name}</Link>
                                    {index !== props.track.artists.length - 1 && ", "}
                                </span>
                            ))}
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={1} sm={1}>
                    <Typography variant="body2">{formatDuration(props.track.duration)}</Typography>
                </Grid>
                <Grid item xs={1} sm={1}>
                    <Typography variant="body2">{props.track.year}</Typography>
                </Grid>
                <Grid item xs={1} sm={1}>
                    <MoreVertIcon onClick={handleMenuOpen}/>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <div className="custom-menu">
                            <MenuItem className="menu-heading " onClick={() => searchTrack(props.track.id)}>Cerca nelle
                                playlist</MenuItem>
                            <MenuItem disabled className="menu-heading ">Aggiungi alla playlist:</MenuItem>
                            {props.userPlaylists?.map((playlist) => (
                                <MenuItem className="menu-heading " key={playlist?.id}
                                          onClick={() => handlePlaylistSelect(playlist?.id, playlist?.collaborative !== undefined ? "public" : "private")}>
                                    {playlist?.name}
                                </MenuItem>
                            ))}
                        </div>
                    </Menu>
                </Grid>
            </Grid>
        </>
    );
};

export default Track;

export const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

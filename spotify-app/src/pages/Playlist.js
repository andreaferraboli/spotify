import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Track from "../components/track";
import { Avatar, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { AddCircleOutline } from '@mui/icons-material';
import Scrollbar from "react-scrollbars-custom";
import DeleteIcon from '@mui/icons-material/Delete';
import io from 'socket.io-client';
import EditIcon from '@mui/icons-material/Edit';
import UpdatePlaylist from '../components/UpdatePlaylist';
import axios from 'axios';

import "../styles/playlist.css";

export function formatDuration(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    if (hours === 0) {
        return `${minutes} minuti`;
    }

    return `${hours} ore e ${minutes} minuti`;
}

const Playlist = ({ user, snackbar }) => {
    const { playlistId } = useParams();
    const [playlist, setPlaylist] = useState();
    const [editing, setEditing] = useState(false);
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
    const [currentAudioElement, setCurrentAudioElement] = useState(null);
    const apiKey = process.env.REACT_APP_API_KEY;

    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await axios.get(`http://localhost:3100/playlist/${playlistId}?apikey=${apiKey}&idUser=${user._id}`);
                if (response.status === 200) {
                    setPlaylist(response.data);
                } else {
                    if (response.status === 404)
                        snackbar(response.data, "error");
                    else
                        snackbar("Errore nella richiesta", "error");

                }
            } catch (error) {
                if (error.request.status === 404) {
                    snackbar(error.response.data, "error");
                    navigate("/")
                }
                else
                    snackbar("Errore durante la richiesta:" + error, "error");
            }
        };
        fetchPlaylist();
    }, [playlistId, apiKey, snackbar, navigate, user._id]);

    useEffect(() => {
        const socket = io('http://localhost:3100'); // Assicurati di utilizzare l'indirizzo corretto del tuo server

        socket.on('connect', () => {
            console.log('Connesso al server WebSocket');
        });

        socket.on('playlistUpdated', (data) => {
            // Verifica se l'ID della playlist aggiornata è quello della pagina visualizzata
            if (data.playlistId === playlistId) {
                window.location.reload()
            }
        });

        socket.on('playlistDeleted', (data) => {
            // Verifica se l'ID della playlist eliminata è quello della pagina visualizzata
            if (data.playlistId === playlistId) {
                navigate("/")
                // Esegui l'azione di navigazione appropriata, ad esempio, usando React Router
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnesso dal server WebSocket');
        });

        return () => {
            socket.disconnect();
        };
    }, [playlistId, navigate]);

    const handleEditPlaylist = () => {
        setEditing(true);
    };

    const handleEditName = () => {
        const newName = prompt("Inserisci il nuovo nome della playlist:");
        if (newName) {
            setPlaylist((prevPlaylist) => ({ ...prevPlaylist, name: newName }));
            updatePlaylistOnServer(newName, playlist.description);
        }
    };

    const handleDescriptionName = () => {
        const newDescription = prompt("Inserisci la nuova descrizione della playlist:");
        if (newDescription) {
            setPlaylist((prevPlaylist) => ({ ...prevPlaylist, description: newDescription }));
            updatePlaylistOnServer(playlist.name, newDescription);
        }
    };
    const updatePlaylistOnServer = (newName, newDescription) => {
        axios.put(`http://localhost:3100/updatePlaylist?apikey=${apiKey}`, {
            name: newName,
            description: newDescription,
            playlistId: playlistId
        })
            .then(response => {
                // Handle success response from the server
                if (response.status === 200) {
                    snackbar(response.data.message, "success");
                    window.location.reload(true);
                } else {
                    snackbar("Errore nell'aggiornamento della playlist", "error");
                }
            })
            .catch(error => {
                // Handle error
                snackbar('Errore durante l\'aggiornamento della playlist', "error");
            });
    };


    const handleDeletePlaylist = async () => {
        try {
            const response = await axios.delete(`http://localhost:3100/playlist/${playlist.id}?apikey=${apiKey}`);

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                navigate("/");
                window.location.reload(true);
            } else {
                snackbar("Errore nell'eliminazione della playlist", "error");
                navigate("/")

            }
        } catch (error) {
            snackbar("Errore durante l'eliminazione della playlist: " + error.message, "error");
        }
    };

    async function publishPlaylist() {
        const url = `http://localhost:3100/movePlaylist/${playlist.id}?apikey=${apiKey}`;
        const requestData = { user_id: user._id, image: user.image, profile_name: user.profile_name, type: 'private' };

        try {
            const response = await axios.put(url, requestData);
            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload(true);
            } else {
                snackbar("Errore nel pubblicare la playlist", "error");
            }
        } catch (error) {
            snackbar("Errore durante la pubblicazione della playlist: " + error.message, "error");
        }
    }

    async function makePlaylistPrivate(playlist) {
        const url = `http://localhost:3100/movePlaylist/${playlist.id}?apikey=${apiKey}`;
        const requestData = { user_id: user._id, type: 'public' };

        try {
            const response = await axios.put(url, requestData);
            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload(true);
            } else {
                snackbar("Errore nel rendere la playlist privata", "error");
            }
        } catch (error) {
            snackbar("Errore durante il rendere la playlist privata: " + error.message, "error");
        }
    }

    const handleSetCollaborative = async (collaborative) => {
        try {
            const response = await axios.put(`http://localhost:3100/setCollaborative/${playlistId}?apikey=${apiKey}`, { "collaborative": collaborative });

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload(true);
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            snackbar("Errore durante l'impostazione della playlist come collaborativa:" + error.message, "error");
        }
    };

    async function changeFollow(playlistId, userId, action) {
        try {
            const response = await axios.put(`http://localhost:3100/updatePlaylistFollowers/${playlistId}/${userId}?action=${action}&apikey=${apiKey}`);

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload(true);
            } else {
                snackbar(response.data.message, "error");
            }
        } catch (error) {
            snackbar(error.message, "error");
        }
    }


    const changeTag = async (playlistId, tag, action) => {
        try {
            const response = await axios.post(`http://localhost:3100/changeTag?apikey=${apiKey}`, {
                playlistId: playlistId,
                tag: tag,
                action: action,
            });

            if (response.status === 200) {
                snackbar(response.data.message, "success");
                window.location.reload(true);
            } else {
                snackbar("Errore durante l'operazione", "error");
            }
        } catch (error) {
            snackbar(error, "error");
        }
    };

    const handleAddTag = () => {
        setIsAddingTag(true);
    };

    const handleConfirmAddTag = () => {
        if (newTag.trim() !== '') {
            addTag(newTag);
        }
    };
    const cancelAddTag = () => {
        setIsAddingTag(false);
        setNewTag('');
    };
    const addTag = async () => {
        if (newTag.trim() !== '') {
            try {
                await changeTag(playlist.id, newTag, 'add');
                setIsAddingTag(false);
                setNewTag('');
                // Aggiorna lo stato della playlist per riflettere i cambiamenti
            } catch (error) {
                snackbar('Error adding tag:', error);
            }
        }
    };

    const removeTag = async (tag) => {
        try {
            await changeTag(playlist.id, tag, 'remove');
            // Aggiorna lo stato della playlist per riflettere i cambiamenti
        } catch (error) {
            snackbar('Error removing tag:', error);
        }
    };
    return (
        <>
            <Grid container style={{ margin: 0 }} spacing={1}>
                <Grid item xs={12} sm={3}>
                    <img id="playlist_image" src={playlist?.image} alt="Playlist" className="playlist-image" />
                </Grid>
                <Grid item xs={12} sm={9} className="info-section">
                    <div className="playlist-info-container vh20">
                        <Typography
                            variant="body1">{playlist?.type === "private" ? "Playlist" : "Playlist Pubblica"}</Typography>
                    </div>
                    <div className="playlist-info-container vh30">
                        <Typography className="playlist-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {playlist?.name}


                        </Typography>


                        {playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
                            <IconButton onClick={handleEditName}>
                                <EditIcon className="icon-button" />
                            </IconButton>
                        ) : null}
                        {playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
                            <IconButton onClick={handleDeletePlaylist}>
                                <DeleteIcon className="icon-button" />
                            </IconButton>
                        ) : null}


                    </div>
                    <div className="playlist-info-container vh10">
                        <Typography variant="body3">
                            {"descrizione: " + playlist?.description}
                        </Typography>
                        {playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
                            <IconButton onClick={handleDescriptionName}>
                                <EditIcon className="icon-button-small" />
                            </IconButton>
                        ) : null}
                    </div>
                    <div className="playlist-info-container vh20">
                        <Scrollbar variant="h3">
                            {playlist?.tags?.map((item) => (
                                playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id) ? (
                                    <Button
                                        key={item}
                                        variant="outlined"
                                        className="info-admin-button"
                                        onClick={() => removeTag(item)}
                                    >
                                        {"#" + item}
                                    </Button>
                                ) : (
                                    <Button
                                        key={item}
                                        variant="outlined"
                                        className="info-button"
                                    >
                                        {"#" + item}
                                    </Button>
                                )
                            ))}

                            {isAddingTag ? (
                                <div className="tag-input">
                                    <TextField
                                        variant="outlined"
                                        value={newTag}
                                        className="input-add-tags"
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleConfirmAddTag();
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        className="add-button"
                                        onClick={handleConfirmAddTag}
                                    >
                                        Aggiungi
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        className="edit-button"
                                        onClick={cancelAddTag}
                                    >
                                        Annulla
                                    </Button>
                                </div>
                            ) : (
                                (playlist?.type === "private" || (playlist?.type === "public" && playlist.owner.id === user._id)) && (
                                    <Button
                                        variant="outlined"
                                        className="add-button"
                                        onClick={handleAddTag}
                                    >
                                        <AddCircleOutline />
                                    </Button>
                                )
                            )}
                        </Scrollbar>
                    </div>

                    <div className="playlist-info-container vh20">
                        {playlist?.type === "private" ? (
                            <Avatar
                                src={user.image}
                                alt={user.profile_name}
                                style={{ marginRight: "10px" }}
                            />
                        ) : (
                            <Avatar
                                src={playlist?.owner.image}
                                alt={playlist?.owner.profile_name}
                                style={{ marginRight: "10px" }}
                            />
                        )}

                        <div>
                            <Typography variant="body1">
                                {playlist?.type === 'public' ? (
                                    <>
                                        <Link to={`/user/${playlist?.owner.id}`}>
                                            {playlist?.owner.profile_name}
                                        </Link>
                                        {" • " + playlist?.followers.length + " followers"}
                                    </>
                                ) : (
                                    <Link to={`/user/${user._id}`}>
                                        {user.profile_name}
                                    </Link>
                                )}{" "}
                                • {playlist?.tracks.length} brani, circa{" "}
                                {formatDuration(
                                    playlist?.tracks.reduce((total, song) => total + song.duration, 0)
                                )}
                            </Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <div>
                <Grid style={{ justifyContent: "flex-start", display: "flex" }} xs={12}>
                    <Typography variant="h4" className="title-section">
                        Tracks
                    </Typography>
                    {!editing && (
                        <>
                            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                                {user._id !== undefined && (playlist?.type === "private" || (playlist?.type === "public" && (playlist.collaborative === true || playlist.owner.id === user._id))) ? (
                                    <Button
                                        variant="outlined"
                                        className="edit-button"
                                        onClick={() => handleEditPlaylist()}
                                    >
                                        Modifica
                                    </Button>
                                ) : null}

                            </div>
                            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                                {playlist?.type === "private" ? (
                                    <Button
                                        variant="outlined"
                                        className="edit-button"
                                        onClick={() => publishPlaylist(playlist.id, user._id)}
                                    >
                                        Pubblica Playlist
                                    </Button>
                                ) : (
                                    playlist?.owner.id === user._id && (
                                        <Button
                                            variant="outlined"
                                            className="edit-button"
                                            onClick={() => makePlaylistPrivate(playlist)}
                                        >
                                            Rendi Playlist Privata
                                        </Button>
                                    )
                                )}

                            </div>
                            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                                {playlist?.type === "public" && (playlist?.followers.includes(user._id) && playlist?.owner.id !== user._id) ? (
                                    <Button
                                        variant="outlined"
                                        className="delete-button"
                                        onClick={() => changeFollow(playlist.id, user._id, "remove")}
                                    >
                                        Smetti di seguire
                                    </Button>
                                ) : (
                                    playlist?.type === "public" && (user._id !== undefined) && (Object.keys(user).length !== 0) && (!playlist?.followers.includes(user._id) && playlist?.owner.id !== user._id) && (
                                        <Button
                                            variant="outlined"
                                            className="add-button"
                                            onClick={() => changeFollow(playlist.id, user._id, "add")}
                                        >
                                            Segui Playlist
                                        </Button>
                                    )
                                )}

                            </div>
                            <div style={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
                                {(playlist?.type === "public" && playlist.collaborative === false && playlist.owner.id === user._id) ? (
                                    <Button
                                        variant="outlined"
                                        className="edit-button"
                                        onClick={() => handleSetCollaborative(true)}
                                    >
                                        Rendi Collaborativa
                                    </Button>
                                ) : (
                                    (playlist?.type === "public" && playlist.collaborative === true && playlist.owner.id === user._id) && (
                                        <Button
                                            variant="outlined"
                                            className="edit-button"
                                            onClick={() => handleSetCollaborative(false)}
                                        >
                                            Rendi Non Collaborativa
                                        </Button>
                                    )
                                )}
                            </div>
                        </>

                    )}
                </Grid>
                {editing ? (
                    <UpdatePlaylist user={user} playlist={playlist} snackbar={snackbar}
                        onClose={() => setEditing(false)} />
                ) : (
                    <div className="top-tracks-section">
                        <Grid container spacing={2}>
                            {playlist?.tracks.map((track, index) => (
                                <Track key={track.id} userPlaylists={user.my_playlists?.concat(user.playlists)} currentAudioElement={currentAudioElement}
                                    setCurrentAudioElement={setCurrentAudioElement}
                                    track={track} currentPlayingIndex={currentPlayingIndex} setCurrentPlayingIndex={setCurrentPlayingIndex} index={index + 1} snackbar={snackbar}></Track>

                            ))}
                        </Grid>
                    </div>
                )}

            </div>

        </>
    );
};

export default Playlist;
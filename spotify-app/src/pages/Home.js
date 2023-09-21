import React, {useEffect, useState} from 'react';
import axios from 'axios';
import PlaylistCard from "../components/PlaylistCard"
import ArtistCard from "../components/ArtistCard"
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import io from 'socket.io-client';
import {responsive, responsiveArtist} from "./Search"
import "../styles/home.css";

const Home = (props) => {
    const [public_playlists, setPublicPlaylists] = useState([])
    const [followed_playlists, setFollowedPlaylists] = useState([])
    const [your_public_playlists, setYourPublicPlaylists] = useState([])

    useEffect(() => {
        // Chiamata alla funzione che ottiene le playlist correlate
        GetRelatedPlaylists(props.user._id);
    }, [props.user._id]);
    useEffect(() => {
        const socket = io('http://localhost:3100'); // Assicurati di utilizzare l'indirizzo corretto del tuo server

        socket.on('connect', () => {
            console.log('Connesso al server WebSocket');
        });

        socket.on('playlistRemovedHome', (data) => {
             console.log("Ricevuta notifica di eliminazione della playlist");
            // Verifica se l'ID della playlist aggiornata è quello della pagina visualizzata
            const isPresenteInPublic = public_playlists.some(playlist => playlist.id === data.playlistId);
            const isPresenteInFollowed = followed_playlists.some(playlist => playlist.id === data.playlistId);
            if (isPresenteInPublic || isPresenteInFollowed) {
                window.location.reload()
            }
        });
        socket.on('playlistAddedHome', (data) => {
                window.location.reload()
        });

        socket.on('playlistDeleted', (data) => {
            // Verifica se l'ID della playlist eliminata è quello della pagina visualizzata
            const isPresenteInPublic = public_playlists?.some(playlist => playlist.id === data.playlistId);
            const isPresenteInFollowed = followed_playlists?.some(playlist => playlist.id === data.playlistId);
            if (isPresenteInPublic || isPresenteInFollowed) {
                window.location.reload()
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnesso dal server WebSocket');
        });

        return () => {
            socket.disconnect();
        };
    }, [public_playlists,followed_playlists]);

    const GetRelatedPlaylists = async (userId) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        try {
            const response = await axios.get(`http://localhost:3100/relatedPlaylists/${userId}?apikey=${apiKey}`);
            if (response.status === 200) {
                const data = response.data;
                setFollowedPlaylists(data.followed_playlists || []);
                setPublicPlaylists(data.public_playlists.filter(item => (item.owner.id !== userId && !data.followed_playlists.some(followed=> followed.id===item.id))) || []);
                setYourPublicPlaylists(data.your_public_playlists || []);
            } else {
                props.snackbar('Error fetching related playlists', "error");
            }
        } catch (error) {
            props.snackbar('Error fetching related playlists', "error");
        }
    };

    return (
        <>


            {props.user?.my_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Le mie PLAYLIST</h2>
                    <Carousel showDots={false}
                              arrows={true}
                              infinite={false} itemClass="carousel-item-playlist" containerClass="carousel-container"
                              responsive={responsive}>
                        {props.user.my_playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} owner={props.user.profile_name}
                                          selectedPlaylistId={props.onPlaylistClick}/>
                        ))}
                    </Carousel>
                </div>
            )}

            {/* Aggiungi la sezione delle playlist pubbliche */}
            {public_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist pubbliche</h2>
                    <Carousel showDots={true} itemClass="carousel-item-playlist" containerClass="carousel-container"
                              responsive={responsive}>
                        {public_playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} owner={playlist.owner.profile_name}
                                          selectedPlaylistId={props.onPlaylistClick}/>
                        ))}
                    </Carousel>
                </div>
            )}

            {/* Aggiungi la sezione delle playlist seguite */}
            {followed_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist che segui</h2>
                    <Carousel showDots={true} centerMode={false} itemClass="carousel-item-playlist"
                              containerClass="carousel-container" responsive={responsive}>
                        {followed_playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} owner={playlist.owner.profile_name}
                                          selectedPlaylistId={props.onPlaylistClick}/>
                        ))}
                    </Carousel>
                </div>
            )}

            {/* Aggiungi la sezione delle playlist pubbliche create da te */}
            {your_public_playlists?.length > 0 && (
                <div className='home-section'>
                    <h2>Playlist pubbliche create da te</h2>
                    <Carousel showDots={true} centerMode={false} itemClass="carousel-item-playlist"
                              containerClass="carousel-container" responsive={responsive}>
                        {your_public_playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} owner={props.user.profile_name}
                                          selectedPlaylistId={props.onPlaylistClick}/>
                        ))}
                    </Carousel>
                </div>
            )}

            {props.user?.favourite_artists?.length > 0 && (
                <div className='home-section'>
                    <h2>I miei ARTISTI</h2>
                    <Carousel showDots={true} centerMode={false} itemClass="carousel-item"
                              containerClass="carousel-container" responsive={responsiveArtist}>
                        {props.user.favourite_artists.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} selectedArtistId={props.onArtistClick}/>
                        ))}
                    </Carousel>
                </div>
            )}
        </>
    );
};

export default Home;

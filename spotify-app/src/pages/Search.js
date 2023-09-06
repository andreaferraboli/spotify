import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import Track from '../components/track';
import PlaylistCard from '../components/PlaylistCard';
import ArtistCard from '../components/ArtistCard';
import UserCard from '../components/UserCard';
import Album from '../components/Album';
import Scrollbar from "react-scrollbars-custom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../styles/search.css";

export const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 6,
        slidesToSlide: 2
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 4,
        slidesToSlide: 4 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};
export const responsiveArtist = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 8,
        slidesToSlide: 3
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 6,
        slidesToSlide: 2 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.
    }
};

export default function SearchResults({user, snackbar}) {
    const {query} = useParams(); // Preleva la query dall'URL
    const [searchResults, setSearchResults] = useState(null);

    const apiKey = process.env.REACT_APP_API_KEY;

    useEffect(() => {

        // Invia la richiesta al server con l'API key nell'URL come query parameter
        axios.get(`https://spotify-server-kohl.vercel.app/search/${query}?id=${user._id}&apikey=${apiKey}`)
            .then(response => {
                setSearchResults(response.data); // Imposta i risultati della ricerca
            })
            .catch(error => {
                snackbar('Error fetching search results:' + error, "error");
            });
    }, [query, apiKey, snackbar]);

    return (
        <div>
            {searchResults && (
                <div>
                    {/* Sezione Brani */}
                    {searchResults.tracks && searchResults.tracks.length > 0 && (
                        <h2>Brani</h2>
                    )}
                    <div style={{height: '50vh'}}>
                        <Scrollbar>
                            {searchResults.tracks?.map((track, index) => (
                                <Track track={track} index={index + 1}/>
                            ))}
                        </Scrollbar>
                    </div>

                    {/* Sezione Album */}
                    {searchResults.albums && searchResults.albums.length > 0 && (
                        <>
                            <h2>Album</h2>
                            <Carousel showDots={true} itemClass="carousel-item-album"
                                      containerClass="carousel-container" responsive={responsive}>

                                {searchResults.albums?.map(album => (
                                    <Link key={album.id} to={`/album/${album.id}`}>
                                        <Album album={album}/>
                                    </Link>
                                ))}
                            </Carousel></>
                    )}

                    {/* Sezione Playlist */}
                    {searchResults?.playlists && searchResults.playlists?.length > 0 && (
                        <>
                            <h2>Playlist</h2>
                            <Carousel
                                showDots={true}
                                itemClass="carousel-item"
                                containerClass="carousel-container"
                                responsive={responsive}
                            >
                                {searchResults.playlists?.map(playlist => (
                                    <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                                        <PlaylistCard
                                            playlist={playlist}
                                            owner={playlist.type === "public"
                                                ? `${playlist.owner.profile_name} • pubblica`
                                                : user.profile_name}
                                            selectedPlaylistId={null}/>
                                    </Link>
                                ))}
                            </Carousel></>
                    )}

                    {/* Sezione Artisti */}
                    {searchResults.artists && searchResults.artists.length > 0 && (
                        <>
                            <h2>Artisti</h2>
                            <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container"
                                      responsive={responsive}>
                                {searchResults.artists?.map(artist => (
                                    <Link key={artist.id} to={`/artist/${artist.id}`}>
                                        <ArtistCard
                                            artist={artist}
                                            selectedArtistId={""}/>
                                    </Link>

                                ))}
                            </Carousel></>
                    )}
                    {/* Sezione Utente */}
                    {searchResults.users && searchResults.users.length > 0 && (
                        <>
                            <h2>Utenti</h2>
                            <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container"
                                      responsive={responsive}>
                                {searchResults.users?.map(user => (
                                    <Link key={user._id} to={`/user/${user._id}`}>
                                        <UserCard
                                            user={user}/>
                                    </Link>

                                ))}
                            </Carousel></>
                    )}
                    {searchResults.tags && searchResults.tags.length > 0 && (
                        <>

                            <h2>Tags</h2>
                            <Carousel showDots={true} itemClass="carousel-item" containerClass="carousel-container"
                                      responsive={responsive}>
                                {searchResults.tags?.map(playlist => (
                                    <Link key={playlist.id} to={`/playlist/${playlist.id}`}>
                                        <PlaylistCard
                                            playlist={playlist}
                                            owner={playlist.type === "public"
                                                ? `${playlist.owner.profile_name} • pubblica`
                                                : user.profile_name}
                                            selectedPlaylistId={null}/>
                                    </Link>
                                ))}
                            </Carousel></>
                    )}
                </div>
            )}
        </div>
    );
}
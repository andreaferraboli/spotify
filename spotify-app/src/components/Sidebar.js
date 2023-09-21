import React from "react";
import "../styles/Sidebar.css";
import { Link } from 'react-router-dom';
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import Scrollbar from "react-scrollbars-custom";

function Sidebar(props) {

    let playlists = props.playlists;
    return (
        <div className="sidebar">
            <div className="div-img">
                <Link to="/">
                    <img
                        className="sidebar__logo"
                        src="https://firebasestorage.googleapis.com/v0/b/spotify-7a2ad.appspot.com/o/ScreenShot_20230917174348-transformed.png?alt=media&token=34269302-a665-4cf8-9622-f72d95d25727"
                        alt="Home"
                    />
                </Link></div>
            <div></div>
            <div></div>

            <div className="div-icons">
                <SidebarOption Icon={HomeIcon} option="Home" navigateTo="/" currentAudioElement={props.currentAudioElement}
                                       setCurrentAudioElement={props.setCurrentAudioElement}/>
                <SidebarOption Icon={SearchIcon} option="Search" navigateTo="/search" currentAudioElement={props.currentAudioElement}
                                       setCurrentAudioElement={props.setCurrentAudioElement} />
                {
                    (props.user !== undefined && props.user !== null && props.user!=="undefined") && (
                        <>
                            <SidebarOption Icon={LibraryMusicIcon} option="Your Library" navigateTo="/myLibrary" currentAudioElement={props.currentAudioElement}
                                       setCurrentAudioElement={props.setCurrentAudioElement} />
                            <SidebarOption Icon={PlaylistAddIcon} option="Add Playlist" navigateTo="/newPlaylist" currentAudioElement={props.currentAudioElement}
                                       setCurrentAudioElement={props.setCurrentAudioElement} />
                        </>
                    )
                }


            </div>
            <div className="div-text">
                <strong className="sidebar__title">PLAYLISTS</strong>
            </div>
            <div className="div-playlists">
                <Scrollbar>
                    {playlists?.map((playlist) => (
                        <SidebarOption key={playlist.id} navigateTo={"/playlist/" + playlist.id}
                            option={playlist.name} currentAudioElement={props.currentAudioElement}
                            setCurrentAudioElement={props.setCurrentAudioElement}/>
                    ))}
                    {props.public_playlists?.map((playlist) => (
                        <SidebarOption key={playlist.id} navigateTo={"/playlist/" + playlist.id} option={playlist.name}
                            public={true} currentAudioElement={props.currentAudioElement}
                            setCurrentAudioElement={props.setCurrentAudioElement}/>
                    ))}
                </Scrollbar>
            </div>
        </div>
    );
}

export default Sidebar;

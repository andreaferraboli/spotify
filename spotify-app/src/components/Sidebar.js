import React from "react";
import "../style/Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';


function Sidebar(props) {
  let playlists=props.playlists;
  return (
    <div className="sidebar">
      <img
        className="sidebar__logo"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/800px-Spotify_logo_with_text.svg.png"
        alt=""
      />
      <br />
      <SidebarOption Icon={HomeIcon} option="Home" navigateTo="/"/>
      <br />
      <SidebarOption Icon={SearchIcon} option="Search" navigateTo="/search" />
      <br />
      <SidebarOption Icon={LibraryMusicIcon} option="Your Library" navigateTo="/myLibrary" />
      <br />
      <SidebarOption Icon={PlaylistAddIcon} option="Add Playlist" navigateTo="/newPlaylist"/>
      <br />
      <strong className="sidebar__title">PLAYLISTS</strong>
      <hr />
      {playlists?.map((playlist) => (
        <SidebarOption key={playlist.id} navigateTo={"/playlist/"+playlist.id} option={playlist.name} />
      ))}
    </div>
  );
}

export default Sidebar;

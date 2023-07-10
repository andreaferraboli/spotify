import React from "react";
import "../style/Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

function Sidebar() {
  let playlists = {
    playlists: [
      {
        name: "Playlist 1",
        songs: [
          {
            title: "Song 1",
            artist: "Artist 1",
          },
          {
            title: "Song 2",
            artist: "Artist 2",
          },
          {
            title: "Song 3",
            artist: "Artist 3",
          },
          {
            title: "Song 4",
            artist: "Artist 4",
          },
          {
            title: "Song 5",
            artist: "Artist 5",
          },
          {
            title: "Song 6",
            artist: "Artist 6",
          },
          {
            title: "Song 7",
            artist: "Artist 7",
          },
          {
            title: "Song 8",
            artist: "Artist 8",
          },
          {
            title: "Song 9",
            artist: "Artist 9",
          },
          {
            title: "Song 10",
            artist: "Artist 10",
          },
        ],
      },
      {
        name: "Playlist 2",
        songs: [
          {
            title: "Song A",
            artist: "Artist A",
          },
          {
            title: "Song B",
            artist: "Artist B",
          },
          {
            title: "Song C",
            artist: "Artist C",
          },
          {
            title: "Song D",
            artist: "Artist D",
          },
          {
            title: "Song E",
            artist: "Artist E",
          },
          {
            title: "Song F",
            artist: "Artist F",
          },
          {
            title: "Song G",
            artist: "Artist G",
          },
          {
            title: "Song H",
            artist: "Artist H",
          },
          {
            title: "Song I",
            artist: "Artist I",
          },
          {
            title: "Song J",
            artist: "Artist J",
          },
        ],
      },
    ],
  };
  return (
    <div className="sidebar">
      <img
        className="sidebar__logo"
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt=""
      />
      <SidebarOption Icon={HomeIcon} option="Home" />
      <SidebarOption Icon={SearchIcon} option="Search" />
      <SidebarOption Icon={LibraryMusicIcon} option="Your Library" />
      <br />
      <strong className="sidebar__title">PLAYLISTS</strong>
      <hr />
      {playlists["playlists"].map((playlist) => (
        <SidebarOption option={playlist.name} />
      ))}
    </div>
  );
}

export default Sidebar;

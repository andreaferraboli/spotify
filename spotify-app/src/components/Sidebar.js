import React, { useEffect, useState } from "react";
import "../style/Sidebar.css";
import SidebarOption from "./SidebarOption";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import uri from "../database.js";

function Sidebar() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // Funzione per ottenere le playlist dall'API del database
    const fetchPlaylists = async () => {
      const mongoClient = require("mongodb").MongoClient;
      const ObjectId = require("mongodb").ObjectId;
      try {
        const client = await mongoClient.connect(uri);
        const db = client.db("spotify");
        const collection = db.collection("users");
    
        // Esegui la tua query o operazione di aggiornamento sul database
        // ...
        
        const document = await collection.findOne({ _id: new ObjectId("64b5717dfd83c6a083c4109d") });
        setPlaylists(document.my_playlists); // Assumi che l'array delle playlist sia presente nella proprietà 'playlists' della risposta
      } catch (error) {
        console.error("Errore durante la richiesta delle playlist:", error);
      }
    };

    // Chiamata alla funzione per ottenere le playlist quando il componente Sidebar viene montato
    fetchPlaylists();
  }, []);

 
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
      {playlists.map((playlist) => (
        <SidebarOption option={playlist.name} />
      ))}
    </div>
  );
}

export default Sidebar;

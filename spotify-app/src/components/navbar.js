import * as React from "react";

import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import SearchIcon from "@mui/icons-material/Search";
import uri from "../database.js";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));
const fetchDataFromMongoDB = async () => {
  // const mongoClient = require("mongodb").MongoClient;
  // const ObjectId = require("mongodb").ObjectId;
  // try {

  //   const client = await mongoClient.connect(uri);
  //   const db = client.db("spotify");
  //   const collection = db.collection("users");

  //   // Esegui la tua query o operazione di aggiornamento sul database
  //   // ...
    
  //   // Esempio: Trova un documento e ottieni il campo "code"
  //   const document = await collection.findOne({ _id: new ObjectId("64ac1fe73abbef0ced0d2234") });
  //   const code = document.code;


  //   client.close();
  // } catch (error) {
  //   console.error('Errore durante la chiamata al database:', error);
  // }
};
// const mongoClient = require("mongodb").MongoClient;
// const ObjectId = require("mongodb").ObjectId;
// var pwmClient = await new mongoClient(uri).connect();
//   const profile = await pwmClient
//     .db("pwm")
//     .collection("preferiti")
//     .findOne({ _id: new ObjectId("64ac1fe73abbef0ced0d2234") });
// Recupero del file immagine in formato binario
// const imageBinary = profile.image;
// console.log(profile)
// Conversione del binario in base64
// const imageBase64 = Buffer.from(imageBinary).toString('base64');

export default function PrimarySearchAppBar() {


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "flex", md: "flex" } }}>
            
          
            <Chip
              avatar={
                <Avatar alt={"profile.name"} src={"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} />
              }
              label="profile.name"
              variant="outlined"
            />
          </Box>
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}

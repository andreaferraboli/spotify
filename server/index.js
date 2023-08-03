const { ServerApiVersion } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const auth = require("./auth").auth;
const crypto = require("crypto");
const express = require("express");
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../spotify-app", "build")));
app.use(express.static("public"));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});
//connect spotify api
const uri =
  "mongodb+srv://andrewferro04:valerio1234pwm@pwm.lisrj23.mongodb.net/?retryWrites=true&w=majority";
const client_id = "2671048b97804e938412fcbe2810b373";
const client_secret = "3b8081f11e264df7bc3b45bdbd23ebf1";
var my_access_token, spotifyApi;
var url = "https://accounts.spotify.com/api/token";
fetch(url, {
  method: "POST",
  headers: {
    Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ grant_type: "client_credentials" }),
})
  .then((response) => response.json())
  .then(async (tokenResponse) => {
    //Sarebbe opportuno salvare il token nel local storage
    my_access_token = tokenResponse.access_token;
    spotifyApi = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
    });
    spotifyApi.setAccessToken(my_access_token);
    // getPlaylist("6kKHNiL4UuCxSXPv6EuYdl");
  });
  
// function getTrack(id_track) {
//     let track
//     spotifyApi.getTrack(`${id_track}`).then(
//         function (data) {
//             track = {
//                 "id_track": data.body.id,
//                 "name": data.body.name,
//                 "artist": data.body.artists.map(artist => artist.id),
//                 "album": data.body.album.name,
//                 "image": data.body.album.images[0].url,
//                 "duration": ms_to_minute(data.body.duration_ms)
//             }
//         },
//         function (err) {
//             console.error(err);
//         }
//     );
//     return track
// }
async function getTrack(id_track) {
  try {
    const data = await spotifyApi.getTrack(`${id_track}`);
    return filterTrack(data.body);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function filterTrack(track){
  const filteredTrack = {
    id_track: track.id,
    name: track.name,
    artist: track.artists.map((artist) => artist.name),
    album: track.album.name,
    image: track.album.images[0].url,
    duration: track.duration_ms,
  };
  return filteredTrack;
}
function filterAlbum(album){
  const filteredAlbum = {
    id: album.id,
    name: album.name,
    year: album.release_date.slice(0,4),
    image: album.images[0].url
  };
  return filteredAlbum;
}
function filterArtist(artist){
  const filteredArtist = {
    id: artist.id,
    name: artist.name,
    image: artist.images[0].url,
    popularity:artist.popularity,
    followers:artist.followers.total
  };
  return filteredArtist;
}
async function getArtistNameFromId(id_artist) {
  try {
    const artist = await spotifyApi.getArtist(`${id_artist}`);
    return artist.body.name;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
function getPlaylist(id_playlist) {
  spotifyApi.getPlaylist(`${id_playlist}`).then(
    function (data) {
      let playlist = data.body;
      playlist.tracks.items.forEach(async function (item) {
        let track = await getTrack(item.track.id);
        track.artist.forEach(async (artist) => {
          const artistName = await getArtistNameFromId(artist);
          console.log("nome_artista:" + artistName);
        });
      });
    },
    function (err) {
      console.error(err);
    }
  );
}
async function getAlbum(id_album) {
  let album=await spotifyApi.getAlbum(id_album);
  return album.body
}

async function getArtist(id_artist){
  let artist=await spotifyApi.getArtist(id_artist)
  return filterArtist(artist.body);
}
async function getArtistAlbums(id_artist){
  let albums=await spotifyApi.getArtistAlbums(id_artist,{album_type : 'album'});
  return albums.body.items.map((album)=>filterAlbum(album));
}

async function getArtistTopTracks(id_artist){
  let top_tracks=await spotifyApi.getArtistTopTracks(id_artist, 'IT');
  return top_tracks.body.tracks.map((track)=>filterTrack(track));

}
function hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
}

async function addUser(res, user) {
  if (user.name == undefined) {
    res.status(400).send("Missing Name");
    return;
  }
  if (user.surname == undefined) {
    res.status(400).send("Missing Surname");
    return;
  }
  if (user.email == undefined) {
    res.status(400).send("Missing Email");
    return;
  }
  if (user.password == undefined || user.password.length < 3) {
    res.status(400).send("Password is missing or too short");
    return;
  }
  if (user.date == undefined) {
    res.status(400).send("Date is missing or too short");
    return;
  }
  
  user.password = hash(user.password);
  
  var pwmClient = await new mongoClient(uri).connect();
  try {
    var items = await pwmClient
    .db("pwm")
    .collection("spotify")
    .collection("users")
    .insertOne(user);
    // res.json(items)
    console.log(items);
  } catch (e) {
    console.log("catch in test");
    if (e.code == 11000) {
      res.status(400).send("Utente già presente");
      return;
    }
    res.status(500).send(`Errore generico: ${e}`);
  }
}
function deleteUser(res, id) {
  let index = users.findIndex((user) => user.id == id);
  if (index == -1) {
    res.status(404).send("User not found");
    return;
  }
  users = users.filter((user) => user.id != id);
  
  res.json(users);
}
async function updateUser(res, id, updatedUser) {
  if (updatedUser.name == undefined) {
    res.status(400).send("Missing Name");
    return;
  }
  if (updatedUser.surname == undefined) {
    res.status(400).send("Missing Surname");
    return;
  }
  if (updatedUser.email == undefined) {
    res.status(400).send("Missing Email");
    return;
  }
  if (updatedUser.password == undefined) {
    res.status(400).send("Missing Password");
    return;
  }
  updatedUser.password = hash(updatedUser.password);
  try {
    var pwmClient = await new mongoClient(uri).connect();
    
    var filter = { _id: new ObjectId(id) };
    
    var updatedUserToInsert = {
      $set: updatedUser,
    };
    
    var item = await pwmClient
    .db("pwm")
    .collection("users")
      .updateOne(filter, updatedUserToInsert);

      res.send(item);
    } catch (e) {
      console.log("catch in test");
      if (e.code == 11000) {
        res.status(400).send("Utente già presente");
        return;
      }
      res.status(500).send(`Errore generico: ${e}`);
    }
  }
  
  async function addFavorites(res, id, movie_id) {
    try {
      var pwmClient = await new mongoClient(uri).connect();
      
      var filter = { user_id: new ObjectId(id) };
      
      var favorite = {
        $push: { movie_ids: movie_id },
      };
      console.log(filter);
      console.log(favorite);
      
      var item = await pwmClient
      .db("pwm")
      .collection("preferiti")
      .updateOne(filter, favorite);
      
      res.send(item);
    } catch (e) {
      res.status(500).send(`Errore generico: ${e}`);
  }
}

async function removeFavorites(res, id, movie_id) {
  try {
    var pwmClient = await new mongoClient(uri).connect();
    
    var filter = { user_id: new ObjectId(id) };
    
    var favorite = {
      $pull: { movie_ids: movie_id },
    };
    console.log(filter);
    console.log(favorite);
    
    var item = await pwmClient
    .db("pwm")
    .collection("preferiti")
    .updateOne(filter, favorite);
    
    res.send(item);
  } catch (e) {
    res.status(500).send(`Errore generico: ${e}`);
  }
}

app.get("/users", auth, async function (req, res) {
  var pwmClient = await new mongoClient(uri).connect();
  var users = await pwmClient
  .db("pwm")
  .collection("users")
  .find()
  .project({ password: 0 })
  .toArray();
  res.json(users);
});

app.post("/users", auth, function (req, res) {
  addUser(res, req.body);
});

app.get("/user/:id", auth, async function (req, res) {
  // Ricerca nel database
  var id = req.params.id;
  var pwmClient = await new mongoClient(uri).connect();
  var user = await pwmClient
    .db("spotify")
    .collection("users")
    .find({ _id: new ObjectId(id) })
    .project({ password: 0 }).toArray()
  res.json(user);
});
app.get("/login", async function (req, res) {
  res.sendFile(path.join(__dirname, "./spotify-app/build", "/login.html"));
});
app.post("/login", async (req, res) => {
  login = req.body;
  
  if (login.email == undefined) {
    res.status(400).send("Missing Email");
    return;
  }
  if (login.password == undefined) {
    res.status(400).send("Missing Password");
    return;
  }

  login.password = hash(login.password);

  var pwmClient = await new mongoClient(uri).connect();
  var filter = {
    $and: [{ email: login.email }, { password: login.password }],
  };
  var loggedUser = await pwmClient
    .db("pwm")
    .collection("users")
    .findOne(filter);
  console.log(loggedUser);

  if (loggedUser == null) {
    res.status(401).send("Unauthorized");
  } else {
    res.json(loggedUser);
  }
});

app.put("/users/:id", auth, function (req, res) {
  updateUser(res, req.params.id, req.body);
});

app.delete("/users/:id", auth, function (req, res) {
  deleteUser(res, req.params.id);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./spotify-app/build", "/index.html"));
});

app.get("/favorites/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  var pwmClient = await new mongoClient(uri).connect();
  var favorites = await pwmClient
    .db("pwm")
    .collection("preferiti")
    .findOne({ user_id: new ObjectId(id) });
  res.json(favorites);
});
app.get("/artist/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  let artist=await getArtist(id);
  let top_tracks=await getArtistTopTracks(id);
  let albums=await getArtistAlbums(id);
  let response={"info":[artist,top_tracks,albums]};
    res.json(response);
} )
app.get("/playlist/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  var pwmClient = await new mongoClient(uri).connect();
  var playlist = await pwmClient
    .db("spotify")
    .collection("users").aggregate([
      { $unwind: "$my_playlists" },
      { $match: { "my_playlists.id": id } },
      { $project: { my_playlists: 1, _id: 0 } }
    ]).toArray();
    res.json(playlist);
});
app.post("/favorites/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  movie_id = req.body.movie_id;
  console.log(movie_id);
  console.log(id);
  addFavorites(res, id, movie_id);
});
app.delete("/favorites/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  movie_id = req.body.movie_id;
  console.log(movie_id);
  console.log(id);
  removeFavorites(res, id, movie_id);
});
function ms_to_minute(milliseconds) {
  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);

  // Format the result as minutes:seconds
  const formattedTime = `${minutes}:${seconds.padStart(2, "0")}`;
  return formattedTime;
}

app.listen(3100, "0.0.0.0", () => {
  console.log("Server partito porta 3100");
});

const { ServerApiVersion } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const auth = require("./auth").auth;
const crypto = require("crypto");
const fs = require('fs');
const express = require("express");
const bodyParser = require('body-parser');
const path = require("path");
var SpotifyWebApi = require("spotify-web-api-node");
const { v4: uuidv4 } = require('uuid');
const app = express();
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./spotify-7a2ad-firebase-adminsdk-lyp7p-dd1e759ff0.json'); // Replace with the path to your service account key JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'spotify-7a2ad.appspot.com/', // Replace with your Firebase project's storage bucket
});

const bucket = admin.storage().bucket();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../spotify-app", "build")));
app.use(express.static("public"));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
function filterTrack(track) {
  const filteredTrack = {
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => ({ name: artist.name, id: artist.id })),
    album: track.album.name,
    image: track.album.images[0].url,
    duration: track.duration_ms,
  };
  return filteredTrack;
}
function filterAlbum(album) {
  const filteredAlbum = {
    id: album.id,
    name: album.name,
    year: album.release_date.slice(0, 4),
    image: album.images[0].url
  };
  return filteredAlbum;
}
function filterArtist(artist) {
  const filteredArtist = {
    id: artist.id,
    name: artist.name,
    image: artist.images[0]?.url,
    popularity: artist.popularity,
    followers: artist.followers.total
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
        });
      });
    },
    function (err) {
      console.error(err);
    }
  );
}
async function getAlbum(id_album) {
  let album = await spotifyApi.getAlbum(id_album);
  return album.body
}

async function getArtist(id_artist) {
  let artist = await spotifyApi.getArtist(id_artist)
  return filterArtist(artist.body);
}
async function getArtistAlbums(id_artist) {
  let albums = await spotifyApi.getArtistAlbums(id_artist, { album_type: 'album' });
  return albums.body.items.map((album) => filterAlbum(album));
}

async function getArtistTopTracks(id_artist) {
  let top_tracks = await spotifyApi.getArtistTopTracks(id_artist, 'IT');
  return top_tracks.body.tracks.map((track) => filterTrack(track));

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
  } catch (e) {
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
    if (e.code == 11000) {
      res.status(400).send("Utente già presente");
      return;
    }
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
    .db("spotify")
    .collection("users")
    .findOne(filter);

  if (loggedUser == null) {
    res.status(401).send("Unauthorized");
  } else {
    res.json(loggedUser);
  }
});

app.post("/register", async (req, res) => {

  register = req.body;
  if (register.email == undefined) {
    res.status(400).send("Missing Email");
    return;
  }
  if (register.password == undefined) {
    res.status(400).send("Missing Password");
    return;
  }

  register.password = hash(register.password);
  var pwmClient = await new mongoClient(uri).connect();
  try {
    var items = await pwmClient
      .db("spotify")
      .collection("users")
      .insertOne(register);
    res.status(201).send(items)
  } catch (e) {
    if (e.code == 11000) {
      res.status(400).send("Utente già presente");
      return;
    }
    res.status(500).send(`Errore generico: ${e}`);
  }
});
function convertBase64ToPng(base64String, outputFilePath) {
  try {
    // Remove the data URL prefix and get the actual base64 data
    const base64Data = base64String.replace(/^data:image\/png;base64,/, '');

    // Convert base64 to binary data
    const binaryData = Buffer.from(base64Data, 'base64');

    // Write binary data to a PNG file
    fs.writeFileSync(outputFilePath, binaryData);

  } catch (error) {
    console.error('Error converting and saving image:', error);
  }
}
async function uploadToFirebaseStorage(filePath, id) {
  try {
    // Upload the file to Firebase Cloud Storage
    await bucket.upload(filePath, {
      destination: 'playlist/' + id + '.png', // Destination path in the storage bucket
    });

  } catch (error) {
    console.error('Error uploading image:', error);
  }
}
app.post('/upload', async (req, res) => {
  try {
    // const dataUrl = req.body.blobUrl;
    let dataUrl = req.body.dataUrl
    const id = req.body.id;
    convertBase64ToPng(dataUrl, 'image.png');
    await uploadToFirebaseStorage('image.png', id);
    const path = "playlist/" + id + ".png";
    const [url] = await bucket.file(path).getSignedUrl({
      version: 'v2',
      action: 'read',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2)
    });
    res.json({ imageUrl: url });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the Blob URL.' });
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

app.get('/check-email/:email', async (req, res) => {
  const email = req.params.email;

  try {
    var pwmClient = await new mongoClient(uri).connect();
    var user = await pwmClient
      .db("spotify")
      .collection("users").findOne({ "email": email });
    if (user !== null) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Errore durante la verifica dell\'email:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});
app.get("/artists/:query", async (req, res) => {
  // Ricerca nel database
  query = req.params.query
  res.send(searchArtists(query))
});
app.get("/artist/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  let artist = await getArtist(id);
  let top_tracks = await getArtistTopTracks(id);
  let albums = await getArtistAlbums(id);
  let response = { "info": [artist, top_tracks, albums] };
  res.json(response);
})
app.get("/playlist/:id", async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  var pwmClient = await new mongoClient(uri).connect();
  var playlist = await pwmClient
    .db("spotify")
    .collection("users").aggregate([
      { $unwind: "$my_playlists" },
      { $match: { "my_playlists.id": id } },
      { $project: { my_playlists: 1 } }
    ]).toArray();
  res.json(playlist);
});
app.get("/newId", async (req, res) => {
  let newId;
  let pwmClient, playlist;
  do {
    newId = uuidv4();
    pwmClient = await new mongoClient(uri).connect();
    playlist = await pwmClient
      .db("spotify")
      .collection("users").aggregate([
        { $unwind: "$my_playlists" },
        { $match: { "my_playlists.id": newId } },
        { $project: { my_playlists: 1 } }
      ]).toArray();
  } while (playlist.length !== 0)

  return res.status(200).send({ 'id': newId })

})
app.put("/playlist/:id", async (req, res) => {
  const playlistId = req.params.id;
  const updatedPlaylist = req.body;
  try {
    let pwmClient = await new mongoClient(uri).connect();
    let result = await pwmClient
      .db("spotify")
      .collection("users").updateOne(
        { 'my_playlists.id': playlistId },
        { $set: { 'my_playlists.$': updatedPlaylist } }
      );

    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'Playlist updated successfully' });
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.post("/playlist", async (req, res) => {
  // Ricerca nel database

  const playlist = req.body.playlist; // Replace with your desired genres array
  const userId = req.body.userId;
  var pwmClient = await new mongoClient(uri).connect();
  var result = await pwmClient
    .db("spotify")
    .collection("users").updateOne(
      { _id: new ObjectId(userId) }, // Qui inserisci il criterio per individuare l'utente corretto
      { $push: { my_playlists: playlist } }
    );
  res.json(playlist);
});
app.delete('/playlist/:id', async (req, res) => {
  const playlistId = req.params.id;

  try {
    var pwmClient = await new mongoClient(uri).connect();
    var result = await pwmClient
      .db("spotify")
      .collection("users").updateOne(
        { "my_playlists.id": playlistId },
        { $pull: { my_playlists: { id: playlistId } } }
      );

    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Playlist deleted successfully' });
    } else {
      res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get("/genres", async (req, res) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
      headers: {
        Authorization: `Bearer ${my_access_token}`,
      },
    });

    // const artists = response.data.tracks.map(track => track.artists[0].name);
    res.send(response.data.genres.map((genre, index) => ({ "id": index, "name": genre })));
  } catch (error) {
    console.error('An error occurred:', error);
  }
});

app.post("/genre", async (req, res) => {
  const genres = req.body.genres; // Replace with your desired genres array
  const limit = req.body.limit; // Limit the number of results
  let artists = [];
  const fetchPromises = genres.map(async genre => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/recommendations?type=artist&seed_genres=${genre}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${my_access_token}`,
        },
      });

      const artistIds = response.data.tracks.map(track => track.artists[0].id);
      artists.push(...artistIds);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  });

  // Wait for all API requests to finish
  Promise.all(fetchPromises)
    .then(async () => {
      const detailedArtists = await Promise.all(artists.map(artist => getArtist(artist)));
      res.send(detailedArtists);
    })
    .catch(error => {
      console.error('Error:', error);
      res.status(500).send('An error occurred.');
    });
});

async function searchArtists(query) {
  let artists = await spotifyApi.searchArtists(query)
  return artists.body.artists.items.map((artist) => filterArtist(artist));
}
async function searchTracks(query) {
  let tracks = await spotifyApi.searchTracks(query)
  return tracks.body.tracks.items.map((track) => filterTrack(track));

}
async function searchAlbums(query) {
  let albums = await spotifyApi.searchAlbums(query)
  return albums.body.albums.items.map((album)=>filterAlbum(album));
}
async function searchPlaylists(query) {
  try {
    var pwmClient = await new mongoClient(uri).connect();
    var playlists = await pwmClient
      .db("spotify")
      .collection("users").aggregate([
        { $unwind: '$my_playlists' },
        { $match: { 'my_playlists.name': { $regex: query, $options: 'i' } } },
        { $project: { my_playlists: 1 } }
      ])
      .toArray();

    return playlists.map(item => item.my_playlists);
  } catch (error) {
    console.error('Error searching playlists:', error);
    return []; // Ritorna un array vuoto in caso di errore
  }
}

// Funzione per cercare gli utenti nel database MongoDB
async function searchUsers(query) {
  try {
    var pwmClient = await new mongoClient(uri).connect();
    const users = await pwmClient
      .db("spotify").collection('users')
      .find({ 'profile_name': { $regex: query, $options: 'i' } })
      .project({ 'profile_name': 1, '_id': 1, 'image': 1 })
      .toArray();

    return users; // Ritorna i risultati degli utenti
  } catch (error) {
    console.error('Error searching users:', error);
    return []; // Ritorna un array vuoto in caso di errore
  }
}
app.get("/searchTracks/:query", async (req, res) => {
  query = req.params.query
  res.send(searchTracks(query));
})
app.get("/search/:query", async (req, res) => {
  let query = req.params.query
  let tracks = await searchTracks(query);
  let artists =await searchArtists(query)
  let albums = await searchAlbums(query);
  let playlists = await searchPlaylists(query);
  let users = await searchUsers(query);
  let result = {
    "tracks": tracks,
    "albums": albums,
    "artists": artists,
    "playlists": playlists,
    "users": users
  }
  res.status(200).send(result)

})
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

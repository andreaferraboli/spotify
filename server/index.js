const { ServerApiVersion } = require('mongodb');
const mongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const crypto = require("crypto");
const fs = require('fs');
const fsPromises = require('fs').promises;
const express = require("express");
const apiKey = "12345667654"
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
var SpotifyWebApi = require("spotify-web-api-node");
const { v4: uuidv4 } = require('uuid');
const fileUpload = require('express-fileupload');
const app = express();
const axios = require('axios');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./spotify-7a2ad-firebase-adminsdk-lyp7p-dd1e759ff0.json'); // Replace with the path to your service account key JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'spotify-7a2ad.appspot.com/',
});

const bucket = admin.storage().bucket();
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../spotify-app", "build")));
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function authenticateApiKey(req, res, next) {
  const providedApiKey = req.query.apikey;
  if (!providedApiKey) {
    return res.status(401).json({ message: "API key missing" });
  }

  if (providedApiKey !== apiKey) {
    return res.status(401).json({ message: "Invalid API key" });
  }

  // L'API key è valida, procedi all'endpoint successivo
  next();
}

//connect spotify api
const uri =
  "mongodb+srv://andrewferro04:valerio1234pwm@pwm.lisrj23.mongodb.net/?retryWrites=true&w=majority";
// Credenziali del client fornite da Spotify
const client_id = "2671048b97804e938412fcbe2810b373";
const client_secret = "3b8081f11e264df7bc3b45bdbd23ebf1";
// Variabili per memorizzare l'access token e l'oggetto SpotifyApi
var my_access_token, spotifyApi;
// URL dell'endpoint per ottenere il token di accesso da Spotify
var url = "https://accounts.spotify.com/api/token";
// Effettua una richiesta POST all'endpoint per ottenere il token di accesso
fetch(url, {
  method: "POST",
  headers: {
    // Include le credenziali del client codificate in Base64 nell'header Authorization
    Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
    // Specifica il tipo di contenuto nell'header
    "Content-Type": "application/x-www-form-urlencoded",
  },
  // Includi il tipo di concessione richiesto (client_credentials) nel corpo della richiesta
  body: new URLSearchParams({ grant_type: "client_credentials" }),
})
  .then((response) => response.json())
  .then(async (tokenResponse) => {
    // Una volta ottenuto il token di accesso dalla risposta, memorizzalo
    my_access_token = tokenResponse.access_token;
    // Inizializza un'istanza di SpotifyWebApi con le credenziali del client
    spotifyApi = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
    });
    // Imposta il token di accesso per l'istanza di SpotifyWebApi
    spotifyApi.setAccessToken(my_access_token);
  });


async function getTrack(id_track) {
  try {
    const data = await spotifyApi.getTrack(`${id_track}`);
    return filterTrack(data.body);
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function getFullTrack(id_track) {
  try {
    const data = await spotifyApi.getTrack(`${id_track}`);
    return data.body;
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
    year: track.album.release_date.slice(0, 4),
    image: track.album.images[0].url,
    duration: track.duration_ms,
    popularity: track.popularity,
    preview_url: track.preview_url
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

async function filterFullAlbum(album) {
  const filteredAlbum = {
    id: album.id,
    name: album.name,
    artists: album.artists.map(artist => ({ id: artist.id, name: artist.name })),
    release_date: album.release_date,
    image: album.images[0].url,
    tracks: await Promise.all(
      album.tracks.items.map(async track => {
        const detailedTrack = await getTrack(track.id);
        return detailedTrack;
      }))
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
async function searchTracksFromArtist(query, name_artist, id_artist) {

  let tracks = await spotifyApi.searchTracks(`track:${query} artist:${name_artist}`)

  return tracks.body.tracks.items.map((track) => filterTrack(track)).filter((obj) =>
    obj.artists.some((artist) => artist.id === id_artist)
  );
}
function hash(input) {
  return crypto.createHash("md5").update(input).digest("hex");
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


/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'User\'s ID',
    required: true,
    type: 'string'
} */
/* #swagger.responses[200] = {
    description: 'User successfully obtained.',
    schema: {
        name: 'Jhon Doe',
        age: 29,
        about: ''
    }
} */
app.get("/user/:id", authenticateApiKey, async function (req, res) {
  // Retrieve user data from the database
  var id = req.params.id;
  var user = await getUser(id);
  let pwmClient = await new mongoClient(uri).connect();
  const playlistsCollection = pwmClient
    .db("spotify")
    .collection("public_playlists");

  // Retrieve user's playlists from the database
  user[0].playlists = await playlistsCollection.find({ 'owner.id': id }).toArray();
  res.json(user);
});

/* #swagger.parameters['id'] = {
    in: 'path',
    description: 'User\'s ID',
    required: true,
    type: 'string'
} */
/* #swagger.responses[200] = {
    description: 'User with playlists successfully obtained.',
    schema: {
        name: 'Jhon Doe',
        age: 29,
        about: '',
        playlists: [
            {
                // Playlist schema here
            }
        ]
    }
} */
app.get("/showUser/:id", authenticateApiKey, async function (req, res) {
  // Retrieve user data from the database
  var id = req.params.id;
  var user = await getUser(id);
  user = user[0];

  // Connect to the MongoDB database
  let pwmClient = await new mongoClient(uri).connect();
  const playlistsCollection = pwmClient
    .db("spotify")
    .collection("public_playlists");

  // Retrieve user's playlists from the database
  user.playlists = await playlistsCollection.find({ 'owner.id': id }).toArray();
  user.email = "";

  // Set default user image if not available
  if (user.image === "") {
    user.image = "https://www.nicepng.com/png/detail/136-1366211_group-of-10-guys-login-user-icon-png.png";
  }

  // Initialize additional user data arrays
  user.my_playlists = [];
  user.favourite_artists = [];
  user.favourite_genres = [];

  res.json(user);
});

app.post("/login", authenticateApiKey, async (req, res) => {
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
  try {
    var pwmClient = await new mongoClient(uri).connect();
    var filter = {
      $and: [{ email: login.email }, { password: login.password }],
    };
    var loggedUser = await pwmClient
      .db("spotify")
      .collection("users")
      .findOne(filter);

    if (loggedUser == null) {
      res.status(404).send("sbagliata combinazione");
    } else {
      res.status(200).json(loggedUser);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("Internal Server Error");
  }

});

app.post("/register", authenticateApiKey, async (req, res) => {

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
    res.status(201).send({ "userId": items.insertedId })

  } catch (e) {
    if (e.code == 11000) {
      res.status(400).send("Utente già presente");
      return;
    }
    res.status(500).send(`Errore generico: ${e}`);
  }
});

async function getUser(id) {
  var pwmClient = await new mongoClient(uri).connect();
  var user = await pwmClient
    .db("spotify")
    .collection("users")
    .find({ _id: new ObjectId(id) })
    .project({ password: 0 }).toArray();
  return user;
}

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
// Funzione per caricare un file su Firebase Cloud Storage
async function uploadToFirebaseStorage(filePath, id, directory) {
  try {
    // Carica il file su Firebase Cloud Storage specificando la destinazione
    await bucket.upload(filePath, {
      destination: directory + "/" + id + '.png', // Percorso di destinazione nel bucket di archiviazione
    });

  } catch (error) {
    console.error('Errore durante il caricamento dell\'immagine:', error);
  }
}

app.post('/setUserImage/:userId', authenticateApiKey, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fileUrl } = req.body;

    let pwmClient = await new mongoClient(uri).connect();
    const result = await pwmClient
      .db("spotify")
      .collection("users")
      .updateOne(
        { '_id': new ObjectId(userId) }, // Convert userId to ObjectID
        { $set: { 'image': fileUrl } }
      );
    await pwmClient
      .db("spotify")
      .collection("public_playlists")
      .updateMany(
        { 'owner.id': userId },
        { $set: { 'owner.image': fileUrl } }
      );
    if (result.matchedCount === 1) {
      res.status(200).json({ message: 'User image updated successfully' });
    } else {
      res.status(404).json({ message: "User not found or error in updating image" });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});
app.post('/uploadFile/:idUser', authenticateApiKey, async (req, res) => {
  try {
    const id = req.params.idUser;
    const uploadedFile = req.files.file; // Assuming you're using a FormData with a 'file' field

    const fileData = Buffer.from(uploadedFile.data);
    const filePath = path.join(__dirname, 'images', `${id}.png`);
    await fsPromises.writeFile(filePath, fileData);

    // Call your function to upload to Firebase Storage with the imagePath
    await uploadToFirebaseStorage(filePath, id, 'user');

    // Genera un URL firmato per l'accesso al file
    const pathImage = `user/${id}.png`;
    const [url] = await bucket.file(pathImage).getSignedUrl({
      version: 'v2',
      action: 'read',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2) // Scade tra due anni
    });

    res.json({ fileUrl: url });
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({ error: 'Si è verificato un errore durante il caricamento del file.' });
  }
});

app.post('/upload', authenticateApiKey, async (req, res) => {
  try {
    // const dataUrl = req.body.blobUrl;
    let dataUrl = req.body.dataUrl
    const id = req.body.id;
    convertBase64ToPng(dataUrl, 'images/image.png');
    await uploadToFirebaseStorage('images/image.png', id, "playlist");
    const pathImage = "playlist/" + id + ".png";
    const [url] = await bucket.file(pathImage).getSignedUrl({
      version: 'v2',
      action: 'read',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2)
    });
    res.json({ imageUrl: url });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the Blob URL.' });
  }
});
app.put("/users/:id", authenticateApiKey, function (req, res) {
  updateUser(res, req.params.id, req.body);
});

app.delete("/users/:id", authenticateApiKey, function (req, res) {
  deleteUser(res, req.params.id);
});

app.get("/", authenticateApiKey, function (req, res) {
  res.sendFile(path.join(__dirname, "./spotify-app/build", "/index.html"));
});

app.get('/check-email/:email', authenticateApiKey, async (req, res) => {
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
app.get("/artists/:query", authenticateApiKey, async (req, res) => {
  // Ricerca nel database
  query = req.params.query
  res.send(await searchArtists(query))
});
app.get("/track/:id", authenticateApiKey, async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  let track = await getFullTrack(id);
  res.json(track);
})
app.get("/album/:id", authenticateApiKey, async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  let album = await getAlbum(id);
  res.json(await filterFullAlbum(album));
})
app.get("/artist/:id", authenticateApiKey, async (req, res) => {
  // Ricerca nel database
  var id = req.params.id;
  let artist = await getArtist(id);
  let top_tracks = await getArtistTopTracks(id);
  let albums = await getArtistAlbums(id);
  let response = { artist: { info: artist, top_tracks: top_tracks, albums: albums } };
  res.json(response);
})
app.get("/playlist/:id", authenticateApiKey, async (req, res) => {
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
  if (playlist.length === 0) {
    playlist = await pwmClient
      .db("spotify")
      .collection("public_playlists").findOne(
        { "id": id }
      )
    playlist.type = "public"
  } else {
    playlist[0].my_playlists.type = "private"
    playlist = playlist[0].my_playlists
  }
  res.json(playlist);
});
app.get("/newId", authenticateApiKey, async (req, res) => {
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
app.put("/playlist/:id", authenticateApiKey, async (req, res) => {
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
      result = await pwmClient
        .db("spotify")
        .collection("public_playlists").updateOne(
          { 'id': playlistId },
          { $set: { "tracks": updatedPlaylist.tracks, "image": updatedPlaylist.image } }
        );
      if (result.matchedCount === 1)
        res.status(200).json({ message: 'Playlist updated successfully' });
      else
        res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.post("/playlist", authenticateApiKey, async (req, res) => {
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

  if (result.modifiedCount === 1) {
    res.status(200).json({ message: 'Playlist added successfully' });
  } else {
    res.status(404).json({ message: 'Errore nel caricamento della playlist nel server' });
  }
});
app.delete('/playlist/:id', authenticateApiKey, async (req, res) => {
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

app.post('/playlists/:playlistId/add-track', authenticateApiKey, async (req, res) => {
  const playlistId = req.params.playlistId;
  const trackData = req.body.trackData;
  const type = req.body.type
  try {
    let pwmClient = await new mongoClient(uri).connect();
    let result
    if (type === "private") {
      result = await pwmClient
        .db("spotify")
        .collection("users").updateOne(
          { 'my_playlists.id': playlistId },
          { $addToSet: { 'my_playlists.$.tracks': trackData } }
        );
    } else {
      result = await pwmClient
        .db("spotify")
        .collection("public_playlists").updateOne(
          { 'id': playlistId },
          { $addToSet: { "tracks": trackData } }
        );
    }


    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: 'Traccia già presente' });
    } else
      res.status(200).send({ message: 'Traccia aggiunta alla playlist con successo' });
  } catch (error) {
    console.error('Errore durante l\'aggiunta della traccia alla playlist', error);
    res.status(500).send({ message: 'Si è verificato un errore interno' });
  }
});
app.get("/genres", authenticateApiKey, async (req, res) => {
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

app.post("/genre", authenticateApiKey, async (req, res) => {
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
  let artists = await spotifyApi?.searchArtists(query)
  return artists.body.artists.items.map((artist) => filterArtist(artist)).sort((a, b) => {
    if (a.name.toLowerCase().includes(query.toLowerCase()) && !b.name.toLowerCase().includes(query.toLowerCase())) {
      return -1; // a comes before b
    } else if (!a.name.toLowerCase().includes(query.toLowerCase()) && b.name.toLowerCase().includes(query.toLowerCase())) {
      return 1; // b comes before a
    } else {
      // If query is present in both or in neither, sort by popularity
      return b.popularity - a.popularity; // descending popularity order
    }
  });
}
async function searchTracks(query) {
  let tracks = await spotifyApi.searchTracks(query)
  return tracks.body.tracks.items.map((track) => filterTrack(track)).sort((a, b) => {
    if (a.name.toLowerCase().includes(query.toLowerCase()) && !b.name.toLowerCase().includes(query.toLowerCase())) {
      return -1; // a comes before b
    } else if (!a.name.toLowerCase().includes(query.toLowerCase()) && b.name.toLowerCase().includes(query.toLowerCase())) {
      return 1; // b comes before a
    } else {
      // If query is present in both or in neither, sort by popularity
      return b.popularity - a.popularity; // descending popularity order
    }
  });;

}
async function searchAlbums(query) {
  let albums = await spotifyApi.searchAlbums(query)
  return albums.body.albums.items.filter(album => album.album_type === "album").map((album) => filterAlbum(album));
}
async function searchPlaylists(query, id) {
  try {
    var pwmClient = await new mongoClient(uri).connect();
    let userPlaylistsCursor;
    // Search for user playlists using aggregation
    if (id ?? '') { userPlaylistsCursor = [] } else {
      userPlaylistsCursor = await pwmClient
        .db("spotify")
        .collection("users")
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          { $unwind: '$my_playlists' },
          { $match: { 'my_playlists.name': { $regex: query, $options: 'i' } } },
          { $project: { my_playlists: 1 } }
        ])
        .toArray();
    }
    var userPlaylists = userPlaylistsCursor.map(item => ({
      ...item.my_playlists,
      type: "private"
    }));

    // Search for public playlists using find()
    var publicPlaylistsCursor = await pwmClient
      .db("spotify")
      .collection("public_playlists")
      .find({ "name": { $regex: query, $options: 'i' } })
      .toArray();

    var publicPlaylists = publicPlaylistsCursor.map(item => ({
      ...item,
      type: "public"
    }));

    // Combine user and public playlists
    var allPlaylists = userPlaylists.concat(publicPlaylists);

    return allPlaylists;
  } catch (error) {
    console.error('Error searching playlists:', error);
    return []; // Return an empty array in case of error
  }
}
async function searchTags(query, id) {

  try {
    var pwmClient = await new mongoClient(uri).connect();

    let userPlaylistsCursor
    // Search for user playlists using aggregation
    if (id ?? '') { userPlaylistsCursor = [] } else {
      userPlaylistsCursor = await pwmClient
        .db("spotify")
        .collection("users")
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          { $unwind: '$my_playlists' },
          { $match: { 'my_playlists.tags': { $in: [query] } } },
          { $project: { my_playlists: 1 } } // Seleziona solo l'array 'my_playlists'
        ])
        .toArray();
    }
    var userPlaylists = userPlaylistsCursor.map(item => ({
      ...item.my_playlists,
      type: "private"
    }));

    // Search for public playlists using find()
    var publicPlaylistsCursor = await pwmClient
      .db("spotify")
      .collection("public_playlists")
      .find({ "tags": { $in: [query] } })
      .toArray();

    var publicPlaylists = publicPlaylistsCursor.map(item => ({
      ...item,
      type: "public"
    }));

    // Combine user and public playlists
    var allPlaylists = userPlaylists.concat(publicPlaylists);

    return allPlaylists;
  } catch (error) {
    console.error('Error searching playlists:', error);
    return []; // Return an empty array in case of error
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
app.get("/searchTracks/:query", authenticateApiKey, async (req, res) => {
  query = req.params.query
  res.send(await searchTracks(query));
})
app.get("/searchTrack/:idTrack", authenticateApiKey, async (req, res) => {
  id_track = req.params.idTrack
  const id = req.query.id;
  console.log("id:", id)
  var pwmClient = await new mongoClient(uri).connect();
  let userPlaylistsCursor;
  if (id ?? '') {
    userPlaylistsCursor = [];
  } else {
    userPlaylistsCursor = await pwmClient
      .db("spotify")
      .collection("users")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $unwind: '$my_playlists' },
        { $match: { 'my_playlists.tracks.id': id_track } },
        { $project: { _id: 0, 'my_playlists': 1 } }
      ])
      .toArray();
  }

  const playlistsCollection = await pwmClient
    .db("spotify")
    .collection("public_playlists").
    find({ "tracks.id": id_track })
    .toArray();
  let result = {
    playlists: userPlaylistsCursor.map(playlist => playlist.my_playlists),
    public_playlists: playlistsCollection
  }
  res.send(result);
})
app.get("/search/:query", authenticateApiKey, async (req, res) => {
  let query = req.params.query
  const id = req.query.id;
  let tracks = await searchTracks(query);
  let artists = await searchArtists(query)
  let albums = await searchAlbums(query);
  let playlists = await searchPlaylists(query, id);
  let users = await searchUsers(query);
  let tags = await searchTags(query, id);
  let result = {
    "tracks": tracks,
    "albums": albums,
    "artists": artists,
    "playlists": playlists,
    "users": users,
    "tags": tags
  }
  res.status(200).send(result)

})
app.get("/searchTracksArtist/:id/:query", authenticateApiKey, async (req, res) => {
  let query = req.params.query
  const id = req.params.id;
  let artist = await getArtist(id);
  let tracks = await searchTracksFromArtist(query, artist.name, id);
  res.status(200).send(tracks)

})
app.get('/relatedPlaylists/:userId', authenticateApiKey, async (req, res) => {
  const userId = req.params.userId;

  try {

    let pwmClient = await new mongoClient(uri).connect();
    const playlistsCollection = pwmClient
      .db("spotify")
      .collection("public_playlists");

    const publicPlaylists = await playlistsCollection.find().toArray();
    publicPlaylists.sort((a, b) => b.followers.length - a.followers.length);
    const followedPlaylists = await playlistsCollection.find({ followers: { $in: [userId] } }).toArray();
    const yourPublicPlaylists = await playlistsCollection.find({ 'owner.id': userId }).toArray();

    const responseData = {
      public_playlists: publicPlaylists,
      followed_playlists: followedPlaylists,
      your_public_playlists: yourPublicPlaylists,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/changeTag', authenticateApiKey, async (req, res) => {
  const { playlistId, tag, action } = req.body;

  try {
    let pwmClient = await new mongoClient(uri).connect();
    let playlistsCollection = pwmClient
      .db("spotify")
      .collection("public_playlists");

    let playlist = await playlistsCollection.findOne({ id: playlistId });

    if (!playlist) {
      playlistsCollection = pwmClient
        .db("spotify")
        .collection("users");
      const userPlaylist = await playlistsCollection.aggregate([
        { $unwind: "$my_playlists" },
        { $match: { "my_playlists.id": playlistId } },
        { $project: { my_playlists: 1 } }
      ]).toArray();
      playlist = userPlaylist[0].my_playlists

    }
    if (action === 'add') {
      if (!playlist.tags.includes(tag)) {
        playlist.tags.push(tag);
      }
    } else if (action === 'remove') {
      const tagIndex = playlist.tags.indexOf(tag);
      if (tagIndex !== -1) {
        playlist.tags.splice(tagIndex, 1);
      }
    }


    if (playlist.owner ?? "")
      await playlistsCollection.updateOne({ id: playlistId }, { $set: { tags: playlist.tags } });
    else
      await playlistsCollection.updateOne(
        { "my_playlists.id": playlistId },
        { $set: { "my_playlists.$.tags": playlist.tags } }
      );
    return res.status(200).json({ message: 'Tag updated successfully' });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.put('/changeGenres', authenticateApiKey, async (req, res) => {
  const { id, genres } = req.body;
  try {
    let pwmClient = await new mongoClient(uri).connect();
    let result = await pwmClient
      .db("spotify")
      .collection("users").updateOne(
        { '_id': new ObjectId(id) },
        { $set: { 'favourite_genres': genres } }
      );

    if (result.modifiedCount === 0) {
      // Nessun documento è stato modificato, quindi la playlist non è stata trovata
      return res.status(404).send({ message: 'generi non aggiornati' });
    }
    res.status(200).send({ message: "Generi aggiornati correttamente" });
  } catch (error) {
    res.status(500).send({ message: "Errore durante l'aggiornamento dei generi" });

  }
});
app.put('/updatePlaylistFollowers/:playlistId/:followerId', authenticateApiKey, async (req, res) => {
  const playlistId = req.params.playlistId;
  const followerId = req.params.followerId;
  const action = req.query.action; // Legge l'azione dalla query string

  try {
    let pwmClient = await new mongoClient(uri).connect();

    const playlist = await pwmClient
      .db("spotify")
      .collection("public_playlists").findOne({ id: playlistId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    let updatedFollowers = playlist.followers || [];

    if (action === 'add') {
      updatedFollowers.push(followerId);
    } else if (action === 'remove') {
      const followerIndex = updatedFollowers.indexOf(followerId);
      if (followerIndex !== -1) {
        updatedFollowers.splice(followerIndex, 1);
      }
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await pwmClient
      .db("spotify")
      .collection("public_playlists").updateOne(
        { id: playlistId },
        { $set: { followers: updatedFollowers } }
      );

    if (result.matchedCount === 1) {
      return res.status(200).json({ message: 'Playlist updated successfully' });
    } else {
      return res.status(404).json({ message: 'Playlist not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.put('/updatePlaylist', authenticateApiKey, async (req, res) => {
  const { name, description, playlistId } = req.body;

  try {
    let pwmClient = await new mongoClient(uri).connect();
    let playlistsCollection = pwmClient
      .db("spotify")
      .collection("public_playlists");

    let playlist = await playlistsCollection.findOne({ id: playlistId });

    if (!playlist) {
      playlistsCollection = pwmClient
        .db("spotify")
        .collection("users");
      const userPlaylist = await playlistsCollection.aggregate([
        { $unwind: "$my_playlists" },
        { $match: { "my_playlists.id": playlistId } },
        { $project: { my_playlists: 1 } }
      ]).toArray();
      playlist = userPlaylist[0].my_playlists
    }

    let response;
    if (playlist.owner ?? "")
      response = await playlistsCollection.updateOne({ id: playlistId }, { $set: { name: name, description: description } });
    else
      response = await playlistsCollection.updateOne(
        { "my_playlists.id": playlistId },
        { $set: { "my_playlists.$.name": name, "my_playlists.$.description": description } }
      );

    if (response.modifiedCount === 0) {
      // Nessun documento è stato modificato, quindi la playlist non è stata trovata
      return res.status(404).send({ message: 'informazioni non aggiornate' });
    }
    res.status(200).send({ message: "Informazioni aggiornat3 correttamente" });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put("/movePlaylist/:id", authenticateApiKey, async (req, res) => {
  const playlistId = req.params.id;
  const userId = req.body.user_id
  const image = req.body.image
  const profile_name = req.body.profile_name
  const playlistType = req.body.type;
  try {

    const pwmClient = await new mongoClient(uri).connect();
    let insertedPlaylist, playlistToRemove, response
    // Trova e rimuovi la playlist dalla collezione "users"
    if (playlistType === 'private') {

      playlistToRemove = await pwmClient.db("spotify").collection("users").aggregate([
        { $unwind: "$my_playlists" },
        { $match: { "my_playlists.id": playlistId } },
        { $project: { my_playlists: 1 } }
      ]).toArray();
      let playlist = playlistToRemove[0].my_playlists
      if (playlist.id !== null) {
        // Rimuovi la playlist dalla collezione "users"
        response = await pwmClient.db("spotify").collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { my_playlists: { id: playlistId } } }
        );
        // Inserisci la playlist nella collezione "public_playlist"
        insertedPlaylist = await pwmClient.db("spotify").collection("public_playlists").insertOne({
          id: playlist.id,
          name: playlist.name,
          image: playlist.image,
          tracks: playlist.tracks,
          owner: {
            id: userId,
            image: image,
            profile_name: profile_name
          },
          followers: [],
          collaborative: false,
          tags: playlist.tags,
          description: playlist.description
        });
        if (insertedPlaylist.insertedId !== null) {
          res.status(200).json({ message: "Playlist spostata con successo." });
        } else {
          res.status(500).json({ message: "Errore durante lo spostamento della playlist." });
        }
      } else {
        res.status(404).json({ message: "Playlist non trovata." });
      }
    } else {
      playlistToRemove = await pwmClient.db("spotify").collection("public_playlists").findOneAndDelete(
        { id: playlistId }
      );
      if (playlistToRemove.value) {

        const { owner, followers, collaborative, ...playlistWithoutAttributes } = playlistToRemove.value;
        // Inserisci la playlist nella collezione "users"
        insertedPlaylist = await pwmClient.db("spotify").collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { my_playlists: playlistWithoutAttributes } }
        );

        if (insertedPlaylist.modifiedCount > 0) {
          res.status(200).json({ message: "Playlist spostata con successo." });
        } else {
          res.status(500).json({ message: "Errore durante lo spostamento della playlist." });
        }
      } else {
        res.status(404).json({ message: "Playlist non trovata." });
      }
    }

  } catch (error) {
    res.status(500).json({ message: "Errore durante lo spostamento della playlist." });
  }
});
app.put("/setCollaborative/:id", authenticateApiKey, async (req, res) => {
  const playlistId = req.params.id;
  const collaborative = req.body.collaborative;
  try {
    const pwmClient = await new mongoClient(uri).connect();

    let response = await pwmClient
      .db("spotify")
      .collection("public_playlists")
      .updateOne(
        { "id": playlistId },
        { $set: { "collaborative": collaborative } }
      )
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Aggiornamento riuscito." });
    } else {
      res.status(500).json({ message: "Errore nell'aggiornamento." });
    }
  } catch (error) {
    res.status(500).json({ message: "Errore nell'aggiornamento." });
  }
});

app.post("/updateInfo", authenticateApiKey, async (req, res) => {
  let id = req.body.id;
  let name = req.body.name;
  let surname = req.body.surname;
  let profile_name = req.body.profile_name;
  try {
    let pwmClient = await new mongoClient(uri).connect();
    let update = await pwmClient.db("spotify").collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, surname, profile_name } }
    )
    await pwmClient.db("spotify").collection('public_playlists').updateMany(
      { "owner.id": id },
      { $set: { "owner.profile_name": profile_name } }
    )
    if (update.modifiedCount === 1) {
      res.status(200).json({ message: "Informazioni utente aggiornate con successo." });
    } else {
      res.status(404).json({ message: "Utente non trovato." });
    }
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'aggiornamento delle informazioni utente." });
  }
});

// Cambia la password dell'utente
app.post("/changePassword", authenticateApiKey, async (req, res) => {
  let id = req.body.id;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;
  try {
    const pwmClient = await new mongoClient(uri).connect();
    const user = await pwmClient
      .db("spotify").collection('users').findOne({ _id: new ObjectId(id) });
    if (user.password === hash(oldPassword)) {
      user.password = hash(newPassword);
      let update = await pwmClient.db("spotify").collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: user.password } }
      )
      res.status(200).json({ message: "Password cambiata con successo." });
    } else {
      res.status(400).json({ message: "Vecchia password errata." });
    }
  } catch (error) {
    res.status(500).json({ message: "Errore durante il cambio password." });
  }
});

// Elimina il profilo dell'utente
app.delete("/deleteProfile/:id", authenticateApiKey, async (req, res) => {
  const userId = req.params.id;
  try {
    const pwmClient = await new mongoClient(uri).connect();
    const user = await pwmClient
      .db("spotify").collection('users').findOneAndDelete({
        _id: new ObjectId(userId),
      });
    res.status(200).json({ message: "Profilo eliminato con successo." });
  } catch (error) {
    res.status(500).json({ message: "Errore durante l'eliminazione del profilo." });
  }
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

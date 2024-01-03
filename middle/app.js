const express = require('express');
const app = express();
const cors = require("cors");
var  corsOptions = { origin: '*'}
require('dotenv').config();

// Import API route handlers
const spoty = require('./api/spotify/fplaylist');
const deezer = require('./api/deezer/main');
const downloading = require('./api/download/main');
const generate = require('./api/download/link');

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// API endpoints
app.get('/api/spotify/fplaylist/:id/:offset', spoty.getPlaylist);
app.get('/api/download/track/:id', downloading.dlTrax);
app.get('/api/download/status/:id', downloading.statusTrax);
app.post('/api/download/link', generate.dlGen);
app.post('/api/deezer/main', deezer.deezerSearch);


// Start server
const port = 8800;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

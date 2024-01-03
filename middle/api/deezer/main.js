// ------------------------------------------
// Deezer : Main Script Logic
// ------------------------------------------
const axios = require('axios');

// Look for the song on Deezer
const searchSongFromAPI = async (data) => {
    let { title, album, artist, duration } = data;
    console.log(data);
    if (Array.isArray(artist)){ // Multiple artists ? Pick the first one for searching
        artist = artist[0];
    }
    album = album.replace(/[\u0250-\ue007]/g, '').length > 3 ? album.replace(/[\u0250-\ue007]/g, '') : album;
    title = title.replace(/[\u0250-\ue007]/g, '').length > 3 ? title.replace(/[\u0250-\ue007]/g, '') : title;
    artist = artist.replace(/[\u0250-\ue007]/g, '').length > 3 ? artist.replace(/[\u0250-\ue007]/g, '') : artist;
    // Duration should be provided in seconds
    const api_url = `https://api.deezer.com/search?q=artist:"${artist}"%20track:"${title}"%20album:"${album}"%20dur_max:"${Math.floor(duration+10)}"`;
    console.log(api_url)

    const response = await axios({
        method: 'get',
        url: api_url,
        withCredentials: false,
    });
    let song;
    if (response.data.data) {
    if (response.data.data.length > 0)
        {
            song = response.data.data[0];
            const song_id = `${song.id}`;
            return song_id;
        }
    else
        return 69;
    } else return 420;
}

const deezerSearch = async (req, res) => {
    console.log("call");
    try {
        const id = await searchSongFromAPI(req.body);
        console.log(id);
        switch (id) {
            case 69:
                res.send({error: "Song not found"});
                break;
            case 420:
                res.send({error: "Error while fetching the deezer API"});
                break;
            default:
                res.send({id: id});
                break;
        }
    } catch (e) {
        console.error(e);
        res.status(500).send('Error while searching the song on Deezer : ' + e.message);
    }
}

module.exports = {
    deezerSearch
};
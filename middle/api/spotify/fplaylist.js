// ------------------------------------------
// SPOTIFY : Fetch Trax info from Playlist
// ------------------------------------------

const token = require('./gentoken');
const axios = require('axios');

const getSpotifyPlaylist = (pl_id, offset=0) => {
    const api_url = `https://api.spotify.com/v1/playlists/${pl_id}/tracks?limit=${process.env.SPO_API_LIMIT}&offset=${offset}`;
    
    return token.gen().then(
        token => {
            if (token.access_token){
                return axios.get(api_url, {
                    headers: { 'Authorization': `Bearer ${token.access_token}` }
                }).then(r=>r.data)
                .catch(e=>{throw new Error("Playlist Fetch ERR : " + e.message)})
		}
            else {
		console.log(token);}
    }).catch((e)=>{console.error(e);})

}

const getPlaylist = async (req, res) => {
    let { id, offset } = req.params;
    if(!offset) offset = 0;
    try {
        const playlist = await getSpotifyPlaylist(id, offset);
        res.json(playlist);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error retrieving playlist from Spotify : ' + e.message);
    }
}

module.exports = {
    getPlaylist
};

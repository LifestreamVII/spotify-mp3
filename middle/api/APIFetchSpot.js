import axios from 'axios';

async function getPlaylistTracks(playlistUrl, token="", limit = 12, offset = 0) {
  const accessToken = token; // spotify token
  const playlistId = new URL(playlistUrl).pathname.split('/').pop(); // playlist ID from URL
  const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return {
      items:
      response.data.items.map(item => {
      const { name, artists, album, id } = item.track;
      return {
        artist: artists.map(artist => artist.name),
        title: name,
        year: album.release_date,
        duration: item.track.duration_ms/1000,
        cover: album.images[0].url,
        id: id
      }
      }),
      next: response.data.next
    }
  } catch (err) {
    console.log("no");
    console.error(err);
    throw err;
  }
}

export default getPlaylistTracks
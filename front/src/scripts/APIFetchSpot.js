import axios from 'axios';

async function getPlaylistTracks(playlistUrl, offset = 0) {
  const playlistId = new URL(playlistUrl).pathname.split('/').pop(); // playlist ID from URL
  const apiUrl = `/api/spotify/fplaylist/${playlistId}/${offset}`;
  try {
    const response = await axios.get(apiUrl);
    return {
      items:
      response.data.items.map(item => {
      const { name, artists, album, id } = item.track;
      return {
        artist: artists.map(artist => artist.name),
        title: name,
        album: album.name,
        year: album.release_date,
        duration: item.track.duration_ms/1000,
        cover: album.images[0].url,
        id: id
      }
      }),
      next: response.data.next
    }
  } catch (err) {
      console.error(err);
      throw err;
  }
}

export default getPlaylistTracks

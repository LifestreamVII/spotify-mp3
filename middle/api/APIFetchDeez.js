// is this song on deezer ? (title, artist, year, duration)
import axios from 'axios';

const searchSongFromAPI = async (data) => { // Look for the song on Deezer
    let { title, artist, year, duration } = data;
    if (typeof artist === Array){ // Multiple artists ? Pick the first one
        artist = artist[0];
    }
    // Duration should be provided in seconds
    const apiUrl = `https://api.deezer.com/search?q=${title} ${artist}`;
    try {
      const response = await axios({
        method: 'get',
        url: apiUrl,
        withCredentials: false,
      });
      let song;
      if (response) {
        console.log(response);
        song = response.data.data.map(s => {
          if (Math.abs( duration - s.duration ) < 10 || Math.abs( duration - s.duration ) < -10)
            return s; // Difference allowed in duration of 10 seconds more or 10 seconds less
          else
            return null; // Song likely doesn't exist on Deezer
        });
      } else throw new Error ("Error while fetching API");
      if (song[0]) {
        const songUrl = `${song[0].id}`;
        return songUrl;
      } else {
        throw new Error('Song not found');
      }
    } catch (err) {
      throw new Error(err.message);
    }
}
  
export default searchSongFromAPI;
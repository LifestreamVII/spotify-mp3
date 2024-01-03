// is this song on deezer ? (title, artist, year, duration)
import axios from 'axios';

const searchSongFromAPI = async (data) => { // Look for the song on Deezer
    let { title, artist, album, duration } = data;
    if (typeof artist === Array){ // Multiple artists ? Pick the first one
        artist = artist[0];
    }
    // Duration should be provided in seconds
    const apiUrl = `/api/deezer/main`;
    try {
      return axios.post(apiUrl, {title, artist, album, duration}).then((r)=>{
        if(r.data.id)
          return r.data.id;
        else if(r.data.error)
        {
          throw new Error("Server response : " + r.data.error);
        }
      });
    }
    catch(e){
      throw new Error(e);
    }
}
  
export default searchSongFromAPI;

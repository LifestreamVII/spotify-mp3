import {useState, useEffect} from 'react';
import TrackResult from './TrackResult';
import Loading from './Loading';
import { getUserHistory } from '../scripts/UserHistory';
import getPlaylistTracks from '../scripts/APIFetchSpot';

const Home = () => {

  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(null);
  const [dlHistory, setDlHistory] = useState(null);

  useEffect(() => {
    getUserHistory().then((r)=>setDlHistory(r));
  }, []);

  const fetchData = () => {
    if (url.length > 1 ) {
      setLoading({status: "Loading", type: "pending"});
      const playlistUrl = url;
      setOffset(offset+12);
      getPlaylistTracks(playlistUrl, offset)
      .then((response) => {
        setData(response.items);
        setLoading(null);
      })
      .catch((e)=>{
        setLoading({status: "Unable to fetch playlist", type: "error"});
        console.error(e.message);
      })
    }
  }

  return (
    <div className="app">
      <link rel="stylesheet" href="app.css" />
      <link rel="stylesheet" href="grid.css" />
        <div className="server-status-cont">
          <div className="server-status">
            <div className="status">
                <span>Service Available</span>
                <span>Ready to download</span>
            </div>
            <div className="icon">
                <div className="checkmark">
                    <i>✔️ </i>
                </div>
            </div>
          </div>
        </div>
        <div className="containter downloader">
            <div className="row">
              <button onClick={fetchData}>Fetch Data</button>
              <div className="col-12 col-md-5 linkinput-cont">
                  <div className="logo">
                      <span>Spotify</span>
                      <span>Downloader</span>
                  </div>
                  <div className="linkinput">
                      <input type="url" name="" value={url} onChange={e => setUrl(e.target.value)} placeholder="Playlist URL" id="" />
                  </div>
                  <div className="linktype">
                      <input defaultChecked value="" name="linkurl" type="radio" id="linkurl"/> Playlist URL
                      <input type="radio" value="" name="linkartist" id="linkartist"/> Artist - Title
                  </div>
              </div>
            </div>
            <ul className="row result-list">
                {loading ? (
                  <Loading status={loading}/>
                ) : (
                  data && dlHistory ? (
                    data.map((item, index) => 
                    dlHistory.find(i => i.trackID === item.id) ? 
                    <TrackResult image={item.cover} history={true} data={item} updLoading={setLoading}/>
                    :
                    <TrackResult image={item.cover} data={item} updLoading={setLoading}/>
                    )) : ""
                )}
            </ul>
        </div>

      <div className="tasks">
        <ul>
        </ul>
      </div>
    </div>
  );
}

export default Home;

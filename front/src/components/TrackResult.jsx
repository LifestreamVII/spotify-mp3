import {useState, useEffect} from 'react';
import ColorThief from 'colorthief';
import { setUserHistory } from '../scripts/UserHistory';
import { setDownloadToken } from '../scripts/UserToken';
import searchSongFromAPI from '../scripts/APIFetchDeez';
import generateLink from '../scripts/GenerateLink';
import {downloadFromURL, getStatus, blobDL} from '../scripts/Downloading';

import "./tag.css";

const TrackResult = ({ data, history=false, image, updLoading }) => {
    
    let interval;
    let songId;
    let stat = {};

    const Download = () => {
      if (true){
          updLoading({status: "Saving History", type: "pending"});
          setUserHistory({
              trackID:data.id,
              trackTitle:data.title,
              trackArtist:data.artist,
              type:"single"
          }).then(()=>{
              updLoading({status: "Please wait", type: "pending"});
              searchSongFromAPI(data).then(r => {
                  console.log(r);
                  if (typeof r === "string" || typeof r === "number"){
                      updLoading({status: "Music Found. Downloading", type: "notice"});
                      downloadFromURL(r).then((e)=>{
                          if (e.statusUrl){
                              const int = setInterval(() => {
                                  getStatus(e.statusUrl).then((status)=>{
                                      console.log(status);
                                      updLoading({status: "Downloading : "+Math.floor(status.current*100)+"%", type: "pending"});
                                      if (status.current===100 || status.state === "SUCCESS")
                                      {
                                          if (status.token) { console.log (status.token); }
                                          updLoading({status: "Saving Token", type: "pending"});
                                          setDownloadToken(status.token).then(()=>{
                                              updLoading({status: "Server DL Done : "+status.current+"%", type: "notice"});
                                              clearInterval(int);
                                              setTimeout(() => {
                                                  updLoading({status: "Requesting DL Link...", type: "pending"});
                                                  generateLink({song: r, token: status.token}).then(blob => {
                                                      updLoading({status: `Begin Download...`, type: "notice"});
                                                      blobDL(blob, data.artist+" - "+data.title);
                                                      setTimeout(() => {
                                                        updLoading(null);
                                                      }, 2000);
                                                  })
                                              }, 2000);
                                              return true;
                                          })
                                      }
                                  })
                              }, 450);
                          } else { throw new Error("Couldn't get status"); }
                      })
                      .catch((e)=>{
                          throw new Error(e.message);
                      })
                  }
              }).catch(e=>{
                  updLoading({status: e.message, type: "error"});
                  setTimeout(() => {
                      updLoading(null);
                  }, 2000);
              })
          });
      }
  }
    const [gradient, setGradient] = useState(false);

    const colorthief = (event) => {
        const thumbnail = event.target;
        const colorThief = new ColorThief();
        const dominantColors = colorThief.getPalette(thumbnail, 2);
        setGradient(`linear-gradient(to right, rgb(${dominantColors[0][0]}, ${dominantColors[0][1]}, ${dominantColors[0][2]}), rgb(${dominantColors[1][0]}, ${dominantColors[1][1]}, ${dominantColors[1][2]}))`);
    }

    return (
        <div className={`col-12 col-md-6 tag${history ? " history" : ""}`} style={gradient ? {background: gradient} : {}}>
            <div className="tag-overlay-wrapper">
                <div className="tag-overlay" style={{background: `url(${image}) 0% 50%`}}></div>
            </div>
            <div className="scanlines"></div>
            <div className="result-data">
                <div className="result-name">
                <span>{data.title}</span>
                </div>
                <div className="result-artist">
                    {
                        data.artist.map((item) => 
                            <span>{item} - </span>
                        )
                    }
                    {
                        history ? (
                            <span className='history-indicator'>Downloaded</span>
                        )
                        : ""
                    }
                </div>
            </div>
            <div className="result-cover">
                <button className="dlButton" onClick={()=>Download(data)}>↓</button>
                <img src={image} crossOrigin="anonymous" alt="" onLoad={colorthief} />
            </div>
        </div>
    )
}

export default TrackResult

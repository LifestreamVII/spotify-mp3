<p align="center">
  <a href="" rel="noopener">
 <img src="https://i.imgur.com/rSC3xdc.jpeg" alt="Project header"></a>
</p>
<h1 align="center">Spotify MP3 Grabber (experiments)</h1>

<div align="center">
<h3 align="center">API running on Flask & Celery in a Docker container to deliver MP3 files from various Spotify links</h3>
<p align="center">The API will look for the song on Deezer's database and download it using the Deemix CLI script.</p>
</div>

---

<br>

## ⚙️ What's next ?

- <b>✅ Spotify Link as input (currently needs a Deezer ID)</b>
- <b>🔄 Integrate Spotify functionalities (track/album/playlist/artist links)</b>
- <b>🔄 Graphics / Visual Presentation</b>
- <b>Error Management and Optimization</b>
- <b>User Options</b>
- <b>Migration to Node/Express Server</b>
- <b>Integration to the future Stellar Project</b>

<br>

## Installation

`sudo docker-compose up -d --build`

Server hosted at localhost:31521

<br>

## Credits

- Flask + Celery Documentation and Examples for reference
- Deemix Team for the <a href="https://deemix.app/" target="_blank">deemix downloader</a>

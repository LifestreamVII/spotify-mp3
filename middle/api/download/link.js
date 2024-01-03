// --------------------------------------
// FLASK-CELERY : Generate Download Link
// --------------------------------------

const axios = require('axios');

const download = (data) => {
    const api_url = `http://192.168.8.30:3070/api/download`;
    return axios.get(api_url, {
        params: {
          song: data.song,
          key: data.key,
          token: data.token,
        },
      })
        .then((r)=>{
            return r.data;
        })
        .catch(e=>{
            throw new Error("Generating Link ERR : " + e.response.data.message)
        })
}

const dlGen = async (req, res) => {
    try {
      const downloading = await download(req.body);
      
      // Now, let's download the music file using Axios
      const musicFileResponse = await axios.get(downloading.url, {
        responseType: 'stream',
      });
  
      // Set the appropriate response headers to indicate the file type and that it should be downloaded by the client
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${downloading.filename ?? "track0.mp3"}"`);
      
      // Pipe the music file data to the response
      musicFileResponse.data.pipe(res);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  };

module.exports = {
    dlGen,
};

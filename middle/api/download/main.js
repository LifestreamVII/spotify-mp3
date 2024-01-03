// ------------------------------------------
// FLASK-CELERY : Downloading Found Song
// ------------------------------------------

const axios = require('axios');

const download = (id) => {
    const api_url = `http://192.168.8.30:3070/api?value=${id}`;    
    return axios.get(api_url)
        .then((r)=>{
            // const int = setInterval(() => {
            //     return axios.get(`http://nanopro2307qbt.airdns.org:43803${r.data.statusUrl}`)
            //     .then((status)=>{
            //         console.log(status)
            //         if (status.data && status.data.result === 42) 
            //             {
            //                 clearInterval(int);
            //                 return status.data.status;
            //             }
            //     })
            // }, 900)
            return r.data;
        })
        .catch(e=>{throw new Error("Song Download ERR : " + e.message)})
}

const get_status = (id) => {
    const api_url = `http://192.168.8.30:3070/status/${id}`;
    return axios.get(api_url)
        .then(r=>r.data)
        .catch(e=>{throw new Error("Couldn't get status : " + e.message)})
}

const dlTrax = async (req, res) => {
    const { id } = req.params;
    try {
        const downloading = await download(id);
        res.json(downloading);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server ERR while downloading');
    }
}

const statusTrax = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const status = await get_status(id);
        res.json(status);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error while fetching status : ' + e.message);
    }
}

module.exports = {
    dlTrax,
    statusTrax
};

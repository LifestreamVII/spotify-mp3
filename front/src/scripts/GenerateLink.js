import crypto from 'crypto';
import axios from 'axios';

const secretKey = process.env.REACT_APP_SECRET_KEY;

const generateLink = async (payload) => { // generate DL Link
    try {
        const hash = crypto.createHash('sha256');
        console.log(secretKey);
        hash.update(payload.song + secretKey);
        const t = hash.digest('hex');
        console.log(t);
        const apiUrl = `/api/download/link`;
        if (t){
            return axios.post(apiUrl, {song: payload.song, key: t, token: payload.token}, {responseType: "blob"}).then((r)=>{
                if(r.data){
                    return r.data;
                }
                else if(r.data.error)
                {
                    throw new Error("Server response : " + r.data.error);
                }
                });
        }
    }
    catch(e){
        throw new Error(e);
    }
}

export default generateLink;


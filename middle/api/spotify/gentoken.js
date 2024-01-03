// ------------------------------------------
// SPOTIFY : Generate Token
// ------------------------------------------

const axios = require("axios");

const token_gen = () => {

    const client_id = process.env.SPO_CL;
    const client_secret = process.env.SPO_SE;
    const auth_str = `${client_id}:${client_secret}`;
    const enc_auth = Buffer.from(auth_str).toString("base64");

    return axios
        .post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
            headers: {
            Authorization: `Basic ${enc_auth}`,
            },
        }
        )
        .then(response => response.data)
        .catch(error => error);
};

exports.gen = token_gen
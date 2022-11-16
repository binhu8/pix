if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}


const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');



const cert = fs.readFileSync(
    path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
)

const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
});

const credentials = Buffer.from(`${"Client_Id_0e53e633ef68173f440dc96bb707c70140658065"}:${"Client_Secret_d053b09fc5c8a4fe6ccc9c40e5daa6cbc71c7f59"}`).toString('base64')

const authenticate = ()=> {
     return axios({
        method: 'POST',
        url: `${process.env.GN_ENDPOINT}/oauth/token`,
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json'
        },
        httpsAgent: agent,
        data: {
            grant_type: 'client_credentials'
        }
    })
}

const GNRequest = async () => {
    const accessToken = await authenticate()
    
    return axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken.data?.access_token}`,
            'Content-Type': 'application/json'
        }
    });
}

module.exports = GNRequest
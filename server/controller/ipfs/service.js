const axios = require('axios'); // Importing the axios library for making HTTP requests
const qs = require('qs'); // Importing the qs library for serializing request data
const crypto = require('crypto'); // Importing the crypto module for hashing

const multihashes = require('multihashes'); // Importing the multihashes library for encoding and decoding multihashes

module.exports = {
    // Function to pin JSON data to IPFS
    pinJSONToIPFS(data) {
        let config = {
            method: 'post', // HTTP method set to POST
            maxBodyLength: Infinity, // Maximum allowed request body length
            url: 'https://api.filebase.io/v1/ipfs/pins', // IPFS API endpoint URL
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Request content type
                'Authorization': 'Bearer MzhFNjYxOURFRTkxODE4MTg2RjY6N1FYbFFxVzh4enlxV3F2bTA0RWFjQmtxWHhtcUJsbElIdjQ1ck9IVDpkZW1hLXJlcHV0YXRpb24=', // Authorization token
            },
            data: (data) // Data to be pinned to IPFS
        };
        return new Promise((resolve, reject) => {
            axios.request(config) // Making a request to pin the JSON data to IPFS
                .then((response) => {
                    resolve(response.data); // Resolving the promise with the response data
                })
                .catch((error) => {
                    reject(error); // Rejecting the promise with the error
                });
        });
    },
    // Function to retrieve data from IPFS using the object key
    gateway(objectkey) {
        let config = {
            method: 'get', // HTTP method set to GET
            maxBodyLength: Infinity, // Maximum allowed request body length
            url: 'https://api.filebase.io/v1/ipfs/pins/' + objectkey, // IPFS API endpoint URL with object key
            headers: {
                'Authorization': 'Bearer MzhFNjYxOURFRTkxODE4MTg2RjY6N1FYbFFxVzh4enlxV3F2bTA0RWFjQmtxWHhtcUJsbElIdjQ1ck9IVDpkZW1hLXJlcHV0YXRpb24=' // Authorization token
            }
        };
        return new Promise((resolve, reject) => {
            axios.request(config) // Making a request to retrieve data from IPFS
                .then((response) => {
                    resolve(response.data); // Resolving the promise with the response data
                })
                .catch((error) => {
                    reject(error); // Rejecting the promise with the error
                });
        });
    },
    // Function to generate a CID (Content Identifier) for a given content
    async generateCID(content) {
        const hash = crypto.createHash('sha256').update(content).digest(); // Creating a SHA256 hash of the content
        const multihash = multihashes.encode(hash, 'sha2-256'); // Encoding the hash using 'sha2-256' algorithm
        const cid = multihashes.toB58String(multihash); // Converting the multihash to a base58-encoded CID string
        return cid; // Returning the generated CID
    },
};

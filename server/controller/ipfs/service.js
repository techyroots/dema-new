// Load environment variables from .env file
const dotenv = require("dotenv");
dotenv.config();

// Load AWS SDK and fs module
const AWS = require('aws-sdk');
const fs = require('fs');

//Retrieve values from .env file which is required.
const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const endpoint = process.env.endpoint;
const bucketName = process.env.bucketName;


module.exports = {
    /**
     * Uploads a JSON object to an S3 bucket and returns a Promise that resolves to the data
     * @param {string} objectKey - the key for the S3 object
     * @param {string} filename - the name of the file containing the JSON object
     * @returns {Promise<object>} a Promise that resolves to the uploaded data
     */
    pinJSONToIPFS (objectKey, filename) {
        console.log(objectKey)
        return new Promise((resolve, reject) => {
            // Initialize the S3 client
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
            // Set the upload parameters
            const uploadParams = {
                Bucket: bucketName,
                Key: objectKey,
                Body: fs.readFileSync(`./${filename}`),
                ContentType: 'application/json',
            };
            // Upload the file to S3
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                  console.log('Error:', err);
                  reject(err);
                } else {
                  resolve(data);
                }
            });
        })
    },
    /**
     * Retrieves a JSON object from an S3 bucket and returns a Promise that resolves to the object
     * @param {string} objectKey - the key for the S3 object
     * @returns {Promise<string>} a Promise that resolves to the retrieved object as a string
     */
    gateway(objectKey) {
        return new Promise((resolve, reject) => {
            // Initialize the S3 client
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
             // Retrieve the file from S3
            s3.getObject({Bucket: process.env.bucketName, Key: objectKey}, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);;
                }else{
                    resolve(data.Body.toString());
                }              
            });
        })
    },
    /**
     * Retrieves a pre-signed URL for downloading a file from an S3 bucket and returns a Promise that resolves to the URL
     * @param {string} objectKey - the key for the S3 object
     * @returns {Promise<string>} a Promise that resolves to the pre-signed URL
     */
    getImageURL(objectKey){
        return new Promise((resolve, reject) => {
            // Initialize the S3 client
            const s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
            // Generate a pre-signed URL for the file
            s3.getSignedUrl("getObject", { Bucket: bucketName, Key: objectKey, Expires: 3600 }, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);;
                }else{
                    resolve(data);
                }              
            });
        })
    }
}

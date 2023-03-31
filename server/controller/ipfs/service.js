const dotenv = require("dotenv");
dotenv.config();
const AWS = require('aws-sdk');
const fs = require('fs');
const accessKeyId = process.env.accessKeyId;
const secretAccessKey = process.env.secretAccessKey;
const endpoint = process.env.endpoint; // e.g. "https://gateway.storj.io"
const bucketName = process.env.bucketName;



module.exports = {
    pinJSONToIPFS (objectKey, filename) {
        console.log(objectKey)
        return new Promise((resolve, reject) => {
            var s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
            const uploadParams = {
                Bucket: bucketName,
                Key: objectKey,
                Body: fs.readFileSync(`./${filename}`),
                ContentType: 'application/json',
            };
 
            s3.upload(uploadParams, (err, data) => {
                if (err) {
                  console.log('Error:', err);
                  reject(err);
                } else {
                //   console.log('Successfully uploaded:', data, data.Location);/
                  resolve(data);
                }
            });
        })
    },
    gateway(objectKey) {
        console.log(objectKey,"objectKey")
        return new Promise((resolve, reject) => {
            var s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
            s3.getObject({Bucket: process.env.bucketName, Key: objectKey}, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);;
                }else{
                    // console.log(data.Body.toString());
                    resolve(data.Body.toString());
                }              
            });
        })
    },
    getImageURL(objectKey){
        return new Promise((resolve, reject) => {
            var s3 = new AWS.S3({
                accessKeyId,
                secretAccessKey,
                endpoint,
                s3ForcePathStyle: true,
            });
            s3.getSignedUrl("getObject", { Bucket: bucketName, Key: objectKey, Expires: 3600 }, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);;
                }else{
                    // console.log(data.Body.toString());
                    resolve(data);
                }              
            });
        })
    }
}

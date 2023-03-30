var axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const accessKeyId = 'jw4zjxvbpbbwqbnxp5dqxyrdkyeq';
const secretAccessKey = 'jzw5fdh3y2hljbmxixden3krvxgilyvc5uaz3md55bvytyhcld3de';
const endpoint = 'https://gateway.storjshare.io'; // e.g. "https://gateway.storj.io"
const bucketName = 'demo-bucket';



module.exports = {
    pinJSONToIPFS (objectKey) {
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
                Body: fs.readFileSync('./data.json'),
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

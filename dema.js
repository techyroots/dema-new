const express = require('express');
const bodyparser = require("body-parser");
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 7777

// support parsing of application/json type post data
app.use(bodyparser.json());
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended: true }))

app.use('/', require('./server/routes/router'));

// const sslServer = https.createServer(
//     {
//       key: fs.readFileSync("./ssl/techyroots_com_06_01_2023.key"),
//       cert: fs.readFileSync("./ssl/crtificate06_01_2023.crt"),
//     },
//     app
//   )
// sslServer.listen(PORT,() => console.log('RUNING SSL NODE ON AWS ON PORT 7777...'));

app.listen(PORT, () => { console.log(`Server is running on http://techyroots.com:${PORT}`) });
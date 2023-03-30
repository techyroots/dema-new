const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./server/routes/router'));

app.listen(PORT, () => {
  console.log(`Server is running on ${path.join('http://techyroots.com', String(PORT))}`);
});

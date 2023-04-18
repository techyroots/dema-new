// Import required modules
const express = require('express');
const bodyparser = require("body-parser");
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Create an Express app instance
const app = express();

app.use('/dema', express.static('public'))

// Enable CORS for all routes
app.use(cors());


// app.get('/*', (req,res)=>{
//   res.sendFile(path.join(__dirname, "public/index.html"));
// })

// Define the server port
const PORT = process.env.PORT || 7777;

// Middleware to parse incoming JSON data
app.use(bodyparser.json());

// Middleware to parse URL-encoded data
app.use(bodyparser.urlencoded({ extended: true }));

// Import and use the router for handling incoming requests
app.use('/api', require('./server/routes/router'));

// Start the server and listen to the defined port
app.listen(PORT, () => { console.log(`Server is running on http://localhost.com:${PORT}`) });





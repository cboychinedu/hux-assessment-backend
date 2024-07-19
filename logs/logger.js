// Importing the necessary modules 
const fs = require('fs'); 
const path = require('path'); 

// Create a write stream (in append mode) for the log file 
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'requests.log'),
    { flags: 'a' }
)

// Exporting 
module.exports.accessLogStream = accessLogStream; 
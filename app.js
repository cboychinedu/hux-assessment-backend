/**
 * Author: Engr Mbonu Chinedum E
 * Description: Hux assessment backend
 * Date Create: 4/10/2023 
 * Date Modified: 4/10/2023
 */

// Importing the necessary modules 
const fs = require('fs'); 
const path = require('path'); 
const express = require('express'); 
const cookieParser = require('cookie-parser'); 
const cors = require('cors'); 
const session = require('express-session'); 
const mongodbSession = require('connect-mongodb-session')(session);
const mongodb = require('mongoose');
const fileupload = require('express-fileupload');
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const chalk = require('chalk'); 
const { accessLogStream } = require('./logs/logger'); 

// Loading the env variables 
require('dotenv').config(); 

// Create a write stream (in append mode) for the log file
// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, 'logs', 'requests.log'),
//     { flags: 'a' }
// );

// Setting the data base URI
const databaseURI = "mongodb://localhost:27017/hux_app";

// Saving the session into mongodb database 
const store = new mongodbSession({
    uri: databaseURI, 
    // collection: 'myNftSessions', 
}); 

// Connecting to the mongodb database
mongodb.connect(databaseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    // Connection details
    let databaseMessage = chalk.green("Connected to mongodb database server.")
    console.log(databaseMessage);
})
// On error
.catch((error) => {
    // On failure to connect to the database server
    console.log(error);
})

// Building the express application 
const app = express(); 

// Loading the hash file into memory
let hashFile = fs.readFileSync(path.join(__dirname, '/hash', 'hashFile.hs')); 
let expressSessionSecret = hashFile.toString().trim(); 

// Setting some necessary middlewares, and creating one 
// week session interval 
const oneWeekSession = 1000 * 60 * 60 * 7*24; 
app.use(session({
    secret: expressSessionSecret, 
    saveUninitialized: true, 
    resave: false, 
    store: store, 
    unset: 'destroy', 
    cookie: { maxAge: oneWeekSession }, 
})); 

// Setting some necessary middlewares 
app.use(fileupload())
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    credentials: true, 
    optionsSuccessStatus: 200, 
    allowedHeaders: [
        'Content-Type', 'Authorizaton', 
        'Access-Control-Allow-Methods', 
        'access-control-allow-orign', 
        'Access-Control-Allow-Origin', 
        'Access-Control-Allow-Headers', 
        'x-auth-token', 
    ]
})); 
app.use(bodyParser.json()); 
app.use(cookieParser()); 
app.use(express.json({limit: '50mb'})); 
app.use(express.static('static')); 
app.use(express.urlencoded({ extended: true, limit: '50mb'})); 
app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream }));

// Using the environment variable for the HOST, and PORT 
const PORT = process.env.PORT || 3001; 
const HOST = 'localhost'; 

// Importing the required routes 
const home = require('./routes/homeRoute'); 
const contacts = require('./routes/contactsRoute'); 


// Setting the routes configurations 
app.use('/', home); 
app.use('/contact', contacts)


// Running the nodejs server 
app.listen(PORT, HOST, () => {
    // Displaying the connection status 
    let serverMessage = chalk.green.bold(`The server is running on ${'http://'+ HOST + ':' + PORT}`)
    console.log(serverMessage);
})

// Importing the necessary modules 
const mongodb = require('mongoose'); 

// Creating the user's schema 
const userSchema = new mongodb.Schema({
    fullname: {type: String}, 
    emailAddress: { type: String}, 
    phoneNumber: { type: String}, 
    password: { type: String}, 
    date: { type: Date, default: Date.now}
})

// Creating the user collection 
const USERS = mongodb.model('users', userSchema); 

// Exporting the modules 
module.exports = { USERS }
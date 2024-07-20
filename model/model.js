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

// Creating a schema for the contacts 
const contactsSchema = new mongodb.Schema({
   emailAddress: { type: String}, 
   firstname: {type: String}, 
   lastname: { type: String }, 
   phoneNumber: { type: String },  
})

// Creating the user collection 
const USERS = mongodb.model('users', userSchema);
const CONTACTS = mongodb.model('contacts', contactsSchema);  

// Exporting the modules 
module.exports = { USERS, CONTACTS }
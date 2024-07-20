// Importing the necessary modules 
require('dotenv').config()
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const { CONTACTS } = require('../model/model'); 

// Creating the router object 
const router = express.Router(); 

// Getting the jwt key 
const jwtKey = process.env.jwtKey;

// Updating a contact 
router.post('/:id', async(req, res) => {
    // Using try catch block 
    try {
        // Getting the firstname, lastname, and phoneNumber 
        const { firstname, lastname, phoneNumber } = req.body; 

        const contact = await CONTACTS.findOne({
            "_id": req.params.id, 
        })

        // Updating the contact 
        const contactData = await CONTACTS.findOneAndUpdate({
            "_id": req.params.id
        }, {
            $set: {
                firstname: firstname || contact.firstname, 
                lastname: lastname || contact.lastname, 
                phoneNumber: phoneNumber || contact.phoneNumber, 
            }
        }); 

        // If the contact data exists on the database, execute the block 
        // of code below 
        if (contactData) {
            // Creating a success message 
            let successMessage = JSON.stringify({
                "message": "User information changed", 
                "status": "success", 
                "statusCode": 200, 
            }); 

            // Sending back the success message 
            return res.send(successMessage); 
        }

        // Else 
        else {
            // Creating an error message 
            let errorMessage = JSON.stringify({
                "message": "User information not found", 
                "status": "error", 
                "statusCode": 404, 
            })

            // Sending the error message 
            return res.send(errorMessage); 
        }
    }

    // Catch the error 
    catch (error) {
        // Creating the error message
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(),
            "status": "error",
            "statusCode": 500,
        });

        // Sending back the success message
        return res.send(errorMessage).status(500);

    }
})

// Creating a route for creating contacts 
router.post('/createContact', async(req, res) => {
    // Creating a contact using try catch block 
    try {
        // Searching the contacts data base to see if a contact with 
        // the first name already exists 
        let contacts = await CONTACTS.findOne({
            firstname: req.body.firstname
        }); 


        // If the contacts exits on the database execute the 
        // block of code below 
        if (contacts) {
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Contact with the firstname exists", 
                "status": "contacts-exist-on-db", 
                "statusCode": 404, 
            })

            // Sending the error message 
            return res.send(errorMessage); 
        }

        // Else if the contacts does not exist 
        else {
            // Getting the email address from the json web token 
            const tokenHeader = req.header('x-auth-token');  

            // Getting the jwt key 
            const jwtKey = process.env.jwtKey; 

            // Decode the token 
            let isMatched = jwt.decode(tokenHeader, jwtKey); 

            // Save the contact 
            const newContact = new CONTACTS({
                emailAddress: isMatched.email, 
                firstname: req.body.firstname, 
                lastname: req.body.lastname, 
                phoneNumber: req.body.phoneNumber, 
            })

            // Saving the new contacts on the database 
            await newContact.save(); 

            // Generating a success message 
            let successMessage = JSON.stringify({
                "message": "Contact newly saved", 
                "status": 'success', 
                "statusCode": 200
            })

            // Return the success message 
            return res.send(successMessage); 
        }
    }

    // Catch the error 
    catch (error) {
        // Execute this command if error was found while creating 
        // the cart 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(), 
            "status": "error", 
            "statusCode": 404, 
        }); 

        // sending back the error message 
        return res.send(errorMessage); 

    }
})

// Creating a route for retrieving a list of contacts 
router.get('/', async(req, res) => {
    // Using try catch block to get all contacts 
    try {
        // Getting the email address from the json web token 
        const tokenHeader = req.header('x-auth-token'); 

        // Getting the jwt key 
        const jwtKey = process.env.jwtKey; 

        // Decode the token 
        const isMatched = jwt.decode(tokenHeader, jwtKey); 

        // Getting all the contacts 
        const contacts = await CONTACTS.find({
            emailAddress: isMatched.email, 
        })

        // If the contacts are present 
        if (contacts) {
            // Creating a success message 
            let successMessage = JSON.stringify({
                "status": "success", 
                "message": "Contacts present", 
                "contactData": contacts, 
                "statusCode": 200, 
            }); 

            // Sending the contacts 
            return res.send(successMessage); 
        }

        else {
            // Creating a non-found message 
            let errorMessage = JSON.stringify({
                "status": "error", 
                "message": "Contacts not present", 
                "contactData": contacts, 
                "statusCode": 404, 
            }); 

            // Sending the empty contacts list 
            return res.send(errorMessage); 
        }
 
    }

    // Catch the error message 
    catch (error) {
        // Building the error message 
        // Getting the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(),
            "status": "error", 
            "stausCode": 500 

        }); 

        // Sending back the error message 
        return res.send(errorMessage); 
    }
})

// Creating a route for retrieving a single contact 
router.post('/:id', async(req, res) => {


})

// Exporting the contact route 
module.exports = router; 

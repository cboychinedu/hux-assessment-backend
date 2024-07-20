// Importing the necessary modules 
require('dotenv').config()
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const protectedRoute  = require('../auth/auth'); 
const { CONTACTS, USER } = require('../model/model'); 

// Creating the router object 
const router = express.Router(); 

// Getting the jwt key 
const jwtKey = process.env.jwtKey;

// Creating a route for retrieving a list of contacts 
router.get('/', protectedRoute, async(req, res) => {
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


// Updating a contact 
router.post('/update/:id', protectedRoute, async(req, res) => {
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
router.post('/createContact', protectedRoute, async(req, res) => {
    // Creating a contact using try catch block 
    try {
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

// Creating a route for deleting a single contact 
router.post('/delete/:id', protectedRoute, async (req, res) => {
    // USing try catch block 
    try {
        // Getting the contact from the specified id value 
        const contact = await CONTACTS.findOneAndDelete({
            _id: req.params.id, 
        })

        // IF the contact is found 
        if (contact) {
            // Create a success message 
            let successMessage = JSON.stringify({
                "message": "Contact deleted successfully", 
                "status": "success", 
                "statusCode": 200, 
            }); 

            // sending the success message 
            return res.send(successMessage); 
        }

        // else if the contact was not found 
        else {
            // Create and error message 
            let errorMessage = JSON.stringify({
                "message": "Contact not found", 
                "status": "error", 
                "statusCode": 404, 
            }); 

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

// Exporting the contact route 
module.exports = router; 

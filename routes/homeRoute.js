// Importing the necssary modules 
const express = require('express'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const { USERS } = require('../model/model');
require('dotenv').config()

// Creating the router object 
const router = express.Router(); 

// Creating a route for registering users
router.post('/register', async(req, res) => {
    // Using the try catch block to connect to the database 
    try {
        // Search the database to see if the user with the specified 
        // email address is registerd on the database
        let user = await USERS.findOne({
            emailAddress: req.body.emailAddress
        }); 

        // If the user exists on the database, execute the block 
        // of code below 
        if (user) {
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "The user with the email address is already registerd", 
                "status": "user-registered-error", 
                "statusCode": 404
            }); 

            // Sending the error message 
            return res.send(errorMessage); 
        }

        // Else if the email for the user was not found on the database, 
        // execute the block of code below 
        else {
            // Encrypt the password and create a salt hash 
            const salt = await bcrypt.genSalt(10); 
            const hashedPassword = bcrypt.hashSync(req.body.password, salt);

            // Saving the new registered user 
            const newUser = new USERS({
                fullname: req.body.fullname, 
                emailAddress: req.body.emailAddress, 
                phoneNumber: req.body.phoneNumber, 
                password: hashedPassword, 
            }); 

            // Saving the new user on the database
            await newUser.save(); 

            // Generating the success message 
            let successMessage = JSON.stringify({
                "message": "User newly registered", 
                "status": "success", 
                "statusCode": 200
            }); 

            // Return the success message 
            return res.send(successMessage); 
        }
    }


    // Catch the error 
    catch (error) {
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

// Creating a route for login in the registered users 
// Login route 
router.post('/login', async(req, res) => {
    // Searching the database to see if the user with the 
    // specified email address is registered on the database 
    try {
        // Get the user details 
        const user = await USERS.findOne({
            emailAddress: req.body.emailAddress 
        }); 

        // If the email address specified was found on the database, 
        // execute the block of code below 
        if (user) {
            // Get the user password, and the hashpassword 
            const userPassword = req.body.password; 
            const hashedPassword = user.password; 

            // Checking if the password hashed value is correct
            const isMatch = bcrypt.compareSync(userPassword, hashedPassword);

            // Getting the secret key 
            const jwtKey = process.env.jwtKey; 

            // Checking if the passwords are correct 
            if (isMatch) {
                // Create a JWT token 
                const token = jwt.sign({
                    email: user.emailAddress, 
                    isLoggedIn: true, 
                    id: user._id
                }, jwtKey, {
                    expiresIn: "30 days"
                });

                // Creating the success message 
                let successMessage = JSON.stringify({
                    "message": "Logged in successfully", 
                    "status": "success", 
                    "x-auth-token": token, 
                    "statusCode": 200, 
                }); 

                // Sending back the error message 
                return res.send(successMessage); 
            }

            // Else 
            else {
                // Create the error message 
                let errorMessage = JSON.stringify({
                    "message": "Invalid email or password", 
                    "status": "error", 
                    "statusCode": 401, 
                })

                // Sending the error message 
                return res.send(errorMessage); 
            }
 
        }

        // else if the user does not exists, 
        else {
            // Create the error message 
            let errorMessage = JSON.stringify({
                "message": "Invalid email or password", 
                "status": "error", 
                "statusCode": 401, 
            })

            // Sending the error message 
            return res.send(errorMessage);
        }
    }

    // Catch the error on connecting to the database, catch the error 
    catch (error) {
        // Create the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(), 
            "status": "error", 
            "statusCode": 500, 
        }); 

        // Sending back the error message 
        return res.send(errorMessage); 

    }
})


// Creating a route for the forgot password 
router.post('/forgotPassword', async(req, res) => {
    // Using try catch block to get the user 
    try{
        // Getting the user email 
        const user = await USERS.findOne({
            emailAddress: req.body.emailAddress
        }); 

        // Encrypt the new password and create a salt hash 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt); 

        // Updating the user's password 
        const userData = await USERS.findOneAndUpdate({
            "emailAddress": req.body.emailAddress
        }, {
            $set: {
                password: hashedPassword || user.password
            }
        });  

        // If the user data exists on the database, execute the 
        // block of code below 
        if (userData) {
            // Creating a success message 
            let successMessage = JSON.stringify({
                "message": "User password changed", 
                "status": "success", 
                "statusCode": 200, 
            }); 

            // Sending back the success message 
            return res.send(successMessage); 
        }

        // else if the user information was not found on the 
        // database, execute the block of code below 
        else {
            // Creating an error message 
            let errorMessage = JSON.stringify({
                "message": "User information not found", 
                "status": "error", 
                "statusCode": 404, 
            }); 

            // Sendng the error message 
            return res.send(errorMessage); 
        }
    }

    // Catch the eror 
    catch (error) {
        // Creating the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(), 
            "status": "error", 
            "statusCode": 500, 
        }); 

        // Sending back the success message 
        return res.send(errorMessage); 
    }
})


// Exporting the router 
module.exports = router; 
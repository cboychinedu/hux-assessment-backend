// Importing the necessary modules 
const jwt = require('jsonwebtoken'); 
require('dotenv').config()


// Creating a middleware for checking the user is logged in 
// by valiadating the jsonwebtoken 
const protectedRoute = async (req, res, next) => {
    // Getting the user's x-auth-token value and verify before accessing the 
    // route 
    try {
        // Getting the auth-token from the header 
        const tokenHeader = req.header("x-auth-token"); 

        // Getting the jwt key 
        const jwtKey = process.env.jwtKey; 

        // Verify the jsonweb token 
        let isMatched = jwt.decode(tokenHeader, jwtKey); 

        // if the user's is logged in 
        if (isMatched.isLoggedIn) {
            next(); 
        }

        else {
            // Create the error message 
            let errorMessage = JSON.stringify({
                "status": "error", 
                "body": "User not logged in", 
                "statusCode": 401, 
            }); 

            // Sending back the message 
            return res.send(errorMessage); 
        }
    }

    // Catching the error message 
    catch (error) {
        // Create the error message 
        let errorMessage = JSON.stringify({
            "status": "error",
            "body": error.toString().trim(), 
            "statusCode": 500, 
        })

        // Sending back the error message 
        return res.send(errorMessage); 
    }
}

// Exporting the protected route 
module.exports = protectedRoute; 
# hux-assessment-backend

- This repository contains the implementation of a simple user authentication API using Node.js, Express, JWT, and bcrypt.

## Features

- User Registration
- User Login
- Password Encryption
- JWT Token Generation for Authentication

## Technologies Used

- Node.js
- Express
- JWT (JSON Web Token)
- bcrypt.js
- MongoDB
- dotenv

## Endpoints

### Register a New User

**URL**: `/register`

**Method**: `POST`

**Request Body**:

```json
{
    "fullname": "John Doe",
    "emailAddress": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "password": "yourpassword"
}

```

**Error Response**
```json
{
    "message": "The user with the email address is already registered",
    "status": "user-registered-error",
    "statusCode": 404 
}
```

### Setup and Installation
 - Clone the repository: 

 ```bash
    git clone https://github.com/cboychinedu/hux-assessment-backend
    cd hux-assessment-backend

 ```

 - Install dependencies 
 ```bash
    npm install . 
 ```

 - Set up environment variables: 
    <p> Create a <b> .env </b> file in the root directory and add the following: </p>

 ```bash 
    jwtKey="2gUvU+Eabf+SQwcnDc-$$&*5YtsGCQ++-D7aR82e7e97c4caf95b-vZr7Lz+Kk3vXnckU8FbuRCJcP"
    serverIpAddress="192.168.43.95"
    encKey="40876"
 
 ```

 ## Dependencies 
 - express: Web framework for Nodejs 
 - jsonwebtoken: For generating and verifying JWT tokens
 - bcryptjs: For hashing passwords
 - dotenv: For managing environment variables
 - mongoose: For interacting with MongoDB


 ### Usage 
 - Use Postman or any API testing tool to interact with the API 
 - Register a new user using the "/register" endpoint 
 - Login with an existing user using the "/login" endpoint to receive a JWT token
 - Use the received JWT token for authenticated requests.


 ### License 
 <p> This project is licensed under the MIT License </p>
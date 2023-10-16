const express = require("express");
const app = express();

//Hashing

const bcrypt = require("bcrypt");

// hashing method
// password => my_secure_password
// salt => 10
 bcrypt.hash(process.env.password,process.env.salt, (err, hash) => {
    // the parameter hash represents the hashed password
    // hash => 2c9a8d02fc17ae77e926d38fe83c3529d6638d1d636379503f0c6400e063445f
    console.log('------------------------------------');
    console.log(process.env.salt);
    console.log('------------------------------------');
  });

let hashedPassword =12345678
  // comparing method
bcrypt.compare(process.env.password, hashedPassword, (err, result) => {
    // result will be a boolean depending on whether the hashedPassword is made using the password provided
console.log('------------------------------------');
console.log(hashedPassword);
console.log('------------------------------------'); 
});

// Environment variables

// 1- .env file to hold the information, make sure to add it to .gitignore

/*
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASS=123456
SECRET=kjhfdshk124oip
*/

// 2 - JavaScript file

require("dotenv").config();

//getting the value from the environment, same way is used to access variables that are set by using the operating system
console.log(process.env.DATABASE_HOST); // => localhost
console.log(process.env.SECRET); // => kjhfdshk124oip

// JSON Web Token (JWT)

const jwt = require("jsonwebtoken");

// getting environment variables
const SECRET = process.env.SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

// generating a new token
const generateToken = () => {
  // the payload that will be sent to the client-side
  const payload = {
    id: 1,
    permissions: ["r", "w"],
    type: "user",
  };
  const options = {
    expiresIn: TOKEN_EXPIRATION,
  };
  return jwt.sign(payload, SECRET, options);
};
const authenticateToken = (token) => {
    // verifying the token by using the secret key
    const parsedToken = jwt.verify(token, SECRET);
    // checking if the information in the parsed token exist in the database
  };

const PORT = 3000;
app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));

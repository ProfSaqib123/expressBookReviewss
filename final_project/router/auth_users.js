const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
{ username: 'SUBHAN', password: 'SUBHAN123' }
];
 
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the provided credentials are valid
  if (authenticatedUser(username, password)) {
    // Generate a JWT token for the session
    const token = jwt.sign({ username }, 'subhannaeem123', { expiresIn: '1h' });

    // Save the user credentials in the session (optional, depends on your use case)
    req.session.user = { username, token };

    // Return the token in the response
    return res.status(200).json({ token, username, message:"login successfully" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

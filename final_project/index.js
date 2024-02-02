const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const regd_users = require('../final_project/router/auth_users.js').authenticated;
const app = express();

app.use(express.json());

app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));
app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use('/auth', regd_users);
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
  // Check if the request has a valid token
  const token = req.session.user?.token;
    if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'subhannaeem123');

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
});
 
const PORT =8000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use('/auth', regd_users);
app.listen(PORT,()=>console.log("Server is running"));

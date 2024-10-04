// Import required modules
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('./models');

// Middleware function for user authentication
const authenticateUser = async (req, res, next) => {
  let message;

  // Extract the basic auth credentials from the request
  const credentials = auth(req);

  if (credentials) {
      // Find the user by email address
    const user = await User.findOne({ where: { emailAddress: credentials.name } });
    if (user) {
          // Compare password
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for user: ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        message = `Authentication failed for user: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for email address: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

   // Handle authentication errors
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

// Export the middleware function
module.exports = authenticateUser;
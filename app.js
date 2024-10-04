'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./Routes/routes');
const users = require('./seed/data.json')
const { sequelize, User } = require('./models');


// the Express app
const app = express();

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

//  morgan which gives us HTTP request logging
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());

//  API routes
app.use('/api',routes);

// friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});
//a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});
// users
const seedUsers = async () => {
  try {
    await User.bulkCreate(users); 
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced successfully.');
    seedUsers(); // Call the seeding function
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


//  our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

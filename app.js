'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const routes = require('./Routes/routes');
const users = require('./seed/data.json')
const { sequelize, User , Course } = require('./models');
const fs = require('fs');
const path = require('path');


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

  
  if (err.status === 400 || err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    res.status(400).json({
      message: err.message,
      errors: err.errors?.map(e => e.message) || [err.message],
    });
  } else {
    res.status(err.status || 500).json({
      message: err.message || 'An unexpected error occurred',
      error: {},
    });
  }
});

// Test database connection
const seedData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed', 'data.json'), 'utf8'));
    
    // Seed Users
    await User.bulkCreate(data.users);
    console.log('Users seeded successfully');

    // Seed Courses
    await Course.bulkCreate(data.courses);
    console.log('Courses seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synced successfully.');
    return seedData();
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

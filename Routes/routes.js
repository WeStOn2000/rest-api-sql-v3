const express = require('express');
const router = express.Router();
const { User, Course } = require('../models');
const authenticateUser = require('./auth-middleware');

// asyncHandler Function
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

// GET /api/users
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
  });
  res.status(200).json(users);
}));

// POST /api/users
router.post('/users',  asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !emailAddress || !password) {
    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!emailAddress) missingFields.push('emailAddress');
    if (!password) missingFields.push('password');

    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ where: { emailAddress } });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  // Create the new user
  const newUser = await User.create({ firstName, lastName, emailAddress, password });

  // Set Location header to "/"
  res.setHeader('Location', '/');
  res.status(201).end();
}));


// fetch all courses
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }
  });
  res.status(200).json(courses);
}));

// fetch course by id
router.get('/courses/:id', asyncHandler(async (req, res, next) => {
  const course = await Course.findByPk(req.params.id, {
    include: { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

//create a new course
router.post('/courses', authenticateUser , asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.location(`/api/courses/${course.id}`).status(201).end();
}));

//update a course by id 
router.put('/courses/:id', authenticateUser ,asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.update(req.body);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

// delete course by id
router.delete('/courses/:id', authenticateUser , asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

//exports 
module.exports = router;

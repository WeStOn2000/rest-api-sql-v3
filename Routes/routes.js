const express = require('express');
const router = express.Router();
const { User } = require('../models');

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
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
  });
  res.status(200).json(users);
}));

// POST /api/users
router.post('/users', asyncHandler(async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;

  if (!firstName || !lastName || !emailAddress || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingUser = await User.findOne({ where: { emailAddress } });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = await User.create({ firstName, lastName, emailAddress, password });
  res.setHeader('Location', '/');
  res.status(201).end();
}));

// fetch all courses
app.get('/api/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'emailAddress'] }
  });
  res.status(200).json(courses);
}));

// fetch course by id
app.get('/api/courses/:id', asyncHandler(async (req, res, next) => {
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
app.post('/api/courses', asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.location(`/api/courses/${course.id}`).status(201).end();
}));

//update a course by id 
app.put('/api/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.update(req.body);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

// delete course by id
app.delete('/api/courses/:id', asyncHandler(async (req, res) => {
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

const express = require('express');
const router = express.Router();
const { User, Course } = require('../models');
const authenticateUser = require('../auth-middleware');

// Helper function for validation
const validateFields = (requiredFields, body) => {
  const missingFields = requiredFields.filter(field => !body[field]);
  const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
  error.status = 400;
  throw error;
};

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
  const user = await User.findByPk(req.currentUser.id, {
    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
  });
  res.status(200).json(user);
}));

// POST /api/users
router.post('/users', asyncHandler(async (req, res) => {
  validateFields(['firstName', 'lastName', 'emailAddress', 'password'], req.body);
  await User.create(req.body);
  res.setHeader('Location', '/');
  res.status(201).end();
}));

// GET /api/courses 
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  res.status(200).json(courses);
}));

// GET /api/courses/:id 
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded'],
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

// POST /api/courses 
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  validateFields(['title', 'description'], req.body);
  const course = await Course.create({
    ...req.body,
    userId: req.currentUser.id
  });
  res.location(`/api/courses/${course.id}`).status(201).end();
}));

// PUT /api/courses/:id 
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  validateFields(['title', 'description'], req.body);
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId !== req.currentUser.id) {
      return res.status(403).json({ message: 'You do not have permission to update this course' });
    }
    await course.update(req.body);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

// DELETE /api/courses/:id 
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId !== req.currentUser.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this course' });
    }
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

module.exports = router;
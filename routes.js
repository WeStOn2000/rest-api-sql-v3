const express = require('express');
const router = express.Router();
const { User } = require('./models'); 

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
router.post('/', asyncHandler(async (req, res) => {
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

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('./models/user'); 
// asyncHandler Function
function asyncHandler (cb) {
    return async (req,res, next)=>{
        try{
            await cb(req,res,next);
        } catch(err){
            next(err)
        }
    };    
}
// GET /api/users
router.get('/', asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.status(200).json(req.user);
}));

// POST /api/users
router.post('/', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = new User({ username, email, password });
  await newUser.save();

  res.setHeader('Location', '/');
  res.status(201).end();
}));

module.exports = router;
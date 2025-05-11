const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// ✅ POST route for user registration (SignUp)
router.post('/add', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, Email, and Password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Remove manual password hashing here
    const newUser = new User({ name, email, password });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

       const isPasswordValid = await bcrypt.compare(password, user.password);
   

    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});


// ✅ GET route to fetch all users (excluding passwords)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;

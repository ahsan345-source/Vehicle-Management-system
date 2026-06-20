const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to sign a JWT for a given user id
const generateToken = (id) =>
  jwt.sign({ id }, 'my_super_secret_key_12345', {
    expiresIn: '7d', // Aap direct '7d' (7 days) ya jo bhi aap chahein rakh sakte hain
  });

// Shape the user object that gets sent back to the client (no password)
const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// @route   POST /api/auth/register
// @access  Public
// Registers a new customer account. Admin accounts are never created
// through this public endpoint — only via the seed script.
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: 'user' });

  res.status(201).json({
    user: formatUser(user),
    token: generateToken(user._id),
  });
});

// @route   POST /api/auth/login
// @access  Public
// Shared login for both customers and admins — the role comes back
// in the response so the frontend can route accordingly.
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: formatUser(user),
    token: generateToken(user._id),
  });
});

// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ user: formatUser(req.user) });
});

module.exports = { registerUser, loginUser, getMe };

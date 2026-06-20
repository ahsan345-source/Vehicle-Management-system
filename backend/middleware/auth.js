const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * Verifies the JWT sent in the Authorization header (Bearer token),
 * attaches the matching user document to req.user, and rejects the
 * request if the token is missing or invalid.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    // process.env.JWT_SECRET ki jagah direct string daal di
    const decoded = jwt.verify(token, 'my_super_secret_key_12345');
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user no longer exists');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed verification');
  }
});

/**
 * Must be used after `protect`. Only allows the request through if
 * the authenticated user has the 'admin' role.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, adminOnly };

const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  if (!user || !user.id) {
    throw new Error('Invalid user object for token generation');
  }
  
  return jwt.sign(
    { id: user.id, email: user.email, userType: user.user_type },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

module.exports = { generateToken };
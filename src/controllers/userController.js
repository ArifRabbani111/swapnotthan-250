const User = require('../models/User');
const { generateToken } = require('../config/auth');

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    const user = await User.findByEmail(email);
    console.log('User found in database:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await User.comparePassword(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    console.log('Login successful, token generated');
    
    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        userType: user.user_type 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register function
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, userType } = req.body;
    
    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const userId = await User.create({ name, email, phone, password, userType });
    const user = await User.findById(userId);
    const token = generateToken(user);
    
    res.status(201).json({ 
      success: true, 
      token, 
      user: { id: user.id, name: user.name, email: user.email, userType: user.user_type } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add helper functions
exports.findByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findByEmail(email);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add console log to verify exports
console.log('userController exports:', {
  login: typeof exports.login,
  register: typeof exports.register,
  findByEmail: typeof exports.findByEmail
});
const express = require('express');
const router = express.Router();

// Import the controller
const userController = require('../controllers/userController');

// Check if the controller is properly imported
console.log('userController:', userController);
console.log('userController.login:', typeof userController.login);
console.log('userController.register:', typeof userController.register);

// Login route
router.post('/login', userController.login);

// Register route
router.post('/register', userController.register);

// Reset admin password route
router.post('/reset-admin-password', async (req, res) => {
  try {
    console.log('Reset admin password route called');
    
    const bcrypt = require('bcrypt');
    const pool = require('../config/db');
    
    const password = 'admin123';
    const email = 'admin@swapnotthan.org';
    
    // Generate a new hash for the password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Generated hash:', hashedPassword);
    
    // Update the admin user's password
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    
    console.log('Password updated successfully. Rows affected:', result.affectedRows);
    
    if (result.affectedRows === 0) {
      // If no rows were updated, the user doesn't exist, so create it
      console.log('Admin user not found, creating new user...');
      
      const [insertResult] = await pool.execute(
        'INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)',
        ['Admin User', email, hashedPassword, 'admin']
      );
      
      console.log('Admin user created with ID:', insertResult.insertId);
    }
    
    res.json({ success: true, message: 'Admin password reset successfully' });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
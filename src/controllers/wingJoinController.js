const Wing = require('../models/Wing');
const User = require('../models/User');
const pool = require('../config/db');

exports.joinWing = async (req, res) => {
  try {
    const { wingId, name, email, phone, password, skills, motivation } = req.body;
    
    // Check if wing exists
    const wing = await Wing.findById(wingId);
    if (!wing) {
      return res.status(404).json({ success: false, message: 'Wing not found' });
    }
    
    // Check if email already exists
    let user = await User.findByEmail(email);
    if (user) {
      // Check if already a member of this wing
      const [existingMembership] = await pool.execute(
        'SELECT id FROM wing_members WHERE wing_id = ? AND user_id = ?',
        [wingId, user.id]
      );
      
      if (existingMembership.length > 0) {
        return res.status(400).json({ success: false, message: 'You are already a member of this wing' });
      }
    } else {
      // Create new user
      const userId = await User.create({ name, email, phone, password, userType: 'volunteer' });
      user = await User.findById(userId);
    }
    
    // Insert wing member
    const [result] = await pool.execute(
      'INSERT INTO wing_members (wing_id, user_id, role) VALUES (?, ?, ?)',
      [wingId, user.id, 'Volunteer']
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'Application to join wing submitted successfully',
      membershipId: result.insertId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
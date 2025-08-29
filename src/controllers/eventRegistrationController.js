const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId, name, email, phone, message } = req.body;
    
    // Check if user exists, if not create a new user
    let user = await User.findByEmail(email);
    if (!user) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).substring(7), 10);
      
      const userId = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        userType: 'volunteer'
      });
      
      user = await User.findById(userId);
    }
    
    // Check if already registered
    const existingRegistration = await EventRegistration.findByEventAndUser(eventId, user.id);
    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }
    
    // Create registration
    const registrationId = await EventRegistration.create({
      eventId,
      userId: user.id
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Event registration successful',
      registrationId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await EventRegistration.findByEvent(eventId);
    res.json({ success: true, registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
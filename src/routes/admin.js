const express = require('express');
const router = express.Router(); // This line was missing
const { verifyToken, isAdmin } = require('../middleware/auth');
const eventController = require('../controllers/eventController');
const teamController = require('../controllers/teamController');
const donationController = require('../controllers/donationController');
const contactController = require('../controllers/contactController');

// Admin dashboard
router.get('/dashboard', verifyToken, isAdmin, async (req, res) => {
  try {
    // Get statistics
    const [usersResult] = await require('../config/db').execute('SELECT COUNT(*) as total FROM users');
    const [volunteersResult] = await require('../config/db').execute("SELECT COUNT(*) as total FROM users WHERE user_type = 'volunteer'");
    const [donationsResult] = await require('../config/db').execute('SELECT COUNT(*) as total FROM donations');
    const [eventsResult] = await require('../config/db').execute('SELECT COUNT(*) as total FROM events');
    
    const stats = {
      totalUsers: usersResult[0].total,
      totalVolunteers: volunteersResult[0].total,
      totalDonations: donationsResult[0].total,
      totalEvents: eventsResult[0].total
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Manage events
router.get('/events', verifyToken, isAdmin, eventController.getAllEvents);
router.post('/events', verifyToken, isAdmin, eventController.createEvent);
router.get('/events/:id', verifyToken, isAdmin, eventController.getEventById);
router.put('/events/:id', verifyToken, isAdmin, eventController.updateEvent);
router.delete('/events/:id', verifyToken, isAdmin, eventController.deleteEvent);

// Manage team members
router.get('/team', verifyToken, isAdmin, teamController.getAllTeamMembers);
router.post('/team', verifyToken, isAdmin, teamController.createTeamMember);
router.get('/team/:id', verifyToken, isAdmin, teamController.getTeamMemberById);
router.put('/team/:id', verifyToken, isAdmin, teamController.updateTeamMember);
router.delete('/team/:id', verifyToken, isAdmin, teamController.deleteTeamMember);

// Manage donations
router.get('/donations', verifyToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await require('../config/db').execute(
      `SELECT d.*, u.name as donor_name 
       FROM donations d 
       JOIN users u ON d.donor_id = u.id 
       ORDER BY d.donation_date DESC`
    );
    res.json({ success: true, donations: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update donation status
router.put('/donations/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await require('../config/db').execute(
      'UPDATE donations SET status = ? WHERE id = ?',
      [status, id]
    );
    
    res.json({ success: true, message: 'Donation status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Manage contact messages
router.get('/messages', verifyToken, isAdmin, contactController.getAllMessages);
router.get('/messages/:id', verifyToken, isAdmin, contactController.getMessageById);
router.delete('/messages/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await require('../config/db').execute('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
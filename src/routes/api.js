const express = require('express');
const router = express.Router();

// Import routes
const userRoutes = require('./users');
const donationRoutes = require('./donations');
const eventRoutes = require('./events');
const wingRoutes = require('./wings');
const teamRoutes = require('./team');
const contactRoutes = require('./contact');
const adminRoutes = require('./admin');

// Use routes
router.use('/users', userRoutes);
router.use('/donations', donationRoutes);
router.use('/events', eventRoutes);
router.use('/wings', wingRoutes);
router.use('/team', teamRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'API is working' });
});

module.exports = router;
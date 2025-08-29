const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const eventRegistrationController = require('../controllers/eventRegistrationController');

// Event routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// Event registration routes
router.post('/:id/register', eventRegistrationController.registerForEvent);
router.get('/:id/registrations', eventRegistrationController.getEventRegistrations);

module.exports = router;
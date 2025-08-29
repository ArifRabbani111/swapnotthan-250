const express = require('express');
const router = express.Router();
const wingController = require('../controllers/wingController');
const wingJoinController = require('../controllers/wingJoinController');

// Wing routes
router.get('/', wingController.getAllWings);
router.get('/:id', wingController.getWingById);

// Wing join routes
router.post('/join', wingJoinController.joinWing);

module.exports = router;

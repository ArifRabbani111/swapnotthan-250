const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createMessage);
router.get('/', contactController.getAllMessages);
router.get('/:id', contactController.getMessageById);

module.exports = router;
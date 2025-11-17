const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

// Check authentication route - ADD THIS LINE
router.get('/check', authController.checkAuth);

module.exports = router;
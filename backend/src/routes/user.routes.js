const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get user settings
router.get('/settings', userController.getUserSettings);

// Update account info
router.put('/account', userController.updateAccountInfo);

// Update preferences
router.put('/preferences', userController.updatePreferences);

// Update accessibility
router.put('/accessibility', userController.updateAccessibility);

// Update notifications
router.put('/notifications', userController.updateNotifications);

// Change password
router.put('/password', userController.changePassword);

module.exports = router;

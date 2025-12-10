const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

// Apply auth middleware to all analytics routes
router.use(authMiddleware);

// Get student analytics data
router.get('/student', analyticsController.getStudentAnalytics);

module.exports = router;

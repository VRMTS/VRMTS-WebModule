const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent-modules', dashboardController.getRecentModules);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/upcoming-deadlines', dashboardController.getUpcomingDeadlines);

module.exports = router;

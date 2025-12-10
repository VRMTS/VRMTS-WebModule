const express = require('express');
const router = express.Router();

console.log('Loading dashboard routes...');

const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

console.log('Dashboard controller loaded:', Object.keys(dashboardController));

// All routes require authentication
router.use(authMiddleware);

// Student dashboard routes
router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent-modules', dashboardController.getRecentModules);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/upcoming-deadlines', dashboardController.getUpcomingDeadlines);

// Debug route to verify router is working
router.get('/test-route', (req, res) => {
  res.json({ message: 'Dashboard router is working', routes: ['stats', 'recent-modules', 'recent-activity', 'upcoming-deadlines'] });
});

console.log('Dashboard routes file loaded successfully');

module.exports = router;

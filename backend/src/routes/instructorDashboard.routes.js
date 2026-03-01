const express = require('express');
const router = express.Router();
const instructorDashboardController = require('../controllers/instructorDashboard.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/class-stats', instructorDashboardController.getClassStats);
router.get('/module-performance', instructorDashboardController.getModulePerformance);
router.get('/recent-submissions', instructorDashboardController.getRecentSubmissions);
router.get('/at-risk-students', instructorDashboardController.getAtRiskStudents);
router.get('/top-performers', instructorDashboardController.getTopPerformers);
router.get('/upcoming-deadlines', instructorDashboardController.getUpcomingDeadlines);

module.exports = router;







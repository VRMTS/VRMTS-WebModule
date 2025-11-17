const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Get available modules for quiz selection
router.get('/modules', quizController.getQuizModules);

// Get quiz statistics
router.get('/stats', quizController.getQuizStats);

// Get previous quiz attempts
router.get('/attempts', quizController.getQuizAttempts);

// Start a module quiz
router.post('/module/:moduleId/start', quizController.startModuleQuiz);

// Start a timed exam
router.post('/timed-exam/start', quizController.startTimedExam);

// Start an adaptive test
router.post('/adaptive/start', quizController.startAdaptiveTest);

// Submit an answer for a quiz attempt
router.post('/attempt/:attemptId/answer', quizController.submitAnswer);

// Get quiz progress for an attempt
router.get('/attempt/:attemptId/progress', quizController.getQuizProgress);

// Finish a quiz attempt
router.post('/attempt/:attemptId/finish', quizController.finishQuiz);

// Get details of a specific quiz attempt
router.get('/attempt/:attemptId', quizController.getQuizAttempt);

module.exports = router;

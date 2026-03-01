const express = require('express');
const router = express.Router();
const modulesController = require('../controllers/modules.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

router.get('/', modulesController.getModules);
router.get('/stats', modulesController.getModulesStats);
router.get('/all', modulesController.getAllModules);
router.post('/:moduleId/start', modulesController.startModule);

module.exports = router;

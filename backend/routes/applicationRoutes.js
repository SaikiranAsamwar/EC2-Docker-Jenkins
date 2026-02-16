const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireStaff, requireCustomer } = require('../middleware/roleMiddleware');

// Customer routes - create and view own applications
router.post('/', authMiddleware, requireCustomer, applicationController.createApplication);
router.get('/my-applications', authMiddleware, requireCustomer, applicationController.getMyApplications);

// Staff routes - view all applications and approve/reject
router.get('/', authMiddleware, requireStaff, applicationController.getAllApplications);
router.put('/:id/approve', authMiddleware, requireStaff, applicationController.approveApplication);
router.put('/:id/reject', authMiddleware, requireStaff, applicationController.rejectApplication);

module.exports = router;

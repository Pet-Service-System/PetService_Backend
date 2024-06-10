const express = require('express');
const { getSchedule, getScheduleByRole, assignEmployeeToSlots } = require('../controllers/scheduleController');
const {authMiddleware, verifyRole} = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all schedules
router.get('/', authMiddleware, verifyRole, getSchedule);

// Get schedules by role
router.get('/role/:role', authMiddleware, verifyRole, getScheduleByRole);

// Assign employee to specific slots
router.post('/assign', authMiddleware, verifyRole, assignEmployeeToSlots);


module.exports = router;

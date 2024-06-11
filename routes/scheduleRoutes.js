const express = require('express');
const { getSchedule, getScheduleByRole, assignEmployeeToSlots } = require('../controllers/scheduleController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

// Get all schedules
router.get('/', authMiddleware, getSchedule);

// Get schedules by role
router.get('/role/:role', authMiddleware, getScheduleByRole);

// Assign employee to specific slots
router.post('/assign', authMiddleware, assignEmployeeToSlots);


module.exports = router;

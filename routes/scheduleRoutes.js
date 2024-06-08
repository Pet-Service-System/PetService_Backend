const express = require('express');
const { getSchedules, createSchedule } = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/schedules', authMiddleware, getSchedules);
router.post('/schedules', authMiddleware, createSchedule);

module.exports = router;

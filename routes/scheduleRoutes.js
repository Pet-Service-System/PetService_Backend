const express = require('express');
const { getSchedules, createSchedule } = require('../controllers/scheduleController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getSchedules);
router.post('/', authMiddleware, createSchedule);

module.exports = router;

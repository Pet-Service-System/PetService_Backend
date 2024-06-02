const express = require('express');
const { login, resetPassword, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/change-password', authMiddleware, changePassword);
router.post(/forget-password/, resetPassword);
module.exports = router;

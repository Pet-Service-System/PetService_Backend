const express = require('express');
const { login, register, forgotPassword, changePassword, resetPassword, logout } = require('../controllers/authController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', authMiddleware, changePassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout); 

module.exports = router;
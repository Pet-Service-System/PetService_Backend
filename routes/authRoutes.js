const express = require('express');
const { login, register, forgotPassword, changePassword, resetPassword, logout, googleAuth, googleAuthCallback } = require('../controllers/authController');
const {authMiddleware, checkToken} = require('../middlewares/authMiddleware');
const router = express.Router();

// Local Auth
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/change-password', authMiddleware, changePassword);
router.post('/reset-password', resetPassword);
router.post('/check-token', authMiddleware, checkToken);
router.post('/logout', logout);

// Google Auth
router.get('/google', googleAuth); 

router.get('/google/callback', googleAuthCallback);

module.exports = router;
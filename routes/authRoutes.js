const express = require('express');
const { login, forgetPassword: resetPassword, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forget-password', resetPassword);
router.post('/change-password', authMiddleware, changePassword);


module.exports = router;

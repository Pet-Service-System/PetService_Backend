const express = require('express');
const { login, register, forgetPassword, changePassword } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forget-password', forgetPassword);
router.post('/change-password', authMiddleware, changePassword);


module.exports = router;

const express = require('express');
const { login, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/reset-password', resetPassword);

module.exports = router;

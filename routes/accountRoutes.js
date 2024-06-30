const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccountById, getAccountByRole, updateAccountById, deleteAccount} = require('../controllers/accountController');

router.get('/role/:role?', getAccountByRole);
router.get('/all', authMiddleware, getAllAccounts);
router.get('/:id/', authMiddleware, getAccountById);
router.patch('/:id', authMiddleware, updateAccountById);
router.delete('/me', authMiddleware, deleteAccount);

module.exports = router;

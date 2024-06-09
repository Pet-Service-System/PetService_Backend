const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccount, getAccountById, getAccountByRole, updateAccount, updateAccountById, deleteAccount} = require('../controllers/accountController');

router.get('/all', authMiddleware, getAllAccounts);
router.get('/me', authMiddleware, getAccount);
router.get(/:id/, authMiddleware, getAccountById);
router.get('/role/:role?', getAccountByRole);
router.patch('/:id', authMiddleware, updateAccount);
router.patch('/:id', authMiddleware, updateAccountById);
router.delete('/me', authMiddleware, deleteAccount);

module.exports = router;


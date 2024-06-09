const express = require('express');
const router = express.Router();
const {authMiddleware, checkRole} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccount, getAccountById, getAccountByRole, updateAccount, updateAccountById, deleteAccount} = require('../controllers/accountController');

router.get('/all', authMiddleware, checkRole(['admin']), getAllAccounts);
router.get('/me', authMiddleware, getAccount);
router.get(/:id/, authMiddleware, checkRole(['admin']), getAccountById);
router.get('/role/:role?', getAccountByRole);
router.patch('/:id', authMiddleware, updateAccount);
router.patch('/:id', authMiddleware, checkRole(['admin']), updateAccountById);
router.delete('/me', authMiddleware, checkRole(['admin']), deleteAccount);

module.exports = router;
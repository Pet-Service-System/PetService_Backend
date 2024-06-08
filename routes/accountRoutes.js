const express = require('express');
const router = express.Router();
const {authMiddleware, checkRole} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccount, getAccountById, updateAccount, updateAccountById, deleteAccount} = require('../controllers/accountController');

router.get('/', authMiddleware, checkRole(['admin']), getAllAccounts);
router.get('/', authMiddleware, getAccount);
router.get(/:id/, authMiddleware, checkRole(['admin']), getAccountById);
router.patch('/:id', authMiddleware, updateAccount);
router.patch('/:id', authMiddleware, checkRole(['admin']), updateAccountById);
router.delete('/', authMiddleware, checkRole(['admin']), deleteAccount);

module.exports = router;


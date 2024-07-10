const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccountById, getAccountByRole, updateAccountById, deleteAccount, getFullnameById} = require('../controllers/accountController');

router.get('/role/:role?', getAccountByRole);
router.get('/all', authMiddleware, getAllAccounts);
router.get('/:id/', authMiddleware, getAccountById);
router.patch('/:id', authMiddleware, updateAccountById);
router.delete('/me', authMiddleware, deleteAccount);
router.get('/fullname/:id', getFullnameById);
module.exports = router;

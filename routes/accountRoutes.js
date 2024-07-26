const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middlewares/authMiddleware');

const {getAllAccounts, getAccountById, getAccountByRole, updateAccountById, deleteAccount, getFullnameById, updateCurrentSpent} = require('../controllers/accountController');

router.get('/role/:role?', getAccountByRole);
router.get('/all', getAllAccounts);
router.get('/:id/', authMiddleware, getAccountById);
router.patch('/:id', authMiddleware, updateAccountById);
router.delete('/me', authMiddleware, deleteAccount);
router.get('/fullname/:id', getFullnameById);
router.patch('/:id/update-spent', updateCurrentSpent);

module.exports = router;

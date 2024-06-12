const express = require('express');
const { createPet, getAllPets, getPetById, updatePet, deletePet, getPetsByAccountId } = require('../controllers/petController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPet);
router.get('/', getAllPets);
router.get('/:id', getPetById);
router.patch('/:id', authMiddleware, updatePet);
router.delete('/:id', authMiddleware, deletePet);
router.get('/account/:account_id', authMiddleware, getPetsByAccountId);

module.exports = router;

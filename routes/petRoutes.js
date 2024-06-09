const express = require('express');
const { createPet, getAllPets, getPetById, updatePet, deletePet } = require('../controllers/petController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPet);
router.get('/', getAllPets);
router.get('/:id', getPetById);
router.patch('/:id', authMiddleware, updatePet);
router.delete('/:id', authMiddleware, deletePet);

module.exports = router;

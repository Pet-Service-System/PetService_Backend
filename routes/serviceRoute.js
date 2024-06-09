const express = require('express');
const { createService, getAllServices, getServiceById, updateService, deleteService } = require('../controllers/serviceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.patch('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;

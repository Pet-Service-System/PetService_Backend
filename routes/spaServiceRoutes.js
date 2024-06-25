const express = require('express');
const { createService, getAllServices, getServiceById, updateService, deleteService } = require('../controllers/spaServiceController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createService);
router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.patch('/:id', authMiddleware, upload.single('image'), updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;

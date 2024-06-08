const express = require('express');
const {createProduct, getProducts, getProductById, updateProduct, deleteProduct , getProductsByPetType } = require('../controllers/productController');
const {authMiddleware, checkRole} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, checkRole(['manager']), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.patch('/:id', authMiddleware, checkRole(['manager']), updateProduct);
router.delete('/:id',  deleteProduct);
router.get('/petType/:petTypeId', getProductsByPetType);
module.exports = router;

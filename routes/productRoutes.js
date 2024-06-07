const express = require('express');
const {createProduct, getProducts, getProductById, updateProduct, deleteProduct , getProductsByPetType } = require('../controllers/productController');
const {authMiddleware, checkRole} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, checkRole(['manager']), createProduct);
router.get('/', getProducts);
router.get('/products/:id', getProductById);
router.patch('/:id', authMiddleware, checkRole(['manager']), updateProduct);
router.delete('/:id', authMiddleware, checkRole(['manager']), deleteProduct);
router.get('/petType/:petTypeId', getProductsByPetType);
module.exports = router;

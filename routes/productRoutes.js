const express = require('express');
const {createProduct, getProducts,getProductById,updateProduct,deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/products', authMiddleware, createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.patch('/products/:id', authMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, deleteProduct);

module.exports = router;

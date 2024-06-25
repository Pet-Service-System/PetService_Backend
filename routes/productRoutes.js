const express = require('express');
const {createProduct, getProducts, getProductById, updateProduct, deleteProduct , getProductsByPetType } = require('../controllers/productController');
const {authMiddleware} = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');
const router = express.Router();

router.post('/', authMiddleware, upload.single('image'), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.patch('/:id', authMiddleware, upload.single('image'), updateProduct);
router.delete('/:id',  deleteProduct);
router.get('/petType/:petTypeId', getProductsByPetType);
module.exports = router;

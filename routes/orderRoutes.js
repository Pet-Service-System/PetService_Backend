const express = require('express');
const router = express.Router();
const {createOrder, getAllOrders, getOrderById, getOrderByAccountId, updateOrderById, deleteOrderById } = require('../controllers/orderController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get all orders
router.get('/', authMiddleware, getAllOrders);

// Get an order by ID
router.get('/:id', authMiddleware, getOrderById);

// Get an order by account ID
router.get('/:id', authMiddleware, getOrderByAccountId);

// Update an order by ID 
router.put('/:id', authMiddleware, updateOrderById);

// Delete an order by ID
router.delete('/:id', authMiddleware, deleteOrderById);

module.exports = router;

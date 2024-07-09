const express = require('express');
const router = express.Router();
const {createOrderDetail, getOrderDetails, getOrderDetailById, getOrderDetailsByOrderId, updateOrderDetail, deleteOrderDetail, updateOrderCommentStatus} = require('../controllers/orderDetailsController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Create a new order detail
router.post('/', authMiddleware, createOrderDetail);

// Get all order details
router.get('/', authMiddleware, getOrderDetails);

// Get order detail by ID
router.get('/:id', authMiddleware, getOrderDetailById);

// Get order details by OrderID
router.get('/order/:orderId', authMiddleware, getOrderDetailsByOrderId);

// Update order detail
router.put('/:id', authMiddleware, updateOrderDetail);

// Delete order detail
router.delete('/:id', authMiddleware, deleteOrderDetail);

// Route to update order detail
router.patch('/updateOrderCommentStatus', updateOrderCommentStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const {createOrderDetail, getOrderDetails, getOrderDetailById, getOrderDetailsByOrderId, updateOrderDetail, deleteOrderDetail} = require('../controllers/orderDetailsController');

router.post('/', createOrderDetail);
router.get('/', getOrderDetails);
router.get('/:id', getOrderDetailById);
router.get('/order/:orderId', getOrderDetailsByOrderId);
router.put('/:id', updateOrderDetail);
router.delete('/:id', deleteOrderDetail);

module.exports = router;

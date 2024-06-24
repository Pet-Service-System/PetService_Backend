const OrderDetails = require('../models/OrderDetails');

// Create a new order detail
exports.createOrderDetail = async (req, res) => {
  try {
    // Generate a new OrderDetailsID
    const lastOrderDetail = await OrderDetails.findOne().sort({ OrderDetailsID: -1 });
    const newId = lastOrderDetail ? `OD${String(parseInt(lastOrderDetail.OrderDetailsID.substring(2)) + 1).padStart(3, '0')}` : 'OD001';

    // Create new order detail
    const orderDetail = new OrderDetails({ ...req.body, OrderDetailsID: newId });
    await orderDetail.save();
    
    res.status(201).json(orderDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all order details
exports.getOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.find().populate('OrderID OrderDetails.ProductID');
    res.status(200).json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order detail by ID
exports.getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await OrderDetails.findOne({ OrderDetailsID: req.params.id }).populate('OrderID OrderDetails.ProductID');
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order Detail not found' });
    }
    res.status(200).json(orderDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order details by OrderID
exports.getOrderDetailsByOrderId = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.find({ OrderID: req.params.orderId }).populate('OrderID OrderDetails.ProductID');
    if (orderDetails.length === 0) {
      return res.status(404).json({ error: 'No Order Details found for this OrderID' });
    }
    res.status(200).json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order detail
exports.updateOrderDetail = async (req, res) => {
  try {
    // Create an object that excludes OrderDetailsID
    const { OrderDetailsID, ...updateData } = req.body;

    // Perform the update without OrderDetailsID
    const orderDetail = await OrderDetails.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('OrderID OrderDetails.ProductID');
    
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order Detail not found' });
    }
    
    res.status(200).json(orderDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order detail
exports.deleteOrderDetail = async (req, res) => {
  try {
    const orderDetail = await OrderDetails.findByIdAndDelete(req.params.id);
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order Detail not found' });
    }
    res.status(200).json({ message: 'Order Detail deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

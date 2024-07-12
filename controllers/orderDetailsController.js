const OrderDetails = require('../models/OrderDetails');
const { generateOrderDetailsID } = require('../utils/idGenerators');

// Create a new order detail
exports.createOrderDetail = async (req, res) => {
  try {
    // Generate a new OrderDetailsID
    const newId = await generateOrderDetailsID();

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
    const orderDetails = await OrderDetails.find();
    res.status(200).json(orderDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order detail by ID
exports.getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await OrderDetails.findOne({ OrderDetailsID: req.params.id });
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
    const orderDetails = await OrderDetails.findOne({ OrderID: req.params.orderId });
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
    const orderDetail = await OrderDetails.findOneAndUpdate({ OrderDetailsID: req.params.id }, updateData, { new: true });
    
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
    const orderDetail = await OrderDetails.findOneAndDelete({OrderDetailsID: req.params.id});
    if (!orderDetail) {
      return res.status(404).json({ error: 'Order Detail not found' });
    }
    res.status(200).json({ message: 'Order Detail deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order comment status
exports.updateOrderCommentStatus = async (req, res) => {
  try {
    const { OrderID, ProductID, isCommented } = req.body;

    const orderDetail = await OrderDetails.findOneAndUpdate(
      { OrderID, "Items.ProductID": ProductID },
      { $set: { "Items.$.isCommented": isCommented } },
      { new: true }
    );

    if (!orderDetail) {
      return res.status(404).json({ error: 'Order Detail or Product not found' });
    }

    res.status(200).json(orderDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

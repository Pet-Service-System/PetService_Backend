const Account = require('../models/Account');
const Order = require('../models/Order');
const SpaBooking = require('../models/SpaBooking');
const OrderDetails = require('../models/OrderDetails');
const Product = require('../models/Product');

exports.countAvailableAccounts = async (req, res) => {
    try {
      const count = await Account.countDocuments({ status: 1 });
      res.json({ count });
    } catch (error) {
      console.error('Error counting available accounts:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.countCompletedOrders = async (req, res) => {
    try {
      const count = await Order.countDocuments({ Status: "Shipped" });
      res.json({ count });
    } catch (error) {
      console.error('Error counting available orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.countCompletedBookings = async (req, res) => {
    try {
      const count = await SpaBooking.countDocuments({ Status: "Completed" });
      res.json({ count });
    } catch (error) {
      console.error('Error counting available bookings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.countTopThreeProducts = async (req, res) => {
    try {
      const topProducts = await OrderDetails.aggregate([
        { $unwind: "$Items" },
        {
          $group: {
            _id: "$Items.ProductID",
            totalQuantity: { $sum: "$Items.Quantity" }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 3 }
      ]);
  
      const productsWithDetails = await Promise.all(
        topProducts.map(async (product) => {
          const productDetails = await Product.findOne({ ProductID: product._id });
          return {
            ...product,
            ProductName: productDetails ? productDetails.ProductName : 'Unknown',
            Price: productDetails ? productDetails.Price : 0,
            ImageURL: productDetails ? productDetails.ImageURL : '',
          };
        })
      );
  
      res.json(productsWithDetails);
    } catch (error) {
      console.error('Error fetching top products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  

  
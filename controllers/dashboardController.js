const Account = require("../models/Account");
const Order = require("../models/Order");
const SpaBooking = require("../models/SpaBooking");
const OrderDetails = require("../models/OrderDetails");
const Product = require("../models/Product");
const { getStartOfWeek, getEndOfWeek } = require("../utils/idGenerators");

exports.countAvailableAccounts = async (req, res) => {
  try {
    const count = await Account.countDocuments({ status: 1 });
    res.json({ count });
  } catch (error) {
    console.error("Error counting available accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.countCompletedOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments({ Status: "Shipped" });
    res.json({ count });
  } catch (error) {
    console.error("Error counting available orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.countCompletedBookings = async (req, res) => {
  try {
    const count = await SpaBooking.countDocuments({ Status: "Completed" });
    res.json({ count });
  } catch (error) {
    console.error("Error counting available bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.countTopThreeProducts = async (req, res) => {
  try {
    const topProducts = await OrderDetails.aggregate([
      { $unwind: "$Items" },
      {
        $group: {
          _id: "$Items.ProductID",
          totalQuantity: { $sum: "$Items.Quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 3 },
    ]);

    const productsWithDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetails = await Product.findOne({
          ProductID: product._id,
        });
        return {
          ...product,
          ProductName: productDetails ? productDetails.ProductName : "Unknown",
          Price: productDetails ? productDetails.Price : 0,
          ImageURL: productDetails ? productDetails.ImageURL : "",
        };
      })
    );

    res.json(productsWithDetails);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({
      OrderID: req.params.id,
    });
    if (deletedOrder) {
      res.status(200).json({ message: "Order deleted" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.countOrdersAndBookingsByDayInWeek = async (req, res) => {
  try {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    const orders = await Order.aggregate([
      {
        $match: {
          OrderDate: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          Status: { $ne: "Canceled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$OrderDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const bookings = await SpaBooking.aggregate([
      {
        $match: {
          CreateDate: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          Status: { $ne: "Canceled" },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$CreateDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const mergedResults = {};
    orders.forEach((order) => {
      mergedResults[order._id] = { orders: order.count, bookings: 0 };
    });
    bookings.forEach((booking) => {
      if (mergedResults[booking._id]) {
        mergedResults[booking._id].bookings = booking.count;
      } else {
        mergedResults[booking._id] = { orders: 0, bookings: booking.count };
      }
    });

    const resultsArray = [
      ["Day of week", "Total Services Booked", "Total Ordered"],
    ];
    for (const [date, counts] of Object.entries(mergedResults)) {
      resultsArray.push([date, counts.bookings, counts.orders]);
    }

    res.status(200).json(resultsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.calculateEarnings = async (req, res) => {
  try {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = getEndOfWeek();

    const orders = await Order.aggregate([
      {
        $match: {
          OrderDate: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          Status: "Shipped",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$TotalPrice" },
        },
      },
    ]);

    const bookings = await SpaBooking.aggregate([
      {
        $match: {
          CreateDate: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          Status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$Price" },
        },
      },
    ]);

    const totalOrderEarnings = orders.length > 0 ? orders[0].totalEarnings : 0;
    const totalBookingEarnings =
      bookings.length > 0 ? bookings[0].totalEarnings : 0;

    const totalEarnings = totalOrderEarnings + totalBookingEarnings;

    res.status(200).json({ totalEarnings });
  } catch (error) {
    console.error("Error calculating weekly earnings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
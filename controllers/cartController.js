const Cart = require('../models/Cart');
const Product = require('../models/Product');
const HotelBooking = require('../models/bookingHotel');
const SpaService = require('../models/SpaService'); 

exports.createCart = async (req, res) => {
  try {
    const { AccountID } = req.body;
    let cart = await Cart.findOne({ AccountID });

    if (!cart) {
      cart = new Cart({ AccountID, items: [] });
      await cart.save();
    }

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { AccountID, itemType, itemId, quantity, price } = req.body;
    let cart = await Cart.findOne({ AccountID });

    if (!cart) {
      cart = new Cart({ AccountID, items: [] });
    }

    let item;
    switch (itemType) {
      case 'product':
        item = await Product.findById(itemId);
        break;
      case 'hotelService':
        item = await HotelBooking.findOne({ BookingDetailID: itemId });
        break;
      case 'spaService':
        item = await SpaService.findById(itemId);
        break;
      default:
        return res.status(400).json({ error: 'Invalid item type' });
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const itemIndex = cart.items.findIndex(cartItem => cartItem.itemId === itemId && cartItem.itemType === itemType);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemType, itemId, quantity, price });
    }

    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { AccountID, itemType, itemId } = req.body;
    let cart = await Cart.findOne({ AccountID });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => !(item.itemId === itemId && item.itemType === itemType));
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.viewCart = async (req, res) => {
  try {
    const { AccountID } = req.params;
    const cart = await Cart.findOne({ AccountID });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status500().json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { AccountID } = req.params;
    let cart = await Cart.findOne({ AccountID });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

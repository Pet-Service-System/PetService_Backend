const Cart = require('../models/Cart');

// Get cart by AccountID
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ AccountID: req.params.AccountID });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.Price * item.Quantity, 0);
};


// Add item to cart
exports.addToCart = async (req, res) => {
  const { AccountID, Items } = req.body;
  try {
    let cart = await Cart.findOne({ AccountID });

    if (!cart) {
      cart = new Cart({ AccountID, Items: [], TotalPrice: 0 });
    }

    Items.forEach(({ ProductID, ProductName, Price, Quantity, ImageURL, Status }) => {
      const existingItem = cart.Items.find(item => item.ProductID === ProductID);
      if (existingItem) {
        existingItem.Quantity = Quantity;
        existingItem.Status = Status;
      } else {
        cart.Items.push({ ProductID, ProductName, Price, Quantity, ImageURL, Status });
      }
    });

    cart.TotalPrice = calculateTotalPrice(cart.Items);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update item Quantity in cart
exports.updateCartItem = async (req, res) => {
  const { AccountID, ProductID, Quantity, Status } = req.body; 
  console.log(req.body)
  try {
    const cart = await Cart.findOne({ AccountID });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.Items.find(item => item.ProductID === ProductID);

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.Quantity = Quantity;
    item.Status = Status;

    cart.TotalPrice = calculateTotalPrice(cart.Items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  const { AccountID, ProductID } = req.body;

  try {
    const cart = await Cart.findOne({ AccountID });
    console.log('Cart found:', cart);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    console.log(cart.Items);

    if (!cart.Items) {
      cart.Items = [];
    }

    cart.Items = cart.Items.filter(item => item.ProductID !== ProductID);
    cart.TotalPrice = calculateTotalPrice(cart.Items);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
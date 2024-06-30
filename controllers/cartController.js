const Cart = require('../models/Cart');
// Get cart by AccountID
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ AccountID: req.params.AccountID });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { AccountID, Items } = req.body;
  console.log(req.body);

  try {
    let cart = await Cart.findOne({ AccountID: AccountID });

    if (!cart) {
      cart = new Cart({ AccountID: AccountID, Items: [] });
    }

    Items.forEach(({ ProductID, ProductName, Price, quantity, ImageURL }) => {
      const existingItem = cart.Items.find(item => item.ProductID === ProductID);
      if (existingItem) {
        existingItem.Quantity += quantity;
      } else {
        cart.Items.push({ ProductID: ProductID, ProductName: ProductName, Price: Price, Quantity: quantity, ImageURL: ImageURL });
      }
    });

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update item Quantity in cart
exports.updateCartItem = async (req, res) => {
  const { AccountID, ProductID, Quantity } = req.body;

  try {
    const cart = await Cart.findOne({ AccountID: AccountID });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(item => item.ProductID === ProductID);

    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.Quantity = Quantity;

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
    const cart = await Cart.findOne({ AccountID: AccountID });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.ProductID !== ProductID);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

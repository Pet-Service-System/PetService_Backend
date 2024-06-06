const Product = require('../models/Account');
//create product
exports.createProduct = async (req, res) => {
    try {
      const { productId, productName, price, petTypeId } = req.body;
      const product = new Product({ productId, productName, price, petTypeId });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
    }
  };

// get all product
  exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };

  // get product by id
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error });
    }
  };

  // Update a product
  exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    try {
      // Find the product by ID and update it with the new data
      const product = await Product.findByIdAndUpdate(id, updateData, { new: true }); // The { new: true } option returns the updated document
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  //delete product
  exports.deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting product', error });
    }
  };

  
  
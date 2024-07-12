const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { generateProductId } = require('../utils/idGenerators');

// Create product (manager only)
exports.createProduct = async (req, res) => {
  try {
    const ProductID = await generateProductId(); // Generate a new unique ProductID
    const { ProductName, Price, Quantity, PetTypeID, Description, Status, CategoryID } = req.body;

    let productData = {
      ProductID: ProductID,
      ProductName: ProductName,
      Price: Price,
      PetTypeID: PetTypeID,
      Description: Description,
      Quantity: Quantity,
      Status: Status,
      CategoryID: CategoryID
    };

    if (req.file && req.file.path) {
      productData.ImageURL = req.file.path;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findOne({ ProductID: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Get products by pet type
exports.getProductsByPetType = async (req, res) => {
  try {
    const petTypeId = req.params.petTypeId;
    const products = await Product.find({ PetTypeID: petTypeId });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this pet type' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Update product (manager only)
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  delete updateData.ProductID; // Remove the product ID to prevent updating it

  try {
    // Check if a new file is uploaded
    if (req.file && req.file.path) {
      const product = await Product.findOne({ ProductID: id });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Delete the old image from Cloudinary if it exists
      if (product.ImageURL) {
        const publicId = product.ImageURL.split('/').pop().split('.')[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(publicId);
      }

      // Update the image URL with the new one
      updateData.ImageURL = req.file.path;
    }

    // Find the product by ID and update it with the new data
    const product = await Product.findOneAndUpdate({ ProductID: id }, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete product (manager only)
exports.deleteProduct = async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findOne({ ProductID: req.params.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the image from Cloudinary if it exists
    if (product.ImageURL) {
      const publicId = product.ImageURL.split('/').pop().split('.')[0]; // Extract the public ID from the URL
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the product
    await Product.findOneAndDelete({ ProductID: req.params.id });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
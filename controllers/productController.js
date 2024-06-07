const Product = require('../models/Product');

//Generate a new product ID
const generateProductId = async () => {
  const lastProduct = await Product.findOne().sort({ ProductID: -1 });

  if (lastProduct && lastProduct.ProductID) {
      const lastProductId = parseInt(lastProduct.ProductID.slice(1)); // Extract numeric part of the last ProductID
      const newProductId = `P${("000" + (lastProductId + 1)).slice(-3)}`; // Increment the numeric part and format it to 3 digits
      return newProductId;
  } else {
      return 'P001'; // Starting ID if there are no products
  }
};

//Create product
exports.createProduct = async (req, res) => {
  try {
      const productId = await generateProductId(); // Generate a new ProductID
      const { productName, price, petTypeId } = req.body;
      const product = new Product({ ProductID: productId, ProductName: productName, Price: price, Pet_type_Id: petTypeId });
      await product.save();
      res.status(201).json(product);
  } catch (error) {
      res.status(500).json({ message: 'Error creating product', error });
  }
};

//Get all product
  exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  };

  //Get product by id
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

 //Get product by pet type
 exports.getProductsByPetType = async (req, res) => {
  try {
    const petTypeId = req.params.petTypeId;
    const products = await Product.find({ PetTypeId: petTypeId });
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this pet type' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

  // Update product
  exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.productId;// remove the product id to prevent updating it
  
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
  

  //Delete product
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

  
  
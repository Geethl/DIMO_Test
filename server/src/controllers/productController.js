const Product = require('../models/Product');

// @desc    Search products by Query or Category (Regex)
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q, category } = req.query;

    // Build the query object
    const queryObj = {};

    if (category && category !== 'All') {
      queryObj.category = category;
    }

    if (q) {
      // Regex allows case-insensitive partial matches across name OR partNumber OR sku
      queryObj.$or = [
        { name: { $regex: q, $options: 'i' } },
        { partNumber: { $regex: q, $options: 'i' } },
        { sku: { $regex: q, $options: 'i' } },
      ];
    }

    // Limit instant searches to top 5 hits for performance
    const products = await Product.find(queryObj).limit(5).select('name partNumber sku price category images');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Search query failed', error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { keyword = '', category = '', brand = '' } = req.query;

    const query = {};
    if (keyword) query.name = { $regex: keyword, $options: 'i' };
    if (category) query.category = category;
    if (brand) query.brand = brand;

    const products = await Product.find(query).limit(50);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

module.exports = { searchProducts, getProducts, getProductById };

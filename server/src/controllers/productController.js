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

module.exports = { searchProducts };

const express = require('express');
const { searchProducts, getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;

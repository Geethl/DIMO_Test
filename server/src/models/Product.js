const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: { type: String, unique: true, sparse: true },
  sku: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['Engine Parts', 'Power Tools', 'Vehicle Accessories', 'TATA Genuine Parts', 'Agriculture Machinery', 'Home Appliances', 'Other'] },
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  specifications: { type: Map, of: String }, // Flexible technical specs
  images: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

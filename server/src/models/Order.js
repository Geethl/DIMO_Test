const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingAddress: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
  },
  trackingStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing'
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  paymentId: {
    type: String,
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

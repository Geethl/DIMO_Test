const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_replace_me');

const createPaymentIntent = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Recalculate price on backend strictly for security
    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects cents
      currency: 'lkr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentId, shippingAddress } = req.body;
    // Assuming simple mock auth logic injects user ID directly, standard systems use middleware to inject req.user
    // For this generic demo, we'll assume the frontend sends the user ID if no standard auth middleware is active in this project router yet
    const { userId } = req.body; 

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: userId,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentId,
      shippingAddress
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.query; // Extracted from query for demo, usually from req.user
    if (!userId) return res.status(401).json({ message: 'Not authorized, no user ID' });

    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = { createPaymentIntent, createOrder, getMyOrders };

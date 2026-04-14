const express = require('express');
const { createPaymentIntent, createOrder, getMyOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/', createOrder);
router.get('/myorders', getMyOrders);

module.exports = router;

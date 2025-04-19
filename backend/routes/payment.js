const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment');
const stripeWebhookMiddleware = require('../middleware/stripeWebhookMiddleware');

// Stripe webhook route with raw body middleware
router.post('/webhook', stripeWebhookMiddleware, paymentController.handleWebhook);

// All routes
router.get('/checkout-session', paymentController.getCheckoutSession);
router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.get('/config', paymentController.getStripeConfig);
router.post('/record-payment', paymentController.recordPayment);
router.post('/create-payment-intent', paymentController.createPaymentIntent);

module.exports = router;

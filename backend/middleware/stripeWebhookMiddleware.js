const express = require('express');

// Middleware to capture raw body for Stripe webhook verification
const stripeWebhookMiddleware = express.json({
  verify: function (req, res, buf) {
    if (req.originalUrl.startsWith('/api/payment/webhook')) {
      req.rawBody = buf.toString();
    }
  },
});

module.exports = stripeWebhookMiddleware;


const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: "stripe-samples/checkout-one-time-payments",
    version: "0.0.1",
    url: "https://github.com/stripe-samples/checkout-one-time-payments"
  }
});
const pool = require('../db');
const { sendEmail } = require('../mailer');

// Stripe webhook setup middleware
router.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith('/webhook')) {
        req.rawBody = buf.toString();
      }
    },
  })
);

// Get checkout session
router.get('/checkout-session', async (req, res) => {
  try {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  const domainURL = process.env.DOMAIN;
  const { quantity } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price: process.env.PRICE,
        quantity: quantity
      },
    ],
    success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/canceled.html`,
  });

  return res.redirect(303, session.url);
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  let data;
  let eventType;

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    let event;
    let signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === 'checkout.session.completed') {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
});

// Get Stripe configuration
router.get('/config', async (req, res) => {
  const price = await stripe.prices.retrieve(process.env.PRICE);
  res.send({
    publicKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
    unitAmount: price.unit_amount,
    currency: price.currency,
  });
});

// Record payment
router.post('/record-payment', async (req, res) => {
  const { cart, paymentIntentId, ...userData } = req.body;
  if (!userData || !paymentIntentId || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'User data and payment intent ID are required' });
  }
  
  const orderId = Math.random().toString(36).substr(2, 9);
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const address = `${userData.address} ${userData.country} ${userData.state} ${userData.postcode}`;
  
   
  try {
    // Save sales and order data
    try {
      await pool.query('INSERT INTO "sales" (amount, currency, email) VALUES ($1, $2, $3)', 
        [totalAmount, "GBP", userData.email]);
        
      await pool.query('INSERT INTO "orders" (amount, currency, email, address, payment_status, firstname, lastname, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [totalAmount, "GBP", userData.email, address, "Paid", userData.firstname, userData.lastname, userData.number]);
    } catch (error) {
      console.error('Error saving sale to database:', error);
    }
    
    // Send customer email
    await sendEmail('gmail', userData.email, userData, cart);

    // Create a custom message for the seller
    const sellerMessage = `A new order has been placed!

Customer Name: ${userData.firstname} ${userData.lastname}
Order ID: ${orderId}
Email: ${userData.email}
Address: ${address}
Phone Number: ${userData.number}
Cart Items:
${cart.map(item => `- ${item.productName}: $${item.price} x ${item.quantity}`).join('\n')}

Total Amount: $${totalAmount}

Please process this order promptly.`;

    // Send seller notification with the custom message
    await sendEmail('gmail', 'ppeliance@gmail.com', {}, [], sellerMessage);
    
    cart.length = 0;
    res.json({
      message: 'Payment recorded successfully',
      order: {
        id: orderId,
        ...userData,
        cart,
        paymentIntentId,
        totalAmount,
      },
    });
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  const { amount, paymentMethodType } = req.body;


  if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!paymentMethodType || typeof paymentMethodType !== 'string') {
      return res.status(400).json({ error: 'Invalid payment method type' });
  }

  try {
      const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), 
          currency: process.env.CURRENCY || 'gbp', 
          payment_method_types: [paymentMethodType],
          metadata: {
              userId: req.user?.id || 'guest', 
              timestamp: new Date().toISOString(),
          },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
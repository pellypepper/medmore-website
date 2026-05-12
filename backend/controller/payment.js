const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: {
      name: "stripe-samples/checkout-one-time-payments",
      version: "0.0.1",
      url: "https://github.com/stripe-samples/checkout-one-time-payments"
    }
  });

  const pool = require('../db');
  const { sendEmail } = require('../mailer');
  
  // GET /checkout-session
  exports.getCheckoutSession = async (req, res) => {
    try {
      const { sessionId } = req.query;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.send(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // POST /create-checkout-session
  exports.createCheckoutSession = async (req, res) => {
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
  };
  
  // POST /webhook
  exports.handleWebhook = async (req, res) => {
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
  if (eventType === 'payment_intent.succeeded') {
  console.log('🔔 Payment successful!');
}
  
    res.sendStatus(200);
  };
  
  // GET /config
  exports.getStripeConfig = async (req, res) => {
    const price = await stripe.prices.retrieve(process.env.PRICE);
    res.send({
      publicKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
      unitAmount: price.unit_amount,
      currency: price.currency,
    });
  };
  
  // POST /record-payment
exports.recordPayment = async (req, res) => {
  try {
    const { cart, paymentIntentId, ...userData } = req.body;

    if (
      !userData ||
      !paymentIntentId ||
      !Array.isArray(cart) ||
      cart.length === 0
    ) {
      return res.status(400).json({
        error: 'User data and payment intent ID are required'
      });
    }

    const orderId = Math.random().toString(36).substring(2, 10);

    const totalAmount = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0).toFixed(2);

    const address = [
      userData.address,
      userData.country,
      userData.state,
      userData.postcode
    ].filter(Boolean).join(' ');

    // 1. Save to DB (fail-safe)
    try {
      await pool.query(
        'INSERT INTO sales (amount, currency, email) VALUES ($1, $2, $3)',
        [totalAmount, "GBP", userData.email]
      );

      await pool.query(
        `INSERT INTO orders 
        (amount, currency, email, address, payment_status, firstname, lastname, phone_number)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          totalAmount,
          "GBP",
          userData.email,
          address,
          "Paid",
          userData.firstname,
          userData.lastname,
          userData.number
        ]
      );
    } catch (dbError) {
      console.error("DB ERROR:", dbError);
    }

    // 2. Email (non-blocking safety)
    try {
      await sendEmail('gmail', userData.email, userData, cart);
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
    }

    // 3. Seller email (also safe)
    try {
      const sellerMessage = `
New Order Received

Customer: ${userData.firstname} ${userData.lastname}
Order ID: ${orderId}
Email: ${userData.email}
Address: ${address}
Phone: ${userData.number}

Items:
${cart.map(item =>
  `- ${item.productName}: $${item.price} x ${item.quantity}`
).join('\n')}

Total: £${totalAmount}
      `;

      await sendEmail('gmail', 'ppeliance@gmail.com', {}, [], sellerMessage);
    } catch (sellerEmailError) {
      console.error("SELLER EMAIL ERROR:", sellerEmailError);
    }

    // 4. Always respond SUCCESS (important for frontend stability)
    return res.json({
      message: 'Payment recorded successfully',
      order: {
        id: orderId,
        email: userData.email,
        totalAmount,
        paymentIntentId
      }
    });

  } catch (error) {
    console.error("recordPayment FATAL ERROR:", error);
    return res.status(500).json({
      error: 'Server error while recording payment'
    });
  }
};
  
  // POST /create-payment-intent
  exports.createPaymentIntent = async (req, res) => {
     
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
  };
  
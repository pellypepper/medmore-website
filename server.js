require('dotenv').config(); // Load environment variables
const express = require('express');
const stream = require('stream');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const axios = require('axios'); 
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const pgSession = require('connect-pg-simple')(session); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
    appInfo: {
        name: "stripe-samples/checkout-one-time-payments",
        version: "0.0.1",
        url: "https://github.com/stripe-samples/checkout-one-time-payments"
    }
});
const { sendEmail } = require('./mailer'); 
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const pool = require('./db');
const app = express();
const PORT = 10000;

app.use(cors({
    origin: process.env.REACT_APP_API_URL, // Can be an array or string
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With'
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Increase URL-encoded payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const pgPool = require('pg').Pool; 
const sessionStore = new pgSession({
    pool: pool, 
    tableName: 'session' 
});
app.use(session({
    store: sessionStore,
    secret: 'djfjdsjsk',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000, 
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production'} 
    
  }));


  app.use(
    rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max: 50, // Limit each IP to 50 requests per minute
    })
);




passport.use(
    new LocalStrategy(    { usernameField: 'email', passwordField: 'password' }, 
    async (email, password, done) => {
    try {
        const result = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
        const user = result.rows[0];
  
        if (!user) {
          return done(null, false, { message: 'No user with that username' });
        }
  
        const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }
  
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

// Serialize User (Store user ID in session)
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize User (Retrieve user from session)
passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query('SELECT * FROM "users" WHERE id = $1', [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname,  'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Stripe webhook setup
app.use(
    express.json({
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith('/webhook')) {
                req.rawBody = buf.toString();
            }
        },
    })
);








app.get('/checkout-session', async (req, res) => {
    try {
        const { sessionId } = req.query;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.send(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/create-checkout-session', async (req, res) => {
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

// Webhook handler for asynchronous events.
app.post('/webhook', async (req, res) => {
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
    // const sale = {
    //     amount: data.object.amount_total / 100, // Convert from cents
    //     currency: data.object.currency,
    //     email: data.object.customer_email,
    // };
    // try {
    //     await pool.query('INSERT INTO "sales" (amount, currency, email) VALUES ($1, $2, $3)', [sale.amount, sale.currency, sale.email]);
    // } catch (error) {
    //     console.error('Error saving sale to database:', error);
    // }

    res.sendStatus(200);
});

app.get('/config', async (req, res) => {
    const price = await stripe.prices.retrieve(process.env.PRICE);
    res.send({
        publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
        unitAmount: price.unit_amount,
        currency: price.currency,
    });
});

app.post('/record-payment', async (req, res) => {
    const { cart, paymentIntentId, ...userData } = req.body;
    if (!userData || !paymentIntentId || !Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: 'User data and payment intent ID are required' });
    }
    const orderId = Math.random().toString(36).substr(2, 9);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    const address = `${userData.address} ${userData.country} ${userData.state} ${userData.postcode}`;

    try {
        try {
            await pool.query('INSERT INTO "sales" (amount, currency, email) VALUES ($1, $2, $3)', [totalAmount, "GBP", userData.email]);
            await pool.query('INSERT INTO "orders" (amount, currency, email, address, payment_status, firstname, lastname, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [totalAmount, "GBP", userData.email, address , "Paid", userData.firstname, userData.lastname, userData.number]);
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
        console.error('Error recording payment:', error);
        res.status(500).json({ error: 'Failed to record payment' });
    }
});


app.post('/create-payment-intent', async (req, res) => {
    const { amount, paymentMethodType } = req.body;

    // Input validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }
    if (!paymentMethodType || typeof paymentMethodType !== 'string') {
        return res.status(400).json({ error: 'Invalid payment method type' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Ensure amount is an integer
            currency: process.env.CURRENCY || 'gbp', // Use environment variable
            payment_method_types: [paymentMethodType],
            metadata: {
                userId: req.user?.id || 'guest', // Add metadata
                timestamp: new Date().toISOString(),
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});


const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for multer

// Endpoint to handle image uploads
const FormData = require('form-data'); // Ensure you have 'form-data' installed

app.post('/token', (req, res) => {
    const { accessToken } = req.body; // Expecting the token from the frontend

    if (!accessToken) {
        return res.status(400).json({ message: 'Access token is required' });
    }

    // Store the token in the session or database
    req.session.imgurAccessToken = accessToken; // Store in session for demonstration
    // Alternatively, save to a database for persistent storage if needed

    console.log('Access Token Received:', accessToken);
    res.status(200).json({ message: 'Access token received and stored' });
});


app.post('/products', upload.single('image'), async (req, res) => {
    const accessToken = req.session.imgurAccessToken;
    if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized: No access token found' });
    }
    try {
        const { name, price } = req.body;
        if (!name || !price || !req.file) {
            return res.status(400).json({ error: 'Name, price, and image are required' });
        }

        // Resize and compress image
        const compressedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 1280, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 70 })
            .toBuffer();

        // Upload to Imgur
        const base64Image = compressedImageBuffer.toString('base64');
        const imgurResponse = await axios.post('https://api.imgur.com/3/image', {
            // Replace with your image data
            image: 'base64Image',
            type: 'base64',
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const imageUrl = imgurResponse.data.data.link;

        // Save to database
        const result = await pool.query(
            'INSERT INTO "products" (img, name, price) VALUES ($1, $2, $3) RETURNING *',
            [imageUrl, name, parseFloat(price)]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Product upload error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to upload product', details: error.message });
    }
});





// Route to get products
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "products"');
        res.json(result.rows);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});








// app.post('/products', async (req, res) => {
//     const { name, price, img } = req.body;
//     try {
//         const result = await pool.query(
//             'INSERT INTO "products" (name, price, img) VALUES ($1, $2, $3) RETURNING *',
//             [name, price, img]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error adding product:', error);
//         res.status(500).json({ error: 'Failed to add product' });
//     }
// });

// Route to update a product
app.put('/products/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const img = req.file ? req.file.path : null; // Assuming file upload middleware

    try {
        const result = await pool.query(
            'UPDATE "products" SET name = $1, price = $2, img = COALESCE($3, img) WHERE id = $4 RETURNING *',
            [name, parseFloat(price), img, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Route to delete a product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM "products" WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// // Fetch cart items


app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log('Fetching cart items for userId:', userId);

    try {
  
        
       const cartItems = await pool.query(`
SELECT ci.id, ci.product_id, ci.user_id, ci.quantity, 
       p.name AS product_name, p.price 
FROM "cart_items" ci 
LEFT JOIN "products" p ON ci.product_id = p.id 
WHERE ci.user_id = $1
`, [userId]);

        console.log('Raw cart items query result:', cartItems.rows);

        if (cartItems.rows.length === 0) {
            console.log(`No cart items found for user: ${userId}`);
            return res.status(404).json({ error: 'No cart items found for this user' });
        }

        const updatedCart = cartItems.rows.map(item => ({
            id: item.id,
            userId: item.user_id,
            productId: item.product_id,
            quantity: item.quantity,
            productName: item.product_name || 'Unknown Product', // Handle missing data
            price: item.price ? parseFloat(item.price) : 0.0     // Handle missing data
        }));

        console.log('Final updated cart structure:', updatedCart);

        return res.json(updatedCart);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



app.post('/cart', async (req, res) => {
    const { userId, product, quantity } = req.body;

    // Log the incoming request body
    console.log('Request body:', req.body);

    // Validate incoming data
    if (!userId || !product || !product.id || !quantity) {
        console.error('Missing fields:', { userId, product, quantity });
        return res.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
    

    // Log product details
    console.log('Product details:', product);
    
    try {
        // Check if the product already exists in the cart
        const existingItem = await pool.query(
            'SELECT * FROM "cart_items" WHERE user_id = $1 AND product_id = $2',
            [userId, product.id]
        );

        if (existingItem.rows.length > 0) {
            // Update quantity if item exists
            await pool.query(
                'UPDATE "cart_items" SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
                [quantity, userId, product.id]
            );
            console.log('Updated quantity for:', { quantity, userId, productId: product.id });
        } else {
            // Convert price to a number
            const price = parseFloat(product.price);

            // Log the price to verify its value and type
            console.log('Price before insertion:', price);

            // Check for invalid price
            if (isNaN(price)) {
                console.error('Invalid price value:', product.price);
                return res.status(400).json({ error: 'Bad Request: Invalid price value' });
            }

            // Insert new item into the cart
            await pool.query(
                'INSERT INTO "cart_items" (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, product.id, quantity] // Ensure correct order
            );
            console.log('Inserted new item:', { userId, productId: product.id, quantity, price });
        }

        // Fetch updated cart items
        const cartItems = await pool.query(`
        SELECT ci.id, ci.product_id, ci.user_id, ci.quantity, 
               p.name AS product_name, p.price 
        FROM "cart_items" ci 
        LEFT JOIN "products" p ON ci.product_id = p.id 
        WHERE ci.user_id = $1
    `, [userId]);

    console.log('Cart items after update:', cartItems.rows);

    const updatedCart = cartItems.rows.map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        quantity: item.quantity,
        productName: item.product_name,
        price: parseFloat(item.price)
    }));

    console.log('Updated cart structure after addition:', updatedCart);
    return res.json(updatedCart);

    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
});





app.delete('/cart', async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    try {
        console.log('Removing item from cart:', { userId, productId });
        // Delete the item from the cart
        await pool.query('DELETE FROM "cart_items" WHERE user_id = $1 AND product_id = $2', [userId, productId]);

        // Fetch the updated cart items
        const cartItems = await pool.query('SELECT * FROM "cart_items" WHERE user_id = $1', [userId]);
        console.log('Cart items after deletion:', cartItems.rows);

        // Return the updated cart items
        return res.json(cartItems.rows);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



// Route to get total sales data for the seller's dashboard
app.get('/sales', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                SUM(amount) AS total,         
                COUNT(DISTINCT email) AS total_buyer,  
                COUNT(*) AS sales_count               
            FROM "sales"`
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No sales data available' });
        }

        res.json(result.rows[0]); // Return total sales information
    } catch (error) {
        console.error('Error fetching total sales:', error);
        res.status(500).json({ error: 'Failed to fetch total sales data' });
    }
});

app.get('/orders', async (req, res) => {
    try { 
        console.log('Fetching all orders');
        const result = await pool.query(
            `SELECT 
                id,
                amount,
                currency,
                email,
                address,
                firstname,
                lastname,
                phone_number,
                payment_status,
                created_at,
                updated_at
            FROM "orders"`
        );

        console.log('Fetching all orders', result.rows);
  
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No orders available' });
        }

        res.json(result.rows); // Return all orders
        console.log('Fetching all orders', result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});





app.post('/login', passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
    const user = req.user; // Passport attaches the authenticated user to req
    console.log("Authenticated user:", user);
    console.log("Session info:", req.session);
    res.json({
        user: req.user     
    });
  });

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next(); // User is authenticated and is an admin
    }
    res.status(403).json({ error: "Access denied" }); // Forbidden
}


// Use this middleware on the admin route

app.get("/check-auth", (req, res) => {
    console.log('User :', req.user); // Log the user object
    console.log('Is authenticated:', req.isAuthenticated()); // Log authentication status

    if (req.isAuthenticated()) {
        return res.json({
            authenticated: true,
            user: {
                id: req.user.id,
                email: req.user.email,
                isAdmin: req.user.isAdmin 
            }
        });
    }
    res.json({ authenticated: false });
});

app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ error: "Failed to log out" });
        }
        res.json({ message: "Logout successful" }); // Change to JSON response
    });
});

app.get('/admin', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'admin.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname,  'build', 'index.html'));
});

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname,  'build', 'index.html'));
});

app.get('/display', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Handle all other routes by sending the React app's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

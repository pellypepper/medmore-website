

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db');

// Import route modules
const authRoutes = require('./backend/auth');
const productRoutes = require('./backend/products');
const cartRoutes = require('./backend/cart');
const paymentRoutes = require('./backend/payment');
const salesRoutes = require('./backend/sales');

// Import middleware
const { configurePassport } = require('./backend/passport');

const app = express();
const PORT = process.env.PORT || 10000;

// Configure CORS
app.use(cors({
    origin: process.env.REACT_APP_API_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With'
    ],
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Configure session
const sessionStore = new pgSession({
    pool: pool, 
    tableName: 'session' 
});

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'djfjdsjsk',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 180 * 60 * 1000, 
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production'
    } 
}));

// Initialize and configure passport
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
    console.log('Session:', req.session);
    console.log('User:', req.user);
    next();
  });
// routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', salesRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
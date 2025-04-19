// routes/sales.js

const express = require('express');
const router = express.Router();
const { sales, orders } = require('../controller/sales');
const { isAdmin } = require('../middleware/isAdmin');


router.get('/sales', isAdmin, sales);


router.get('/orders', isAdmin, orders);

module.exports = router;
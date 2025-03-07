// routes/sales.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAdmin } = require('../middleware/passport-config');

// Get total sales data
router.get('/sales', isAdmin, async (req, res) => {
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

// Get orders
router.get('/orders', isAdmin, async (req, res) => {
  try {
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

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No orders available' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
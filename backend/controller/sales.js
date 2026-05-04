
const pool = require('../db');

// Get orders
const orders = async (req, res) => {
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
  
     
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Get total sales data
const sales =  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
          SUM(amount) AS total,         
          COUNT(DISTINCT email) AS total_buyer,  
          COUNT(*) AS sales_count               
        FROM "sales"`
      );
  
    
  
      res.json(result.rows[0]); // Return total sales information
    } catch (error) {
      console.error('Error fetching total sales:', error);
      res.status(500).json({ error: 'Failed to fetch total sales data' });
    }
  
}

module.exports = { sales, orders };

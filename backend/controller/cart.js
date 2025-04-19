
const pool = require('../../db');



// Get cart items for a user
const userId = async (req, res) => {
    const { userId } = req.params;
  
   
  
    try {
      const cartItems = await pool.query(
        `SELECT ci.id, ci.product_id, ci.user_id, ci.quantity, 
               p.name AS product_name, p.price 
        FROM "cart_items" ci 
        LEFT JOIN "products" p ON ci.product_id = p.id 
        WHERE ci.user_id = $1`,
        [userId]
      );
  
     
  
      if (cartItems.rows.length === 0) {
      
        return res.json([]);
      }
  
      const updatedCart = cartItems.rows.map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        quantity: item.quantity,
        productName: item.product_name || 'Unknown Product',
        price: item.price ? parseFloat(item.price) : 0.0
      }));
  
      return res.json(updatedCart);
    } catch (error) {
   
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

// Add item to cart
  const addItem =  async (req, res) => {
    const { userId, product, quantity } = req.body;
  
    if (!userId || !product || !product.id || !quantity) {
  
      return res.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
  
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
    
      } else {
        // Convert price to a number
        const price = parseFloat(product.price);
  
  
        if (isNaN(price)) {
          console.error('Invalid price value:', product.price);
          return res.status(400).json({ error: 'Bad Request: Invalid price value' });
        }
  
        await pool.query(
          'INSERT INTO "cart_items" (user_id, product_id, quantity) VALUES ($1, $2, $3)',
          [userId, product.id, quantity]
        );
  
      }
  
      // Fetch updated cart items
      const cartItems = await pool.query(
        `SELECT ci.id, ci.product_id, ci.user_id, ci.quantity, 
               p.name AS product_name, p.price 
        FROM "cart_items" ci 
        LEFT JOIN "products" p ON ci.product_id = p.id 
        WHERE ci.user_id = $1`,
        [userId]
      );
  
      const updatedCart = cartItems.rows.map(item => ({
        id: item.id,
        userId: item.user_id,
        productId: item.product_id,
        quantity: item.quantity,
        productName: item.product_name,
        price: parseFloat(item.price)
      }));
  
      return res.json(updatedCart);
    } catch (error) {
  
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
// Remove item from cart
  const deleteItem = async (req, res) => {
    const { userId, productId } = req.body;
  
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }
  
    try {
  
  
      await pool.query('DELETE FROM "cart_items" WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  
      const cartItems = await pool.query('SELECT * FROM "cart_items" WHERE user_id = $1', [userId]);
  
      // Return the updated cart items
      return res.json(cartItems.rows);
    } catch (error) {
     
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = { userId, addItem, deleteItem };
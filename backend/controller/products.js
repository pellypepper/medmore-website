const pool = require('../../db');
const transformCloudinaryUrl = require('../utils/transformCloudinaryUrl');

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price || !req.file) {
      return res.status(400).json({ error: 'Name, price, and image are required' });
    }

    const originalImageUrl = req.file.path;
    const optimizedImageUrl = transformCloudinaryUrl(originalImageUrl);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Price must be a valid number' });
    }

    const result = await pool.query(
      'INSERT INTO "products" (img, name, price) VALUES ($1, $2, $3) RETURNING *',
      [optimizedImageUrl, name, parsedPrice]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload product', details: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "products"');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const img = req.file ? req.file.path : null;

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
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM "products" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

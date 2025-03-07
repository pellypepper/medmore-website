

const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { isAdmin } = require('./passport');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'test',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ storage: storage });

// Helper function to transform Cloudinary URL
function transformCloudinaryUrl(url) {
  // Regular expression to match Cloudinary URL pattern
  const regex = /https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/([^\/]+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    console.warn('Could not parse Cloudinary URL, returning original URL');
    return url;
  }
  
  const [_, cloudName, uploadParams, path] = match;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_1280,c_limit,q_70,f_webp/${path}`;
}

// Create a product
router.post('/', isAdmin, upload.single('image'), async (req, res) => {
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
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "products"');
    res.json(result.rows);
  } catch (error) {

    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Update a product
router.put('/:id', isAdmin, upload.single('image'), async (req, res) => {
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
});

// Delete a product
router.delete('/:id', isAdmin, async (req, res) => {
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
});

module.exports = router;
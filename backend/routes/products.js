const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { isAdmin } = require('../middleware/isAdmin');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controller/products');

// Routes
router.post('/', isAdmin, upload.single('image'), createProduct);
router.get('/', getAllProducts);
router.put('/:id', isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;

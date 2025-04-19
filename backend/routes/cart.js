
const express = require('express');
const router = express.Router();


const {
  addItem,
  deleteItem,
  userId,
} = require('../controller/cart');


router.get('/:userId',  userId);



router.post('/',  addItem);



router.delete('/', deleteItem);

module.exports = router;
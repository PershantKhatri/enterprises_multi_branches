const express = require('express');
const router = express.Router();
const { 
  getShops, 
  createShop, 
  shopLogin,
  getShopById 
} = require('../controllers/shopController');

router.post('/login', shopLogin);
router.get('/', getShops);
router.post('/', createShop);
router.get('/:id', getShopById);

module.exports = router;
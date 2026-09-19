const express = require('express');
const router = express.Router();
const { 
  registerTenant, 
  loginTenant, 
  shopLogin 
} = require('../controllers/authController');

// Tenant Routes
router.post('/register', registerTenant);
router.post('/login', loginTenant);

// Shop Manager Login Route (Yeh zaroori hai!)
router.post('/shop-login', shopLogin);

module.exports = router;
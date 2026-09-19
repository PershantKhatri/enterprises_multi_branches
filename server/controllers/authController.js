const User = require('../models/User');
const Shop = require('../models/Shop');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { tenant_id: user._id, role: user.role, status: user.status },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '30d' }
  );
};

exports.registerTenant = async (req, res) => {
  try {
    const name = req.body.name || req.body.fullName;
    const { email, password } = req.body;
    const businessName = req.body.businessName || name;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      businessName,
      role: 'tenant_admin',
      status: 'PENDING'
    });

    return res.status(201).json({
      message: 'Registration successful! Request sent to Super Admin for approval.',
      status: user.status
    });

  } catch (error) {
    console.error('Register Controller Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

exports.loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({ 
        message: 'Your account is pending approval from Super Admin.' 
      });
    }

    if (user.status === 'SUSPENDED' || user.status === 'REJECTED') {
      return res.status(403).json({ 
        message: 'Your account has been disabled/blocked.' 
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      businessName: user.businessName,
      role: user.role,
      status: user.status,
      token: generateToken(user)
    });

  } catch (error) {
    console.error('Login Controller Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// Shop Manager Login - Queries the Shop model directly
exports.shopLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(404).json({ message: 'Shop manager not found with this email' });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        shopId: shop._id, 
        tenant_id: shop.tenant_id || shop.tenantId, 
        role: shop.role || 'shop_manager' 
      },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: shop._id,
        shopName: shop.shopName || shop.name,
        email: shop.email,
        role: 'shop_manager'
      }
    });

  } catch (error) {
    console.error('Shop Login Controller Error:', error);
    return res.status(500).json({ message: error.message || 'Server Error' });
  }
};
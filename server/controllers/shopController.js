const Shop = require('../models/Shop');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// @desc    Get shops strictly isolated to the logged-in tenant/user only
exports.getShops = async (req, res) => {
  try {
    let tenantId = req.tenant_id || (req.user && (req.user._id || req.user.id || req.user.tenant_id));
    
    if (!tenantId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        tenantId = decoded.tenant_id || decoded.tenantId || decoded.id || decoded._id || decoded.shopId;
      } catch (e) {}
    }
    
    if (!tenantId) {
      return res.status(200).json([]);
    }

    const tenantObjectId = mongoose.Types.ObjectId.isValid(tenantId) 
      ? new mongoose.Types.ObjectId(tenantId) 
      : tenantId;

    // Strict Query: Sirf wahi shops jo is user ki apni hain (Excluding unassigned/shared shops)
    const query = {
      $or: [
        { owner: tenantId },
        { owner: tenantObjectId },
        { tenantId: tenantId },
        { tenantId: tenantObjectId },
        { tenant_id: tenantId },
        { tenant_id: tenantObjectId }
      ].filter(Boolean)
    };

    let shops = await Shop.find(query);

    // Extra Security Filter: Kisi bhi ghalat ya "Assigned Shop" ko mukammal block kar dein jo is user ki nahi honi chahiye
    shops = shops.filter(s => {
      const name = (s.shopName || s.name || '').toLowerCase();
      return !name.includes('assigned shop') && !name.includes('test shop');
    });

    return res.status(200).json(shops);
  } catch (error) {
    console.error('Get Shops Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// 2. Create a shop
exports.createShop = async (req, res) => {
  try {
    let ownerId = req.user && (req.user._id || req.user.id || req.user.tenant_id);
    let tenantIdValue = req.tenant_id || req.body.tenant_id || req.body.tenantId;

    if ((!tenantIdValue || !ownerId) && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenIdentifier = decoded.tenant_id || decoded.tenantId || decoded.id || decoded._id || decoded.shopId;
        ownerId = ownerId || tokenIdentifier;
        tenantIdValue = tenantIdValue || tokenIdentifier;
      } catch (err) {}
    }

    const finalOwnerId = (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) 
      ? ownerId 
      : null;

    const finalTenantId = (tenantIdValue && mongoose.Types.ObjectId.isValid(tenantIdValue)) 
      ? tenantIdValue 
      : finalOwnerId;

    let hashedPassword = req.body.password;
    if (hashedPassword && !hashedPassword.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(hashedPassword, salt);
    }

    const shopData = {
      ...req.body,
      password: hashedPassword,
      owner: finalOwnerId,
      tenantId: finalTenantId,
      tenant_id: finalTenantId
    };

    const newShop = new Shop(shopData);
    const savedShop = await newShop.save();
    
    return res.status(201).json(savedShop);
  } catch (error) {
    console.error('Create Shop Error:', error);
    return res.status(400).json({ message: error.message });
  }
};

// 3. Shop Login
exports.shopLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found with this email" });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        shopId: shop._id, 
        tenant_id: shop.tenant_id || shop.tenantId, 
        role: shop.role || 'shop_manager'
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: "Shop Login Successful!",
      token,
      shop: {
        id: shop._id,
        shopName: shop.shopName || shop.name,
        email: shop.email,
        address: shop.address,
        category: shop.category
      }
    });

  } catch (error) {
    console.error('Shop Login Error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// 4. Get single shop by ID
exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.error('Get Shop By ID Error:', error);
    return res.status(500).json({ message: error.message });
  }
};
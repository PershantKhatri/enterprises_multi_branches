const Product = require('../models/Product');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// @desc    Create a new product strictly tied to the active shop
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, category, shopId, shop_id } = req.body;
    
    // Direct Token Decode for robustness
    let shopManagerId = null;
    let tenantOwnerId = null;

    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        shopManagerId = decoded.shopId || decoded.shop_id;
        tenantOwnerId = decoded.tenant_id || decoded.tenantId || decoded.id || decoded._id;
      } catch (e) {}
    }

    let targetShopId = shopManagerId || req.shopId || shopId || shop_id || req.headers['x-shop-id'];
    let shop = null;
    
    if (targetShopId && mongoose.Types.ObjectId.isValid(targetShopId)) {
      shop = await Shop.findById(targetShopId);
    }

    if (!shop && tenantOwnerId) {
      const ownerObjectId = mongoose.Types.ObjectId.isValid(tenantOwnerId) ? new mongoose.Types.ObjectId(tenantOwnerId) : tenantOwnerId;
      shop = await Shop.findOne({ 
        $or: [
          { owner: tenantOwnerId }, 
          { owner: ownerObjectId },
          { tenantId: tenantOwnerId },
          { tenant_id: tenantOwnerId }
        ].filter(Boolean) 
      });
    }

    if (!shop) {
      return res.status(400).json({ message: 'Please select or create a valid shop first before adding products!' });
    }

    const newProduct = new Product({
      name,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      category: category || 'General',
      shopId: shop._id,
      shop_id: shop._id,
      tenantId: shop.tenant_id || shop.tenantId || tenantOwnerId || shop.owner,
      tenant_id: shop.tenant_id || shop.tenantId || tenantOwnerId || shop.owner
    });

    await newProduct.save();
    return res.status(201).json({ 
      success: true,
      message: 'Product created successfully', 
      product: newProduct 
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get products with strict isolation between Shop Managers and Tenant Owners
exports.getProducts = async (req, res) => {
  try {
    let shopManagerId = null;
    let tenantOwnerId = null;

    // Directly decode token to identify who is making the request
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        shopManagerId = decoded.shopId || decoded.shop_id;
        tenantOwnerId = decoded.tenant_id || decoded.tenantId || decoded.id || decoded._id;
      } catch (e) {}
    }

    // Fallback to req.user if available
    if (!shopManagerId && req.user) {
      shopManagerId = req.user.shopId || req.user.shop_id;
    }
    if (!tenantOwnerId && req.user) {
      tenantOwnerId = req.user._id || req.user.id || req.user.tenant_id;
    }

    // 1. SCENARIO A: Shop Manager Logged In
    if (shopManagerId) {
      const shopObjectId = mongoose.Types.ObjectId.isValid(shopManagerId) ? new mongoose.Types.ObjectId(shopManagerId) : shopManagerId;
      const shopIdString = shopManagerId.toString();

      // Sirf aur sirf is specific shop ke products nikalain, koi fallback nahi!
      const managerProducts = await Product.find({
        $or: [
          { shopId: shopObjectId },
          { shopId: shopIdString },
          { shop_id: shopObjectId },
          { shop_id: shopIdString }
        ]
      }).sort({ createdAt: -1 });

      return res.status(200).json(managerProducts);
    }

    // 2. SCENARIO B: Tenant Owner (Anil / Geo) Logged In
    if (!tenantOwnerId) {
      return res.status(200).json([]);
    }

    const ownerObjectId = mongoose.Types.ObjectId.isValid(tenantOwnerId) ? new mongoose.Types.ObjectId(tenantOwnerId) : tenantOwnerId;

    // Find all shops belonging strictly to this owner
    const ownerShops = await Shop.find({ 
      $or: [
        { owner: tenantOwnerId }, 
        { owner: ownerObjectId },
        { tenantId: tenantOwnerId },
        { tenantId: ownerObjectId },
        { tenant_id: tenantOwnerId },
        { tenant_id: ownerObjectId }
      ].filter(Boolean)
    });
    
    // Filter out unwanted / test shops
    const validShops = ownerShops.filter(s => {
      const name = (s.shopName || s.name || '').toLowerCase();
      return !name.includes('assigned') && !name.includes('test shop') && name.trim() !== '';
    });

    const validShopIds = validShops.map(s => s._id);
    const validShopIdStrings = validShopIds.map(id => id.toString());

    if (validShopIds.length === 0) {
      return res.status(200).json([]);
    }

    // Query products strictly for this owner's valid shops
    const products = await Product.find({
      $or: [
        { shopId: { $in: validShopIds.concat(validShopIdStrings) } },
        { shop_id: { $in: validShopIds.concat(validShopIdStrings) } }
      ]
    }).sort({ createdAt: -1 });

    const finalProducts = products.filter(p => {
      const pShop = String(p.shopId || p.shop_id);
      return validShopIdStrings.includes(pShop);
    });

    return res.status(200).json(finalProducts);
  } catch (error) {
    console.error('Get Products Error:', error);
    return res.status(500).json({ message: error.message });
  }
};
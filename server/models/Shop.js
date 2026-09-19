const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  address: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
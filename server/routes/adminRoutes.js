const express = require('express');
const router = express.Router();
const { getAllTenants, updateTenantStatus } = require('../controllers/adminController');

router.get('/tenants', getAllTenants);
router.put('/tenants/:id/status', updateTenantStatus);

module.exports = router;
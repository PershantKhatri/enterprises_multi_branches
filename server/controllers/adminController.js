const User = require('../models/User');

// Get all tenant registration requests
exports.getAllTenants = async (req, res) => {
  try {
    // Super admin accounts ko exclude karke sare tenants fetch karein
    const tenants = await User.find({ role: { $ne: 'super_admin' } })
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json(tenants);
  } catch (error) {
    console.error('Fetch Tenants Error:', error);
    return res.status(500).json({ message: 'Failed to fetch tenants' });
  }
};

// Update Tenant Status (APPROVED, REJECTED, SUSPENDED)
exports.updateTenantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    user.status = status;
    await user.save();

    return res.json({ message: `Tenant status updated to ${status}`, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
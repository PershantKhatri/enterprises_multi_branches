// src/pages/ShopDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store, Package, DollarSign, LogOut, Plus, X, Loader2, Mail, Layers } from 'lucide-react';
import axios from 'axios';

export default function ShopDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: user?.category || 'General'
  });
  const [submitting, setSubmitting] = useState(false);

  const shopId = user?.id || user?._id;

  const fetchData = async () => {
    try {
      const authToken = token || localStorage.getItem('token');

      // 1. Shop details fetch karein (Safe fallback ke sath)
      try {
        const shopRes = await axios.get(`http://localhost:4000/api/shops/${shopId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setShopData(shopRes.data);
      } catch (shopErr) {
        console.warn('Shop details endpoint skipped or not found:', shopErr.message);
        setShopData({ shopName: user?.shopName, revenue: 0 });
      }

      // 2. Is specific shop ke hi products fetch karein (shopId query param ke sath)
      const productsRes = await axios.get(`http://localhost:4000/api/products?shopId=${shopId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setProducts(productsRes.data);

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Handle Product Creation
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const authToken = token || localStorage.getItem('token');
      
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category || 'General',
        shopId: shopId,
        shop_id: shopId
      };

      await axios.post('http://localhost:4000/api/products', payload, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // Form reset aur modal close karein
      setFormData({ name: '', price: '', stock: '', category: user?.category || 'General' });
      setIsModalOpen(false);
      
      // List refresh karein
      fetchData();
    } catch (err) {
      console.error('Error adding product:', err);
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-8 space-y-8 relative select-none">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#05070b] p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Store className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Welcome, {user?.shopName}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Exclusive Branch Manager Portal & Inventory Hub</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-none bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add Product
          </button>
          <button 
            onClick={handleLogout}
            className="flex-1 md:flex-none bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.2]" /> Sign Out
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#05070b] border border-slate-800/80 p-5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Branch Revenue</h3>
              <p className="text-2xl font-black mt-2 text-emerald-400">₹{shopData?.revenue || 0}</p>
            </div>
            <div className="p-2.5 bg-[#090d16] border border-slate-800 text-slate-400 rounded-xl group-hover:text-emerald-400 transition-colors">
              <DollarSign className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>

        <div className="bg-[#05070b] border border-slate-800/80 p-5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Manager Email</h3>
              <p className="text-xs font-bold mt-2.5 text-white truncate max-w-[220px]">{user?.email}</p>
            </div>
            <div className="p-2.5 bg-[#090d16] border border-slate-800 text-slate-400 rounded-xl group-hover:text-emerald-400 transition-colors">
              <Mail className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>

        <div className="bg-[#05070b] border border-slate-800/80 p-5 rounded-2xl shadow-xl hover:border-emerald-500/30 transition-all group">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Category</h3>
              <p className="text-sm font-bold mt-2.5 text-white">{user?.category || 'General'}</p>
            </div>
            <div className="p-2.5 bg-[#090d16] border border-slate-800 text-slate-400 rounded-xl group-hover:text-emerald-400 transition-colors">
              <Layers className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Inventory Section */}
      <div className="max-w-5xl mx-auto bg-[#05070b] border border-slate-800/80 p-6 rounded-2xl space-y-5 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <h2 className="text-sm font-bold flex items-center gap-2 text-white">
            <Package className="w-4 h-4 text-emerald-400 stroke-[2.2]" /> Branch Products & Inventory
          </h2>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg tracking-wide">
            {products.length} Items Listed
          </span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
            <p className="text-xs font-bold text-white">No products found for this branch yet.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Product" to list your first inventory item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div 
                key={product._id || product.id} 
                className="bg-[#090d16] border border-slate-800/80 p-4.5 rounded-xl flex justify-between items-center hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
              >
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md">
                      Stock: {product.stock || 0} units
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                      {product.category || 'General'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Price</span>
                  <span className="text-base font-black text-emerald-400">${product.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#05070b] border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">Add New Product</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Input inventory details for your branch catalog</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 bg-[#090d16] rounded-xl border border-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Slim Fit Jeans / Protein Powder"
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="99.00"
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Stock Quantity</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="50"
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="General"
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-[#090d16] text-slate-300 hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// src/pages/Shops.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Plus, Store, MapPin, Tag, Loader2, Mail, X } from 'lucide-react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    category: '',
    address: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchShops = async () => {
    try {
      const { data } = await API.get('/shops');
      setShops(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/shops', formData);
      setFormData({ shopName: '', category: '', address: '', email: '', password: '' });
      setShowModal(false);
      fetchShops();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add shop');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-8 space-y-8 select-none">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#05070b] p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Branches / Shops</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Manage all physical and virtual store branches & credentials.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Shop
        </button>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : shops.length === 0 ? (
        <div className="max-w-6xl mx-auto bg-[#05070b] border border-slate-800/80 rounded-2xl p-16 text-center shadow-2xl">
          <Store className="w-12 h-12 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-white">No Branches Registered</h3>
          <p className="text-xs text-slate-400 mt-1">Click "Add New Shop" to create your first branch and manager account.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <div 
              key={shop._id || shop.id} 
              className="bg-[#05070b] border border-slate-800/80 p-5 rounded-2xl shadow-xl hover:border-emerald-500/40 hover:shadow-emerald-500/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-[#090d16] border border-slate-800 text-slate-400 rounded-xl group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                    <Store className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm tracking-tight group-hover:text-emerald-400 transition-colors">{shop.shopName}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md mt-1 uppercase tracking-wide">
                      <Tag className="w-3 h-3 stroke-[2.2]" /> {shop.category || 'General'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="font-medium text-slate-200 truncate">{shop.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
                  <span className="text-slate-300 leading-relaxed">{shop.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Shop Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#05070b] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Add New Branch / Shop</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Register a new branch and manager credentials</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-2 bg-[#090d16] rounded-xl border border-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Shop Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Saddar Main Branch"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Fitness / Apparel"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Manager Email (For Login)</label>
                <input
                  required
                  type="email"
                  placeholder="manager@branch.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Manager Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Address</label>
                <textarea
                  required
                  placeholder="Complete location address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 transition shadow-inner resize-none"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  Save Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
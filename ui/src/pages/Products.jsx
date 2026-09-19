// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Package, Plus, X, Building, Filter } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    shopId: ''
  });

  // Fetch Shops & Products using centralized API instance
  const fetchData = async () => {
    try {
      const [shopsRes, productsRes] = await Promise.all([
        API.get('/shops'),
        API.get('/products')
      ]);
      
      const shopData = shopsRes.data || [];
      setShops(shopData);
      setProducts(productsRes.data || []);
      
      // Auto-select first shop ID in modal form if available
      if (shopData.length > 0 && !formData.shopId) {
        const firstShopId = shopData[0]._id || shopData[0].id;
        setFormData(prev => ({ ...prev, shopId: firstShopId }));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedShop = formData.shopId || (shops[0] && (shops[0]._id || shops[0].id));

      if (!selectedShop) {
        alert("Please select a valid shop!");
        return;
      }

      const payload = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category || 'General',
        shopId: selectedShop,
        shop_id: selectedShop
      };

      await API.post('/products', payload);
      setIsModalOpen(false);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        shopId: shops[0]?._id || shops[0]?.id || ''
      });
      fetchData(); // Reload products grid
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  // Filter products safely based on selected shop tab
  const filteredProducts = selectedShopId === 'ALL' 
    ? products 
    : products.filter(p => {
        const pShopId = p.shopId || p.shop_id || (p.shop && (p.shop._id || p.shop.id));
        if (!pShopId) return false;
        return pShopId.toString() === selectedShopId.toString();
      });

  return (
    <div className="p-8 bg-[#090d16] min-h-screen text-slate-100 select-none">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-[#05070b] p-6 rounded-2xl border border-slate-800/80 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Package className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Products & Inventory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Manage dynamic stock levels and pricing across registered branches.</p>
        </div>
        
        <button
          onClick={() => {
            if (shops.length === 0) {
              alert("Please create a Shop in 'My Shops' tab first!");
              return;
            }
            const defaultShopId = shops[0]._id || shops[0].id;
            setFormData(prev => ({ ...prev, shopId: defaultShopId }));
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 px-4.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" /> Add Product
        </button>
      </div>

      {/* Shop Filter Tabs */}
      {shops.length > 0 && (
        <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-3 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1 uppercase tracking-wider text-[10px]">
            <Filter size={13} className="stroke-[2.5]" /> Filter Shop:
          </span>
          <button
            onClick={() => setSelectedShopId('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedShopId === 'ALL'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold'
                : 'bg-[#05070b] text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/80'
            }`}
          >
            All Shops ({products.length})
          </button>
          {shops.map((s) => {
            const sId = s._id || s.id;
            const sName = s.name || s.shopName || 'Shop';
            const count = products.filter(p => {
              const pShopId = p.shopId || p.shop_id || (p.shop && (p.shop._id || p.shop.id));
              return pShopId && pShopId.toString() === sId.toString();
            }).length;
            
            return (
              <button
                key={sId}
                onClick={() => setSelectedShopId(sId)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedShopId === sId
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 font-bold'
                    : 'bg-[#05070b] text-slate-400 hover:bg-slate-900 hover:text-white border border-slate-800/80'
                }`}
              >
                <Building size={14} className="stroke-[2.2]" />
                {sName} 
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                  selectedShopId === sId ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content / States */}
      {shops.length === 0 ? (
        <div className="bg-[#05070b] border border-slate-800/80 rounded-2xl p-16 text-center my-8 shadow-2xl">
          <Building className="w-12 h-12 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-white">No Shops Found</h3>
          <p className="text-xs text-slate-400 mt-1">Please go to your shops section and create a branch first.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#05070b] border border-slate-800/80 rounded-2xl p-16 text-center my-8 shadow-2xl">
          <Package className="w-12 h-12 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
          <h3 className="text-base font-bold text-white">No Products in this Shop</h3>
          <p className="text-xs text-slate-400 mt-1">Click "+ Add Product" to add inventory for this specific branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const currentShop = shops.find(s => {
              const sId = s._id || s.id;
              const pShopId = p.shopId || p.shop_id || (p.shop && (p.shop._id || p.shop.id));
              return sId && pShopId && sId.toString() === pShopId.toString();
            });

            return (
              <div 
                key={p._id || p.id} 
                className="bg-[#05070b] border border-slate-800/80 p-5 rounded-2xl hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{p.name}</h4>
                      <span className="inline-block mt-1.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg tracking-wide">
                        {p.category || 'General'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-[#090d16] border border-slate-800 text-slate-400 rounded-xl group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                      <Package className="w-4 h-4 stroke-[2.2]" />
                    </div>
                  </div>
                  
                  <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5 bg-[#090d16] p-2.5 rounded-xl border border-slate-800/60 font-medium">
                    <Building size={13} className="text-emerald-400 stroke-[2.2]" />
                    <span className="truncate">Branch: <strong className="text-slate-200">{currentShop?.name || currentShop?.shopName || 'Assigned Shop'}</strong></span>
                  </div>
                </div>

                <div className="mt-5 flex justify-between items-center text-xs border-t border-slate-800/80 pt-3.5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Price</span>
                    <span className="text-emerald-400 font-black text-base">${p.price}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Stock Level</span>
                    <span className="text-white font-bold bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">{p.stock} units</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#05070b] border border-slate-800 p-6 rounded-2xl max-w-md w-full relative shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Add New Product</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Input inventory details for your branch</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white p-2 bg-[#090d16] rounded-xl border border-slate-800 transition cursor-pointer"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Select Shop / Branch</label>
                <select
                  value={formData.shopId || (shops[0] && (shops[0]._id || shops[0].id))}
                  onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  required
                >
                  {shops.map((s) => (
                    <option key={s._id || s.id} value={s._id || s.id} className="bg-[#090d16] text-white">
                      {s.name || s.shopName || 'Branch Shop'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Protein Powder / Gym Gloves"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fitness / Accessories"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, stock: val }));
                    }}
                    className="w-full bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Save Product Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
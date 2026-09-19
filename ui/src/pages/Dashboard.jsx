// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Store, Package, TrendingUp, Users, ArrowUpRight, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ shopsCount: 0, productsCount: 0 });
  const [recentShops, setRecentShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [shopsRes, productsRes] = await Promise.all([
          API.get('/shops'),
          API.get('/products')
        ]);

        const shops = shopsRes.data || [];
        const products = productsRes.data || [];

        setStats({
          shopsCount: shops.length,
          productsCount: products.length
        });
        setRecentShops(shops.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-[#090d16]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-[#090d16] min-h-screen text-slate-100 select-none">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-[#05070b] to-[#090d16] rounded-3xl p-6 sm:p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 tracking-wide uppercase shadow-sm">
            Tenant Active Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight text-white">
            Welcome back, {user?.name || 'Partner'}!
          </h1>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed font-medium">
            Manage your stores, track stock levels, and scale your business operations seamlessly from your central SaaS portal.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#05070b] p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Shops</span>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Store className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.shopsCount}</span>
            <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-0.5">
              Live <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </div>

        <div className="bg-[#05070b] p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
              <Package className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-white">{stats.productsCount}</span>
            <span className="text-teal-400 text-[11px] font-bold flex items-center gap-0.5">
              Active <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
          </div>
        </div>

        <div className="bg-[#05070b] p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Identity</span>
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-bold text-white block truncate">
              {user?.businessName || 'N/A'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Isolated Tenant Account</span>
          </div>
        </div>

        <div className="bg-[#05070b] p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-xl hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Plan</span>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <TrendingUp className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-bold text-emerald-400 block">Pro Plan</span>
            <span className="text-[11px] text-slate-400 font-medium">Unlimited Stores</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Shops */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 bg-[#05070b] p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active Stores</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your created branches and shop setups</p>
            </div>
            <Link
              to="/shops"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition shrink-0"
            >
              View All <ArrowUpRight className="w-4 h-4 stroke-[2.2]" />
            </Link>
          </div>

          {recentShops.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-[#090d16]/50">
              <Store className="w-10 h-10 text-slate-600 mx-auto mb-3 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-300">No stores created yet</p>
              <p className="text-[11px] text-slate-500 mb-4 mt-0.5">Create your first branch to start adding inventory.</p>
              <Link
                to="/shops"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Add New Shop
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60 overflow-x-auto">
              {recentShops.map((shop) => (
                <div key={shop._id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 px-3 rounded-xl transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded-xl shrink-0">
                      <Store className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">{shop.shopName}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{shop.address}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
                    {shop.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#05070b] text-white p-5 sm:p-6 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">Quick Actions</h3>
            <p className="text-slate-400 text-xs mt-0.5">Direct operations for your tenant account.</p>

            <div className="mt-6 space-y-3">
              <Link
                to="/shops"
                className="w-full flex items-center justify-between p-3.5 bg-[#090d16] hover:bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-emerald-400 stroke-[2.5]" /> Create New Branch
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition shrink-0" />
              </Link>

              <Link
                to="/products"
                className="w-full flex items-center justify-between p-3.5 bg-[#090d16] hover:bg-slate-900 rounded-xl border border-slate-800 text-xs font-bold transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-teal-400 stroke-[2.2]" /> Add Inventory Item
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition shrink-0" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center font-medium">
            <span>System Status</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
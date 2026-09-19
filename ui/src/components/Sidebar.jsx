// src/components/Sidebar.jsx
import React from 'react';
import { LayoutDashboard, Store, Package, LogOut, Shield, Users, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin';
  const isShopManager = user?.role === 'shop_manager'; // Shop Manager check

  // Super Admin Navigation Links
  const adminLinks = [
    { name: 'Tenant Control Center', path: '/admin', icon: Users },
  ];

  // Standard Tenant Navigation Links
  const tenantLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Shops', path: '/shops', icon: Store },
    { name: 'Products', path: '/products', icon: Package },
  ];

  // Shop Manager Navigation Links
  const shopManagerLinks = [
    { name: 'Shop Dashboard', path: '/shop-dashboard', icon: LayoutDashboard },
  ];

  // Links select karna role ke mutabiq
  const currentLinks = isSuperAdmin 
    ? adminLinks 
    : isShopManager 
    ? shopManagerLinks 
    : tenantLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`w-64 bg-[#090d16] text-slate-300 h-screen fixed top-0 left-0 flex flex-col border-r border-slate-800/80 z-50 select-none transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-slate-950 font-bold shadow-lg ${
              isSuperAdmin 
                ? 'bg-amber-400 shadow-amber-400/20' 
                : isShopManager 
                ? 'bg-gradient-to-tr from-emerald-400 to-teal-500 shadow-emerald-500/25' 
                : 'bg-gradient-to-tr from-emerald-400 to-cyan-500 shadow-emerald-500/25'
            }`}>
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-tight">
                {isSuperAdmin ? 'AdminOS' : isShopManager ? 'ShopOS' : 'TenantOS'}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                {isSuperAdmin ? 'Platform Management' : isShopManager ? 'Branch Manager Portal' : 'SaaS Multi-Business'}
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 transition"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {isSuperAdmin ? 'Platform Management' : isShopManager ? 'Manager Operations' : 'Business Operations'}
          </div>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose} // Mobile par link click hone par drawer close ho jaye
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? isSuperAdmin
                      ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20 font-bold'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Identity & Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3.5 bg-[#05070b] border border-slate-800/90 rounded-2xl mb-3 shadow-inner">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Logged Role</p>
            <p className="text-xs font-bold text-white truncate">
              {isShopManager ? (user?.shopName || 'Shop Manager') : (user?.name || 'Owner')}
            </p>
            <p className={`text-[11px] font-semibold truncate mt-0.5 ${isSuperAdmin ? 'text-amber-400' : isShopManager ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {isSuperAdmin ? '👑 Platform Owner' : isShopManager ? '🏪 Shop Manager' : user?.businessName}
            </p>
          </div>
          <button
            onClick={() => {
              onClose?.();
              logout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[2.2]" />
            Logout Workspace
          </button>
        </div>
      </aside>
    </>
  );
}
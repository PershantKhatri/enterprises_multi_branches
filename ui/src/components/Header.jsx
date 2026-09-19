// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ShieldCheck, Bell } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  
  // Roles check karein
  const isSuperAdmin = user?.role === 'super_admin';
  const isShopManager = user?.role === 'shop_manager'; // ✅ Shop manager check

  // Name aur Initials dynamically set karein
  const displayName = isShopManager ? (user?.shopName || 'Shop') : (user?.name || 'Owner');
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-[#090d16]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Search Bar - Only for Tenants & Shop Managers */}
      {!isSuperAdmin ? (
        <div className="relative w-44 sm:w-60 md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors" />
          <input
            type="text"
            placeholder={isShopManager ? "Search products..." : "Search shops, products..."}
            className="w-full bg-[#05070b] text-slate-200 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/15 transition-all placeholder:text-slate-600"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl shadow-inner">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-amber-300 truncate max-w-[120px] sm:max-w-none">Root Controller</span>
        </div>
      )}

      {/* Profile Bar */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition relative cursor-pointer">
          <Bell className="w-4 h-4" />
          {/* Optional notification badge dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
        </button>

        <div className="flex items-center gap-3 border-l border-slate-800/80 pl-3 sm:pl-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-md shrink-0 ${
            isSuperAdmin 
              ? 'bg-amber-600 text-white shadow-amber-600/20' 
              : isShopManager 
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-slate-950 font-extrabold shadow-emerald-500/20' 
              : 'bg-indigo-600 text-white shadow-indigo-600/20'
          }`}>
            {avatarInitial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white tracking-tight leading-tight max-w-[120px] truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium max-w-[120px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
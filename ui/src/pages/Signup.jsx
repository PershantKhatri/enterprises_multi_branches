// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, Building, ArrowRight, Loader2, CheckCircle2, AlertCircle, Store, Zap, TrendingUp } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    businessName: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await signup(formData);
      
      setSuccessMsg(
        response?.message || 'Registration successful! Request sent to Super Admin for approval.'
      );
      
      setFormData({ name: '', email: '', password: '', businessName: '' });

      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex text-slate-100 select-none">
      {/* Left Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-8 lg:p-12 relative">
        <div className="max-w-md w-full space-y-5 sm:space-y-6">
          {/* Brand Logo & Header */}
          <div>
            <div className="w-11 h-11 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg shadow-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-400 stroke-[2.2]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create Tenant Account</h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Register your organization to access branch management SaaS</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg} Redirecting to login...</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#05070b] border border-slate-800 rounded-xl pl-10 pr-4 py-3 sm:py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Business Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Khatri Fitness Hub"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-[#05070b] border border-slate-800 rounded-xl pl-10 pr-4 py-3 sm:py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="owner@business.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#05070b] border border-slate-800 rounded-xl pl-10 pr-4 py-3 sm:py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#05070b] border border-slate-800 rounded-xl pl-10 pr-4 py-3 sm:py-2.5 text-xs font-medium text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(successMsg)}
              className="w-full mt-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-90 text-slate-950 font-bold py-3.5 sm:py-3 px-4 rounded-xl text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Register Tenant <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <p className="text-center text-xs text-slate-400 font-medium pt-2">
            Already registered?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side: Hard-coded Attractive SaaS Design Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#05070b] border-l border-slate-800/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#090d16] border border-slate-800 px-3.5 py-1.5 rounded-xl">
            <Store className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Multi-Branch Ecosystem</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg uppercase tracking-wider">
            v2.4 Enterprise
          </span>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
            Scale your multi-location business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">smart automation.</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Centralize branch inventories, monitor real-time revenue streams, and manage manager credentials securely from a single unified control dashboard.
          </p>

          {/* Hard-coded Feature Highlights Cards */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#090d16] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 w-fit rounded-lg border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Instant Sync</h4>
              <p className="text-[11px] text-slate-400">Real-time product stock updates across all active physical branches.</p>
            </div>

            <div className="bg-[#090d16] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 w-fit rounded-lg border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-xs text-white">Revenue Tracking</h4>
              <p className="text-[11px] text-slate-400">Detailed performance metrics and sales breakdown per location.</p>
            </div>
          </div>
        </div>

        {/* Bottom Stat Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Platform Trust</p>
            <p className="text-sm font-black text-white mt-0.5">500+ Businesses Empowered</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-400">KF</div>
            <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-[10px] font-bold text-teal-400">SB</div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">+</div>
          </div>
        </div>
      </div>
    </div>
  );
}
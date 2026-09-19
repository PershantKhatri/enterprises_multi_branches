// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Users, Clock, UserCheck, ShieldAlert, Check, Ban, RefreshCw, Building2, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/tenants');
      setTenants(data);
    } catch (err) {
      console.error("Error fetching tenants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/admin/tenants/${id}/status`, { status: newStatus });
      fetchTenants();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const total = tenants.length;
  const pending = tenants.filter(t => t.status === 'PENDING').length;
  const approved = tenants.filter(t => t.status === 'APPROVED').length;
  const suspended = tenants.filter(t => t.status === 'SUSPENDED').length;

  return (
    <div className="w-full min-h-screen bg-[#090d16] text-slate-100 p-3 sm:p-5 lg:p-8 space-y-6 overflow-x-hidden box-border">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#05070b] p-4 sm:p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-white tracking-tight">Platform Owner Command Center</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 font-medium leading-relaxed">
            Real-time management of SaaS tenants, registration approvals, and account access controls.
          </p>
        </div>
        
        {/* Action Buttons (Refresh & Logout) */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchTenants}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-amber-400/20 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh List
          </button>
          
          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 w-full">
        <div className="p-3.5 sm:p-5 bg-[#05070b] border border-slate-800/80 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-inner">
          <div className="p-2.5 sm:p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
            <Users size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">Total Tenants</p>
            <h3 className="text-lg sm:text-2xl font-bold text-white mt-0.5">{total}</h3>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 bg-[#05070b] border border-amber-500/20 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-inner">
          <div className="p-2.5 sm:p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
            <Clock size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-wider truncate">Pending Approval</p>
            <h3 className="text-lg sm:text-2xl font-bold text-amber-300 mt-0.5">{pending}</h3>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 bg-[#05070b] border border-emerald-500/20 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-inner">
          <div className="p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <UserCheck size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">Active Approved</p>
            <h3 className="text-lg sm:text-2xl font-bold text-emerald-300 mt-0.5">{approved}</h3>
          </div>
        </div>

        <div className="p-3.5 sm:p-5 bg-[#05070b] border border-rose-500/20 rounded-2xl flex items-center gap-3 sm:gap-4 shadow-inner">
          <div className="p-2.5 sm:p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <ShieldAlert size={20} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] text-rose-400 font-bold uppercase tracking-wider truncate">Suspended</p>
            <h3 className="text-lg sm:text-2xl font-bold text-rose-300 mt-0.5">{suspended}</h3>
          </div>
        </div>
      </div>

      {/* Tenant Registrations Section */}
      <div className="w-full bg-[#05070b] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800/80">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Tenant Registrations</h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Manage client platform access permissions</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading tenant data...</div>
        ) : tenants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No tenants registered in the system.</div>
        ) : (
          <div className="w-full">
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#090d16] text-slate-400 uppercase tracking-wider border-b border-slate-800/80 font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Business / Owner</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tenants.map((tenant) => (
                    <tr key={tenant._id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-white">{tenant.businessName || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{tenant.name}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{tenant.email}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide inline-block ${
                            tenant.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tenant.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {tenant.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleStatusChange(tenant._id, 'APPROVED')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition shadow-md shadow-emerald-600/20 cursor-pointer"
                            >
                              <Check size={13} /> Approve
                            </button>
                          )}
                          {tenant.status !== 'SUSPENDED' && (
                            <button
                              onClick={() => handleStatusChange(tenant._id, 'SUSPENDED')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-bold rounded-lg transition shadow-md shadow-rose-600/20 cursor-pointer"
                            >
                              <Ban size={13} /> Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-slate-800/80 w-full">
              {tenants.map((tenant) => (
                <div key={tenant._id} className="p-4 space-y-3 hover:bg-slate-950/40 transition">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm truncate">{tenant.businessName || 'N/A'}</h4>
                      <p className="text-xs text-slate-400 truncate">{tenant.name}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wide shrink-0 ${
                        tenant.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : tenant.status === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-500 shrink-0">Email:</span>
                      <span className="font-medium truncate text-right">{tenant.email}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-slate-500 shrink-0">Registered:</span>
                      <span className="text-right">{new Date(tenant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {tenant.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleStatusChange(tenant._id, 'APPROVED')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer"
                      >
                        <Check size={14} /> Approve
                      </button>
                    )}
                    {tenant.status !== 'SUSPENDED' && (
                      <button
                        onClick={() => handleStatusChange(tenant._id, 'SUSPENDED')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/20 cursor-pointer"
                      >
                        <Ban size={14} /> Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
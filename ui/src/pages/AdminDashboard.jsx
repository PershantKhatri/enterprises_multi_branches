// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Clock, UserCheck, ShieldAlert, Check, Ban, RefreshCw, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:4000/api/admin/tenants', {
        headers: { Authorization: `Bearer ${token}` }
      });
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
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/admin/tenants/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTenants();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const total = tenants.length;
  const pending = tenants.filter(t => t.status === 'PENDING').length;
  const approved = tenants.filter(t => t.status === 'APPROVED').length;
  const suspended = tenants.filter(t => t.status === 'SUSPENDED').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-[#090d16] min-h-screen text-slate-100 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-[#05070b] p-5 sm:p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Platform Owner Command Center</h1>
          </div>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">
            Real-time management of SaaS tenants, registration approvals, and account access controls.
          </p>
        </div>
        <button
          onClick={fetchTenants}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition shadow-lg shadow-amber-400/20 cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh List
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-4 sm:p-5 bg-[#05070b] border border-slate-800/80 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Tenants</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{total}</h3>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#05070b] border border-amber-500/20 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Pending Approval</p>
            <h3 className="text-xl sm:text-2xl font-bold text-amber-300 mt-0.5">{pending}</h3>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#05070b] border border-emerald-500/20 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
            <UserCheck size={22} />
          </div>
          <div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Active Approved</p>
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-300 mt-0.5">{approved}</h3>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#05070b] border border-rose-500/20 rounded-2xl flex items-center gap-4 shadow-inner">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl shrink-0">
            <ShieldAlert size={22} />
          </div>
          <div>
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Suspended</p>
            <h3 className="text-xl sm:text-2xl font-bold text-rose-300 mt-0.5">{suspended}</h3>
          </div>
        </div>
      </div>

      {/* Tenant Table */}
      <div className="bg-[#05070b] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800/80 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Tenant Registrations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage client platform access permissions</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading tenant data...</div>
        ) : tenants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No tenants registered in the system.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
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
        )}
      </div>
    </div>
  );
}
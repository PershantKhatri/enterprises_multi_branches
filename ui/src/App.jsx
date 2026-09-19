import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Shops from './pages/Shops';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminDashboard';
import ShopDashboard from './pages/ShopDashboard'; // ✅ 1. ShopDashboard import kiya

// Helper component for role-based dashboard routing
function DashboardResolver() {
  const { user } = useAuth();
  if (user?.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Dashboard />;
}

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200 text-sm font-medium">
        Loading Tenant Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<ProtectedLayout />}>
            {/* Auto Redirect to /admin if Super Admin */}
            <Route path="/dashboard" element={<DashboardResolver />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/products" element={<Products />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* ✅ 2. Shop Manager Dashboard Route Add Kar Diya */}
            <Route path="/shop-dashboard" element={<ShopDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
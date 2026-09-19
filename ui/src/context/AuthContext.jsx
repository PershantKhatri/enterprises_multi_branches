// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (formData) => {
    try {
      const response = await API.post('/auth/register', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const userData = { ...response.data, role: response.data.role || 'tenant_admin' };
      setToken(response.data.token);
      setUser(userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const shopLogin = async (email, password) => {
    try {
      const response = await API.post('/auth/shop-login', { email, password });
      const shopUserData = { ...response.data.user, role: 'shop_manager' };
      setToken(response.data.token);
      setUser(shopUserData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(shopUserData));
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, signup, login, shopLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context (Yeh missing tha!)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
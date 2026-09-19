import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // App load hone par user info fetch karein agar token maujood hai
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

  // 0. Signup Function (Yeh zaroori tha!)
  const signup = async (formData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 1. Tenant / Admin Login
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      
      const userData = {
        ...response.data,
        role: response.data.role || 'tenant_admin'
      };

      setToken(response.data.token);
      setUser(userData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // 2. Shop Manager Login
  const shopLogin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/shop-login', { email, password });
      
      const shopUserData = {
        ...response.data.user,
        role: 'shop_manager'
      };

      setToken(response.data.token);
      setUser(shopUserData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(shopUserData));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Logout Function
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

export const useAuth = () => useContext(AuthContext);
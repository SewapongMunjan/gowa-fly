import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on initial load or token change
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set auth token in API header
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const res = await api.get('/users/profile');
          
          setUser(res.data.user);
          setError(null);
        } catch (err) {
          // If token is invalid or expired, remove it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setError('กรุณาเข้าสู่ระบบใหม่');
          
          // Remove auth token from API header
          delete api.defaults.headers.common['Authorization'];
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/users/register', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Set user data
      setUser(res.data.user);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.response.data.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      return { success: false, error: err.response.data.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/users/login', { email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      // Set user data
      setUser(res.data.user);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.response.data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      return { success: false, error: err.response.data.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    
    // Remove auth token from API header
    delete api.defaults.headers.common['Authorization'];
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', userData);
      
      setUser(res.data.user);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.response.data.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      return { success: false, error: err.response.data.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      
      setError(null);
      
      return { success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จ' };
    } catch (err) {
      setError(err.response.data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      return { success: false, error: err.response.data.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!user;
  };

  // Check if user is admin
  const isAdmin = () => {
    return isAuthenticated() && user.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
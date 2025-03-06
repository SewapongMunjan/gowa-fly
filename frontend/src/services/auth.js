import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Result of registration
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    
    // Store token if provided
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน'
    };
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Result of login
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    
    // Store token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  // Remove token from storage
  localStorage.removeItem('token');
  
  // Remove auth header
  delete api.defaults.headers.common['Authorization'];
  
  return {
    success: true
  };
};

/**
 * Get current user profile
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    // If token is invalid or expired, logout
    if (error.response && error.response.status === 401) {
      logout();
    }
    
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้'
    };
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} - Updated user profile
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    
    return {
      success: true,
      user: response.data.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์'
    };
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Result of password change
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/users/password', {
      currentPassword,
      newPassword
    });
    
    return {
      success: true,
      message: response.data.message || 'เปลี่ยนรหัสผ่านสำเร็จ'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน'
    };
  }
};

/**
 * Check if token exists
 * @returns {boolean} - Whether token exists
 */
export const hasToken = () => {
  return !!localStorage.getItem('token');
};

/**
 * Initialize auth header from stored token
 */
export const initAuthHeader = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
  
  return false;
};
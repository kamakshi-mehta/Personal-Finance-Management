import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('wealth_auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axiosClient.get('/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Error loading user profile:', error.message);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('wealth_auth_token', token);
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error context:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosClient.post('/auth/register', { name, email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('wealth_auth_token', token);
      setToken(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error context:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axiosClient.post('/auth/logout');
      }
    } catch (err) {
      console.error('Logout error context:', err.message);
    }
    localStorage.removeItem('wealth_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axiosClient.put('/auth/profile', profileData);
      const { token: newToken, ...userData } = res.data;
      if (newToken) {
        localStorage.setItem('wealth_auth_token', newToken);
        setToken(newToken);
      }
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Update profile error context:', error.response?.data?.message || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed.'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

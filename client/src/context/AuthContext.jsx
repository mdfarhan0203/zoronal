import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const response = await api.getMe();
          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        api.clearToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signup = async (fullName, email, password) => {
    try {
      const response = await api.signup(fullName, email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (fullName, email) => {
    try {
      const response = await api.updateProfile(fullName, email);
      if (response.success) {
        setUser(response.data);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const response = await api.uploadAvatar(file);
      if (response.success) {
        setUser(response.data);
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateProfile,
    uploadAvatar,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

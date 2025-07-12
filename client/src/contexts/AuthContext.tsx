import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  verify_email: boolean;
  status: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if tokens exist
      const accessToken = localStorage.getItem('accesstoken');
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!accessToken || !isLoggedIn) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Verify with backend
      const response = await Axios({
        method: SummaryApi.userDetails.method,
        url: SummaryApi.userDetails.url,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.data);
      } else {
        throw new Error('Invalid session');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isLoggedIn');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call backend logout
      await Axios({
        method: SummaryApi.logout.method,
        url: SummaryApi.logout.url,
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('accesstoken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('isLoggedIn');
      setIsAuthenticated(false);
      setUser(null);
      
      // Dispatch event for other components
      window.dispatchEvent(new Event('logoutStateChange'));
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Listen for login state changes from other components
  useEffect(() => {
    const handleLoginStateChange = () => {
      checkAuthStatus();
    };

    const handleLogoutStateChange = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);
    window.addEventListener('logoutStateChange', handleLogoutStateChange);

    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
      window.removeEventListener('logoutStateChange', handleLogoutStateChange);
    };
  }, []);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
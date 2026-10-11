import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api, getAuthToken, setAuthToken } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  switchDemo: (roleOrEmail: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
  isPricingOpen: boolean;
  setIsPricingOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshUser = async () => {
    try {
      if (!getAuthToken()) {
        // If no token, auto-log in as guest free user to allow immediate play
        const res = await api.switchDemo('guest@demo.com');
        setUser(res.user);
        return;
      }
      const res = await api.getMe();
      if (res.user) {
        setUser(res.user);
      } else {
        const resGuest = await api.switchDemo('guest@demo.com');
        setUser(resGuest.user);
      }
    } catch (err) {
      console.warn('Auth check error, falling back to demo session:', err);
      try {
        const resGuest = await api.switchDemo('guest@demo.com');
        setUser(resGuest.user);
      } catch (e) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setUser(res.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await api.register(email, password, name);
    setUser(res.user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    // Re-seed as guest so experience remains fluid
    const resGuest = await api.switchDemo('guest@demo.com');
    setUser(resGuest.user);
  };

  const switchDemo = async (roleOrEmail: string) => {
    const res = await api.switchDemo(roleOrEmail);
    setUser(res.user);
  };

  const updateUser = (updated: User) => {
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        switchDemo,
        refreshUser,
        updateUser,
        isPricingOpen,
        setIsPricingOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

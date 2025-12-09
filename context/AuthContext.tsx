import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user?: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradePlan: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>({ 
    id: 'u1', 
    name: 'Demo Provider', 
    email: 'pro@cronosflow.app', 
    role: 'provider',
    plan: 'free'
  });

  const login = async (email: string, password: string) => {
    // TODO: API Call - POST /api/login
    // Mock behaviour:
    console.log('Logging in with', email);
    setUser({ id: 'u1', name: 'Demo Provider', email, role: 'provider', plan: 'free' });
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = () => {
    if (user) {
        setUser({ ...user, plan: 'pro' });
    }
  };

  return <AuthContext.Provider value={{ user, login, logout, upgradePlan }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

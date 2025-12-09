
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { addMonths } from 'date-fns';

interface AuthContextType {
  user?: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  upgradePlan: () => void;
  subscribe: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>({ 
    id: 'u1', 
    name: 'Demo User', 
    email: 'user@example.com', 
    role: 'client', // Default to client for this demo flow
    plan: 'free'
  });

  const login = async (email: string, password: string) => {
    // TODO: API Call - POST /api/login
    // Mock behaviour:
    console.log('Logging in with', email);
    setUser({ id: 'u1', name: 'Demo User', email, role: 'client', plan: 'free' });
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = () => {
    if (user) {
        setUser({ ...user, plan: 'pro' });
    }
  };

  const subscribe = () => {
    if (!user) return;
    const now = new Date();
    const expiry = addMonths(now, 1);
    
    setUser({ 
        ...user, 
        plan: 'paid', 
        planExpiry: expiry.toISOString() 
    });
  };

  return <AuthContext.Provider value={{ user, login, logout, upgradePlan, subscribe }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

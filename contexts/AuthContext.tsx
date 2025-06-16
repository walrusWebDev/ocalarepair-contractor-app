import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  specialties: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // In a real app, this would check for stored auth tokens
      // For demo purposes, we'll simulate a quick check
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any non-empty credentials
      if (username && password) {
        const mockUser: User = {
          id: '1',
          username: username,
          name: 'John Smith',
          email: 'john@example.com',
          phone: '(352) 555-0123',
          specialties: ['Plumbing', 'Electrical', 'Drywall']
        };
        
        setUser(mockUser);
        router.replace('/(tabs)');
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    router.replace('/login');
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      forgotPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
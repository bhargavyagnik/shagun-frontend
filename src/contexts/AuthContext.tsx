'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from "@/lib/api";

interface AuthContextType {
  user: any | null;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const login = async (token: string, userData: any) => {
    // First store user data
    console.log(userData)
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Create session cookie
    try {
      const response = await apiClient('/auth/session', {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: token }) // Match backend expectation of 'idToken'
      });

      if (response.data) {
        // Store token only after successful session creation
        localStorage.setItem('token', token);
      } else {
        throw new Error(response.error || 'Failed to create session');
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      // Clean up if session creation fails
      localStorage.removeItem('user');
      setUser(null);
      throw error; // Re-throw to handle in login form
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
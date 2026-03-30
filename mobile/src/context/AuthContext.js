import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session token and user data on app load
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userData = await SecureStore.getItemAsync('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (token, userData) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

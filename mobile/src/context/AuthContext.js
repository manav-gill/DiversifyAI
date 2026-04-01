import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Fallback timeout: if SecureStore hangs forever natively (known bug), force loading false
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn("[AuthContext] SecureStore timeout! Forcing loading to false.");
        setLoading(false);
      }
    }, 3000);

    const loadSession = async () => {
      try {
        console.log("[AuthContext] Checking for session tokens in SecureStore...");
        const token = await SecureStore.getItemAsync('token');
        const userData = await SecureStore.getItemAsync('user');
        
        console.log(`[AuthContext] Session checked. Token exists: ${!!token}, User exists: ${!!userData}`);
        
        if (token && userData && isMounted) {
          setUser(JSON.parse(userData));
        }
      } catch (e) {
        console.error('[AuthContext] Failed to load session:', e);
      } finally {
        if (isMounted) {
          console.log("[AuthContext] Setting loading to false");
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const login = async (token, userData) => {
    console.log("[AuthContext] Saving login credentials...");
    try {
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('user', JSON.stringify(userData));
      setUser(userData);
      console.log("[AuthContext] Login state updated successfully");
    } catch (error) {
       console.error("[AuthContext] Error storing login credentials:", error);
       // We still update local state even if storage fails so the app can be used
       setUser(userData);
    }
  };

  const logout = async () => {
    console.log("[AuthContext] Logging out...");
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('user');
    } catch (error) {
      console.error("[AuthContext] Error removing credentials:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation';
import AuthNavigator from './src/navigation/AuthNavigator';
import { clearAuthToken, setAuthToken } from './src/services/api';

const TOKEN_STORAGE_KEY = '@diversify_ai_auth_token';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedToken) {
          setAuthToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load auth token:', error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setAuthToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to persist auth token:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove auth token:', error.message);
    } finally {
      clearAuthToken();
      setIsAuthenticated(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <StatusBar style="dark" />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00C896" />
          </View>
        ) : isAuthenticated ? (
          <AppNavigator onLogout={handleLogout} />
        ) : (
          <AuthNavigator onLoginSuccess={handleLoginSuccess} />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  // If a valid network IP is provided in .env, use it (ideal for physical devices)
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }
  // Fallbacks for localhost situations
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api'; // Android Emulator alias for localhost
  }
  return 'http://localhost:5000/api';   // iOS Simulator / Web
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

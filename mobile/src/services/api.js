import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Consider adding environment variables integration, e.g. using `expo-constants`
const API_BASE_URL = 'http://localhost:5000/api'; // Or your machine's local IP address

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

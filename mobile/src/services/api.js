import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const API_TIMEOUT = 5000;
let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function clearAuthToken() {
  authToken = null;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + authToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Unknown API error';

    console.error('API Error:', {
      message,
      status: error.response?.status,
      method: error.config?.method,
      url: error.config?.url,
    });

    return Promise.reject(error);
  }
);

export default apiClient;

import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const API_PORT = 5002;
const API_PREFIX = '/api';
const API_TIMEOUT = 5000;
const EXPO_PUBLIC_API_HOST = process.env.EXPO_PUBLIC_API_HOST;
let authToken = null;

function buildBaseUrl(host) {
  return 'http://' + host + ':' + API_PORT + API_PREFIX;
}

function getExpoHostIp() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost ||
    '';

  if (!hostUri) {
    return '';
  }

  return hostUri.split(':')[0];
}

function resolveApiBaseUrl() {
  if (EXPO_PUBLIC_API_HOST) {
    return buildBaseUrl(EXPO_PUBLIC_API_HOST);
  }

  const isPhysicalDevice = Boolean(Constants.isDevice);
  const hostIp = getExpoHostIp();

  if (isPhysicalDevice) {
    if (hostIp) {
      return buildBaseUrl(hostIp);
    }

    // Fallback for physical devices when Expo host cannot be detected.
    return buildBaseUrl('192.168.1.100');
  }

  if (Platform.OS === 'android') {
    return buildBaseUrl('10.0.2.2');
  }

  return buildBaseUrl('localhost');
}

const API_BASE_URL = resolveApiBaseUrl();

console.log('[API] Base URL:', API_BASE_URL);

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
    const method = (config.method || 'get').toUpperCase();
    const requestUrl = (config.baseURL || '') + (config.url || '');

    console.log('[API Request]', method, requestUrl);

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
    const isNetworkError = !error.response;

    if (isNetworkError) {
      console.error('Unable to connect to backend. Check server or baseURL.', {
        baseURL: API_BASE_URL,
        platform: Platform.OS,
        isDevice: Boolean(Constants.isDevice),
        detectedHostIp: getExpoHostIp() || null,
        timeout: API_TIMEOUT,
        error: error.message,
      });

      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message || error.message || 'Unknown API error';

    console.error('[API Error]', {
      message,
      status: error.response?.status,
      method: (error.config?.method || 'get').toUpperCase(),
      url: (error.config?.baseURL || '') + (error.config?.url || ''),
    });

    return Promise.reject(error);
  }
);

export default apiClient;

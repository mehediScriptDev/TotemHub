import axios from 'axios';
import { STORAGE_KEYS } from '../config/constants';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Handle auth injection (client token management)
 */
axiosInstance.interceptors.request.use((config) => {
  try {
    if (!config.headers) config.headers = {};

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const savedEmail = localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL);
    const savedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    const fallbackEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const fallbackPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    const adminEmail = savedEmail || fallbackEmail;
    const adminPassword = savedPassword || fallbackPassword;

    const hasAdminEmailHeader = config.headers['X-Admin-Email'] || config.headers['x-admin-email'];
    const hasAdminPasswordHeader = config.headers['X-Admin-Password'] || config.headers['x-admin-password'];

    if (!hasAdminEmailHeader && adminEmail) {
      config.headers['X-Admin-Email'] = adminEmail;
    }

    if (!hasAdminPasswordHeader && adminPassword) {
      config.headers['X-Admin-Password'] = adminPassword;
    }
  } catch {
    // ignore
  }
  return config;
});

export default axiosInstance;

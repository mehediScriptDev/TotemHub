import { STORAGE_KEYS } from '../config/constants';

// Add token storage helper (you'll need to implement this based on your auth)
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || null;
};

export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

export const getUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

export const getAdminCredentials = () => {
  return {
    email: localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || null,
    password: localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD) || null,
  };
};

export const setAdminCredentials = ({ email, password }) => {
  if (email) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, email);
  }
  if (password) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, password);
  }
};

export const removeAdminCredentials = () => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_EMAIL);
  localStorage.removeItem(STORAGE_KEYS.ADMIN_PASSWORD);
};

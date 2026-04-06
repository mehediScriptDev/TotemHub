import axiosInstance from './axiosInstance';
import {
  removeToken,
  setUser,
  getUser,
  removeUser,
  getAdminCredentials,
  setAdminCredentials,
  removeAdminCredentials,
} from '../utils/storage';

const buildAdminUser = (email) => ({
  id: 'admin-header-auth',
  name: 'Administrator',
  email,
  role: 'admin',
});

const verifyHeaderAuth = async (email, password) => {
  await axiosInstance.get('', {
    headers: {
      'X-Admin-Email': email,
      'X-Admin-Password': password,
    },
  });
};

export const authService = {
  /**
   * Login with email and password
   */
  login: async (email, password) => {
    const cleanEmail = email?.trim();
    const cleanPassword = password?.trim();

    if (!cleanEmail || !cleanPassword) {
      throw { message: 'Email and password are required' };
    }

    try {
      // Backend now expects header-based admin auth, not /auth/login.
      await verifyHeaderAuth(cleanEmail, cleanPassword);

      const user = buildAdminUser(cleanEmail);
      setAdminCredentials({ email: cleanEmail, password: cleanPassword });
      removeToken();
      setUser(user);

      return { user };
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        throw { message: 'Invalid admin credentials' };
      }
      throw error?.response?.data || { message: 'Login failed. Please verify API reachability and credentials.' };
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    removeToken();
    removeUser();
    removeAdminCredentials();
  },

  /**
   * Check auth state on mount
   */
  onAuthStateChange: (callback) => {
    const user = getUser();
    const { email, password } = getAdminCredentials();
    const hasHeaderAuth = !!(email && password);
    const isAuthenticated = !!(user && hasHeaderAuth);

    if (isAuthenticated) {
      callback(user);
    } else {
      callback(null);
    }
  },
};

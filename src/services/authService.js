import axiosInstance from './axiosInstance';
import { setToken, removeToken, getToken, setUser, getUser, removeUser } from '../utils/storage';

let authChangeCallback = null;

export const authService = {
  /**
   * Login with email and password
   */
  login: async (email, password) => {
    // --- DEMO MODE BYPASS ---
    if (email === 'admin@totem.com' && password === 'admin123') {
      const mockUser = {
        id: 'demo-user-1',
        name: 'Senior Admin',
        email: 'admin@totem.com',
        role: 'admin'
      };
      const mockToken = 'demo-jwt-token-12345';
      
      setToken(mockToken);
      setUser(mockUser);
      return { user: mockUser, token: mockToken };
    }
    // ------------------------

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);

      return { user, token };
    } catch (error) {
      throw error?.response?.data || { message: 'Login failed. Please try again.' };
    }
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    removeToken();
    removeUser();
  },

  /**
   * Check auth state on mount
   */
  onAuthStateChange: (callback) => {
    authChangeCallback = callback;
    const token = getToken();
    const user = getUser();

    if (token && user) {
      callback(user);
    } else {
      callback(null);
    }
  },
};

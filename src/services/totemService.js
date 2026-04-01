import axiosInstance from './axiosInstance';
import { db } from '../utils/db';

/**
 * Totem Service (Sync Edition)
 * Primary: Real API | Secondary: Real-Data Mock Fallback
 */
export const totemService = {
  /** Fetch all totems */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      console.warn('API (Likely CORS) error - Providing Real-Data Mock');
      return db.getTotems();
    }
  },

  /** Fetch single totem by ID */
  getById: async (id) => {
    try {
      const totems = await totemService.getAll();
      return totems.find(t => t.id == id);
    } catch (error) {
      return db.getTotemById(id);
    }
  },

  /** Method to search for Partner Email (id_store) before totem creation */
  searchUserByEmail: async (email) => {
    try {
      const response = await axiosInstance.get(`/search-user?email=${email}`);
      return response.data; 
    } catch (error) {
      // Return a dummy entry for demo if offline
      return [{ id: 87, name: 'Franco Fierro demo', email }];
    }
  },

  /** Create new totem */
  create: async (data) => {
    try {
      const response = await axiosInstance.post('/', data);
      return response.data;
    } catch (error) {
      return db.saveTotem({ name: data.name, id_store: data.id_store });
    }
  },

  /** Delete totem by ID */
  delete: async (id) => {
    try {
      const response = await axiosInstance.delete(`/${id}`);
      return response.data;
    } catch (error) {
      db.deleteTotem(id);
      return { success: true };
    }
  },
};

import { db } from '../utils/db';

/**
 * Totem Service (Perfect Demo Edition)
 * Persists data to localStorage database for a seamless dev experience.
 */
export const totemService = {
  getAll: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(db.getTotems()), 200));
  },

  getById: async (id) => {
    return new Promise((resolve) => setTimeout(() => resolve(db.getTotemById(id)), 200));
  },

  create: async (data) => {
    return new Promise((resolve) => {
      const newTotem = db.saveTotem(data);
      setTimeout(() => resolve(newTotem), 300);
    });
  },

  delete: async (id) => {
    return new Promise((resolve) => {
      db.deleteTotem(id);
      setTimeout(() => resolve({ success: true }), 300);
    });
  },
};

import { db } from '../utils/db';

/**
 * Product Service (Perfect Demo Edition)
 * Manages product mapping and catalog browsing locally.
 */
export const productService = {
  /** Fetch product catalog */
  getCatalog: async (filters = {}) => {
    return new Promise((resolve) => setTimeout(() => resolve(db.getCatalog()), 200));
  },

  /** Fetch categories */
  getCategories: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(['Electronics', 'Fashion', 'Accessories', 'Lifestyle']), 100));
  },

  /** Fetch totem homepage products */
  getTotemProducts: async (totemId) => {
    return new Promise((resolve) => setTimeout(() => resolve(db.getTotemProducts(totemId)), 250));
  },

  /** Add/Remove/Reorder */
  addToTotem: async (totemId, productId) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },
  removeFromTotem: async (totemId, productId) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },
  reorder: async (totemId, productIds) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },
};

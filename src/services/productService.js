import axiosInstance from './axiosInstance';

/**
 * Product API Service
 * Handles catalog browsing and totem homepage product management.
 */
export const productService = {
  /** Fetch product catalog with optional filters */
  getCatalog: async (filters = {}) => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;

    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  /** Fetch product categories */
  getCategories: async () => {
    const response = await axiosInstance.get('/products/categories');
    return response.data;
  },

  /** Fetch products assigned to a specific totem's homepage */
  getTotemProducts: async (totemId) => {
    const response = await axiosInstance.get(`/totems/${totemId}/products`);
    return response.data;
  },

  /** Add a product to a totem's homepage */
  addToTotem: async (totemId, productId) => {
    const response = await axiosInstance.post(`/totems/${totemId}/products`, { productId });
    return response.data;
  },

  /** Remove a product from a totem's homepage */
  removeFromTotem: async (totemId, productId) => {
    const response = await axiosInstance.delete(`/totems/${totemId}/products/${productId}`);
    return response.data;
  },

  /** Reorder products on totem homepage */
  reorderTotemProducts: async (totemId, orderedProductIds) => {
    const response = await axiosInstance.put(`/totems/${totemId}/products/reorder`, {
      productIds: orderedProductIds,
    });
    return response.data;
  },
};

import axiosInstance from './axiosInstance';
import { db } from '../utils/db';

/**
 * Product Service
 * - Primary: Real API calls (when available)
 * - Fallback: local db mock
 */
export const productService = {
  /** Fetch product catalog (search) */
  getCatalog: async (filters = {}) => {
    const q = filters.search || '';
    const per_page = filters.per_page || 8;
    const page = filters.page || 1;

    const productApiBase = import.meta.env.VITE_PRODUCT_API_BASE || 'https://api-c.psicopatici.com/api/v1';

    try {
      const url = `${productApiBase}/products/search`;
      const response = await axiosInstance.get(url, { params: { q, per_page, page } });
      const payload = response.data;

      if (Array.isArray(payload)) {
        return { products: payload };
      }

      if (Array.isArray(payload?.products)) {
        return payload;
      }

      if (Array.isArray(payload?.data)) {
        return { ...payload, products: payload.data };
      }

      return { products: [] };
    } catch (error) {
      console.warn('Product search API failed, falling back to local catalog', error?.message || error);
      try {
        return { products: db.getCatalog ? db.getCatalog() : [] };
      } catch {
        return { products: [] };
      }
    }
  },

  /** Fetch categories (fallback) */
  getCategories: async () => {
    // Backend categories endpoint not defined in docs — keep demo fallback
    return new Promise((resolve) => setTimeout(() => resolve(['Electronics', 'Fashion', 'Accessories', 'Lifestyle']), 100));
  },

  /** Fetch totem homepage products (expects backend to return full product objects or at least slug_id/order)
   * GET /api/totems/{id}/homepage
   */
  getTotemProducts: async (totemId) => {
    try {
      const response = await axiosInstance.get(`/${totemId}/homepage`);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch totem homepage from API, using local mock', error?.message || error);
      try {
        return { products: db.getTotemProducts ? db.getTotemProducts(totemId) : [] };
      } catch {
        return { products: [] };
      }
    }
  },

  /** Add a product to the homepage by fetching current list and POSTing the full array
   * POST /api/totems/{id}/homepage
   */
  addToTotem: async (totemId, productId) => {
    try {
      const current = await productService.getTotemProducts(totemId);
      const products = (current?.products || []).slice();

      // Determine slug id field - backend uses `slug_id`
      const existingSlugs = products.map((p) => p.slug_id ?? p.id ?? p.slug);
      if (existingSlugs.includes(productId)) {
        return { success: true, message: 'already_exists' };
      }

      const newProducts = products.map((p, idx) => ({ slug_id: p.slug_id ?? p.id ?? p.slug, order: p.order ?? idx }));
      newProducts.push({ slug_id: productId, order: newProducts.length });

      const res = await axiosInstance.post(`/${totemId}/homepage`, { products: newProducts });
      return res.data;
    } catch (error) {
      console.warn('Failed to add product via API, falling back to mock', error?.message || error);
      return { success: true };
    }
  },

  /** Remove product from homepage */
  removeFromTotem: async (totemId, productId) => {
    try {
      const current = await productService.getTotemProducts(totemId);
      const products = (current?.products || []).slice();

      const filtered = products
        .map((p, idx) => ({ slug_id: p.slug_id ?? p.id ?? p.slug, order: p.order ?? idx }))
        .filter((p) => String(p.slug_id) !== String(productId))
        .map((p, idx) => ({ slug_id: p.slug_id, order: idx }));

      const res = await axiosInstance.post(`/${totemId}/homepage`, { products: filtered });
      return res.data;
    } catch (error) {
      console.warn('Failed to remove product via API, falling back to mock', error?.message || error);
      return { success: true };
    }
  },

  /** Reorder homepage products by providing an ordered array of product ids
   * Accepts array of slug ids in the desired order
   */
  reorderTotemProducts: async (totemId, productIds = []) => {
    try {
      const products = productIds.map((id, idx) => ({ slug_id: id, order: idx }));
      const res = await axiosInstance.post(`/${totemId}/homepage`, { products });
      return res.data;
    } catch (error) {
      console.warn('Failed to reorder homepage via API, falling back to mock', error?.message || error);
      return { success: true };
    }
  },

  // backward-compatible alias
  reorder: async (totemId, productIds = []) => productService.reorderTotemProducts(totemId, productIds),
};

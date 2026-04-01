import axiosInstance from './axiosInstance';

/**
 * Totem API Service
 * Handles all CRUD operations for totems.
 */
export const totemService = {
  /** Fetch all totems */
  getAll: async () => {
    try {
      const response = await axiosInstance.get('/totems');
      return response.data;
    } catch (error) {
      // Fallback for demo purposes
      console.warn('Backend not found, using Mock Totems');
      return [
        { id: '1', name: 'Main Entrance Kiosk', partnerEmail: 'partner@example.com', videoCount: 3, productCount: 12 },
        { id: '2', name: 'Food Court Totem', partnerEmail: 'vendor@mall.com', videoCount: 1, productCount: 8 },
        { id: '3', name: 'Parking Level 1', partnerEmail: 'info@parking.com', videoCount: 0, productCount: 0 },
      ];
    }
  },

  /** Fetch a single totem by ID */
  getById: async (id) => {
    const response = await axiosInstance.get(`/totems/${id}`);
    return response.data;
  },

  /** Create a new totem */
  create: async (data) => {
    const response = await axiosInstance.post('/totems', data);
    return response.data;
  },

  /** Delete a totem */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/totems/${id}`);
    return response.data;
  },
};

import axiosInstance from './axiosInstance';

const mapArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const buildUploadFormData = ({ totemId, name, file }) => {
  const formData = new FormData();
  const parsedTotemId = Number(totemId);
  formData.append('totem_id', Number.isFinite(parsedTotemId) ? String(parsedTotemId) : String(totemId));
  formData.append('name', (name || file?.name || 'video').trim());
  formData.append('file', file);
  return formData;
};

export const totemService = {
  /** GET /api/totems */
  getAll: async () => {
    const response = await axiosInstance.get('');
    return mapArrayPayload(response.data);
  },

  /** Client-side lookup from GET all (single endpoint not provided by backend docs) */
  getById: async (id) => {
    const totems = await totemService.getAll();
    return totems.find((t) => String(t.id) === String(id)) || null;
  },

  /** GET /api/totems/search-user?email=... */
  searchUserByEmail: async (email) => {
    const query = (email || '').trim().toLowerCase();

    try {
      const response = await axiosInstance.get('/search-user', {
        params: { email: query },
      });
      return mapArrayPayload(response.data);
    } catch (error) {
      // Fallback when /search-user is unavailable on the current backend build.
      if (error?.response?.status !== 404) throw error;

      const totems = await totemService.getAll();
      const usersById = new Map();

      totems.forEach((totem) => {
        const user = totem?.user;
        if (user?.id) usersById.set(user.id, user);
      });

      return [...usersById.values()].filter((user) => {
        const userEmail = String(user?.email || user?.email_address || '').toLowerCase();
        return userEmail.includes(query);
      });
    }
  },

  /** POST /api/totems */
  create: async ({ id_store, name }) => {
    const payload = {
      id_store,
      name: (name || '').trim(),
    };
    const response = await axiosInstance.post('', payload);
    return response.data;
  },

  /** DELETE /api/totems/{id} */
  delete: async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  },

  /** GET /api/totems/{id}/slides */
  getSlides: async (totemId) => {
    const response = await axiosInstance.get(`/${totemId}/slides`);
    return mapArrayPayload(response.data);
  },

  /** POST /api/totems/slides */
  uploadSlide: async ({ totemId, name, file, onUploadProgress }) => {
    const formData = buildUploadFormData({ totemId, name, file });
    const response = await axiosInstance.post('/slides', formData, {
      onUploadProgress,
    });
    return response.data;
  },

  /** DELETE /api/totems/slides/{id} */
  deleteSlide: async (slideId) => {
    const response = await axiosInstance.delete(`/slides/${slideId}`);
    return response.data;
  },

  /** GET /api/totems/{id}/video-idle */
  getIdleVideos: async (totemId) => {
    const response = await axiosInstance.get(`/${totemId}/video-idle`);
    return mapArrayPayload(response.data);
  },

  /** POST /api/totems/video-idle */
  uploadIdleVideo: async ({ totemId, name, file, onUploadProgress }) => {
    const formData = buildUploadFormData({ totemId, name, file });
    const response = await axiosInstance.post('/video-idle', formData, {
      onUploadProgress,
    });
    return response.data;
  },
};

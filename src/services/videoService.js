import axiosInstance from './axiosInstance';

/**
 * Video Service (Client API Edition)
 * Handles element_id=1 (Idle) and element_id=2 (Rotating/Slides)
 */
export const videoService = {
  /** Fetch all videos for a totem */
  getTotemVideos: async (totemId) => {
    try {
      const [idleRes, rotatingRes] = await Promise.all([
        axiosInstance.get(`/${totemId}/video-idle`),
        axiosInstance.get(`/${totemId}/slides`)
      ]);
      
      return [
        ...(Array.isArray(idleRes.data) ? idleRes.data.map(v => ({ ...v, category: 'idle' })) : []),
        ...(Array.isArray(rotatingRes.data) ? rotatingRes.data.map(v => ({ ...v, category: 'rotating' })) : [])
      ];
    } catch (e) { return []; }
  },

  /** Upload a video with specific file name and totem_id */
  upload: async (totemId, file, category = 'rotating', onUploadProgress) => {
    const formData = new FormData();
    formData.append('totem_id', totemId);
    formData.append('name', file.name);
    formData.append('file', file);

    const endpoint = category === 'idle' ? '/video-idle' : '/slides';
    
    try {
      const response = await axiosInstance.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress) {
            onUploadProgress({
                loaded: progressEvent.loaded,
                total: progressEvent.total
            });
          }
        },
      });
      return response.data;
    } catch (error) { throw error; }
  },

  /** Delete a specific slide/idle video */
  delete: async (videoId, category = 'rotating') => {
    const endpoint = category === 'idle' ? '/video-idle' : '/slides';
    try {
      const response = await axiosInstance.delete(`${endpoint}/${videoId}`);
      return response.data;
    } catch (error) { throw error; }
  },
};

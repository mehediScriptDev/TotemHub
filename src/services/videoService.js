import axiosInstance from './axiosInstance';

/**
 * Video API Service
 * Handles video upload, categorization, reordering, and deletion per totem.
 */
export const videoService = {
  /** Fetch all videos for a totem */
  getTotemVideos: async (totemId) => {
    const response = await axiosInstance.get(`/totems/${totemId}/videos`);
    return response.data;
  },

  /** Upload a video with progress tracking */
  upload: async (totemId, file, category, onProgress) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('category', category);

    const response = await axiosInstance.post(`/totems/${totemId}/videos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  /** Update video category */
  updateCategory: async (totemId, videoId, category) => {
    const response = await axiosInstance.put(`/totems/${totemId}/videos/${videoId}`, { category });
    return response.data;
  },

  /** Reorder rotating videos */
  reorder: async (totemId, orderedVideoIds) => {
    const response = await axiosInstance.put(`/totems/${totemId}/videos/reorder`, {
      videoIds: orderedVideoIds,
    });
    return response.data;
  },

  /** Delete a video from a totem */
  delete: async (totemId, videoId) => {
    const response = await axiosInstance.delete(`/totems/${totemId}/videos/${videoId}`);
    return response.data;
  },
};

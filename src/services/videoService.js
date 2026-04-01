import { db } from '../utils/db';

/**
 * Video Service (Perfect Demo Edition)
 * Simulates video uploads and persistence with localStorage.
 */
export const videoService = {
  /** Fetch all videos for a totem */
  getTotemVideos: async (totemId) => {
    return new Promise((resolve) => setTimeout(() => resolve(db.getVideos(totemId)), 250));
  },

  /** Simulates upload with progress and persistence */
  upload: async (totemId, file, category = 'rotating', onUploadProgress) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (onUploadProgress) onUploadProgress({ loaded: progress, total: 100 });
        if (progress >= 100) {
          clearInterval(interval);
          const newVideo = db.saveVideo({ totemId, filename: file.name, category, size: file.size, thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=150&fit=crop' });
          resolve({ success: true, video: newVideo });
        }
      }, 200);
    });
  },

  /** Update video details */
  update: async (totemId, videoId, data) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 250));
  },

  /** Remove video */
  delete: async (totemId, videoId) => {
    return new Promise((resolve) => {
      db.deleteVideo(videoId);
      setTimeout(() => resolve({ success: true }), 300);
    });
  },

  /** Reorder rotators */
  reorder: async (totemId, videoIds) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 300));
  },
};

import { totemService } from './totemService';

const parseErrorMessage = (error, fallback) => {
  const payload = error?.response?.data;

  if (typeof payload === 'string') {
    const adminBindingError = payload.match(/Target class \[admin\] does not exist\./i);
    if (adminBindingError) return 'Backend middleware error: Target class [admin] does not exist.';

    const titleMatch = payload.match(/<title>(.*?)<\/title>/i);
    if (titleMatch?.[1]) return titleMatch[1].trim();
  }

  return payload?.message || error?.message || fallback;
};

/**
 * Video service backed by documented Totems API routes.
 * - Idle videos: /{id}/video-idle and /video-idle
 * - Rotating videos (slides): /{id}/slides and /slides
 */
export const videoService = {
  /** Fetch all videos (idle + rotating) for a totem */
  getTotemVideos: async (totemId) => {
    const [idleResult, rotatingResult] = await Promise.allSettled([
      totemService.getIdleVideos(totemId),
      totemService.getSlides(totemId),
    ]);

    const warnings = [];

    const idleVideos = idleResult.status === 'fulfilled'
      ? idleResult.value
      : (() => {
          warnings.push(parseErrorMessage(idleResult.reason, 'Failed to load idle videos'));
          return [];
        })();

    const rotatingVideos = rotatingResult.status === 'fulfilled'
      ? rotatingResult.value
      : (() => {
          warnings.push(parseErrorMessage(rotatingResult.reason, 'Failed to load rotating videos'));
          return [];
        })();

    return {
      videos: [
        ...idleVideos.map((video) => ({ ...video, category: 'idle' })),
        ...rotatingVideos.map((video) => ({ ...video, category: 'rotating' })),
      ],
      warnings,
    };
  },

  /** Upload an idle or rotating video */
  upload: async (totemId, file, category = 'rotating', onUploadProgress) => {
    const handler = category === 'idle' ? totemService.uploadIdleVideo : totemService.uploadSlide;
    try {
      return await handler({
        totemId,
        name: file?.name,
        file,
        onUploadProgress: (progressEvent) => {
          if (!onUploadProgress) return;
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
          });
        },
      });
    } catch (error) {
      const wrapped = new Error(parseErrorMessage(error, 'Video upload failed'));
      wrapped.originalError = error;
      wrapped.status = error?.response?.status;
      throw wrapped;
    }
  },

  /** Delete video record by ID (documented API uses /slides/{id}) */
  delete: async (videoId) => {
    try {
      return await totemService.deleteSlide(videoId);
    } catch (error) {
      const wrapped = new Error(parseErrorMessage(error, 'Failed to delete video'));
      wrapped.originalError = error;
      wrapped.status = error?.response?.status;
      throw wrapped;
    }
  },

  /** No explicit reorder endpoint provided in docs; keep no-op for UI compatibility */
  reorder: async () => ({ success: true }),
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, Trash2, ChevronUp, ChevronDown, Video,
  Film, Pause, RotateCcw, X, FileVideo,
} from 'lucide-react';
import { Button, Spinner, EmptyState, Select, ConfirmDialog, ProgressBar } from '../../../../Components/ui';
import { videoService } from '../../../../services/videoService';
import { VIDEO_CATEGORIES } from '../../../../config/constants';
import toast from 'react-hot-toast';

const VideoSection = ({ totemId }) => {
  // ── Video State ──
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Upload State ──
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState(VIDEO_CATEGORIES.ROTATING);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ── Delete State ──
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Active filter tab ──
  const [filterCategory, setFilterCategory] = useState('all');

  // ── Fetch Videos ──
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await videoService.getTotemVideos(totemId);
      setVideos(data?.videos || data || []);
    } catch {
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [totemId]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // ── Upload Handler ──
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a video file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await videoService.upload(
        totemId,
        selectedFile,
        uploadCategory,
        (progress) => setUploadProgress(progress)
      );
      const newVideo = result?.video || result;
      setVideos((prev) => [...prev, newVideo]);
      toast.success('Video uploaded successfully!');
      resetUploadForm();
    } catch {
      toast.error('Video upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadCategory(VIDEO_CATEGORIES.ROTATING);
    setUploadProgress(0);
    setUploadOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── File Selection ──
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }
      // Validate size (max 500MB)
      if (file.size > 500 * 1024 * 1024) {
        toast.error('File size must be under 500MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  // ── Delete Video ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await videoService.delete(totemId, deleteTarget.id);
      setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      toast.success('Video deleted');
    } catch {
      toast.error('Failed to delete video');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ── Reorder (rotating only) ──
  const moveVideo = async (index, direction, categoryList) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categoryList.length) return;

    const newCategoryList = [...categoryList];
    [newCategoryList[index], newCategoryList[targetIndex]] = [
      newCategoryList[targetIndex],
      newCategoryList[index],
    ];

    // Rebuild full list preserving other category
    const otherVideos = videos.filter(
      (v) => v.category !== VIDEO_CATEGORIES.ROTATING
    );
    const newFullList = [...otherVideos, ...newCategoryList];
    setVideos(newFullList);

    try {
      await videoService.reorder(
        totemId,
        newCategoryList.map((v) => v.id)
      );
    } catch {
      toast.error('Failed to save order');
      fetchVideos();
    }
  };

  // ── Filtered Videos ──
  const idleVideos = videos.filter((v) => v.category === VIDEO_CATEGORIES.IDLE);
  const rotatingVideos = videos.filter((v) => v.category === VIDEO_CATEGORIES.ROTATING);

  const displayedVideos =
    filterCategory === 'all'
      ? videos
      : filterCategory === VIDEO_CATEGORIES.IDLE
      ? idleVideos
      : rotatingVideos;

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-surface-900">Video Management</h2>
          <p className="text-sm md:text-base text-surface-600">
            Upload and manage idle & rotating videos for this totem
          </p>
        </div>
        <Button icon={Upload} onClick={() => setUploadOpen(true)} size="md">
          Upload Video
        </Button>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setFilterCategory('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
            filterCategory === 'all'
              ? 'bg-brand-50 border-brand-100'
              : 'bg-white border-surface-200 hover:border-surface-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
          }`}
        >
          <Video className={`w-5 h-5 mb-2 ${filterCategory === 'all' ? 'text-brand-600' : 'text-surface-500'}`} />
          <p className="text-xl font-bold text-surface-900">{videos.length}</p>
          <p className="text-xs md:text-sm text-surface-600">All Videos</p>
        </button>
        <button
          onClick={() => setFilterCategory(VIDEO_CATEGORIES.IDLE)}
          className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
            filterCategory === VIDEO_CATEGORIES.IDLE
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-surface-200 hover:border-surface-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
          }`}
        >
          <Pause className={`w-5 h-5 mb-2 ${filterCategory === VIDEO_CATEGORIES.IDLE ? 'text-amber-600' : 'text-surface-500'}`} />
          <p className="text-xl font-bold text-surface-900">{idleVideos.length}</p>
          <p className="text-xs md:text-sm text-surface-600">Idle Videos</p>
        </button>
        <button
          onClick={() => setFilterCategory(VIDEO_CATEGORIES.ROTATING)}
          className={`p-4 rounded-xl border transition-all cursor-pointer text-left col-span-2 sm:col-span-1 ${
            filterCategory === VIDEO_CATEGORIES.ROTATING
              ? 'bg-brand-100 border-brand-300/30'
              : 'bg-white border-surface-200 hover:border-surface-300 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
          }`}
        >
          <RotateCcw className={`w-5 h-5 mb-2 ${filterCategory === VIDEO_CATEGORIES.ROTATING ? 'text-brand-600' : 'text-surface-500'}`} />
          <p className="text-xl font-bold text-surface-900">{rotatingVideos.length}</p>
          <p className="text-xs md:text-sm text-surface-600">Rotating Videos</p>
        </button>
      </div>

      {/* Video List */}
      {loading ? (
        <Spinner text="Loading videos..." />
      ) : displayedVideos.length === 0 ? (
        <EmptyState
          icon={Film}
          title={filterCategory === 'all' ? 'No videos uploaded' : `No ${filterCategory} videos`}
          description="Upload video files to display on this totem."
          action={
            <Button icon={Upload} onClick={() => setUploadOpen(true)}>
              Upload Video
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {displayedVideos.map((video, index) => {
            const isRotating = video.category === VIDEO_CATEGORIES.ROTATING;
            const rotatingIndex = isRotating
              ? rotatingVideos.findIndex((v) => v.id === video.id)
              : -1;

            return (
              <div
                key={video.id}
                className="bg-white border border-surface-200 rounded-xl p-4 flex items-center gap-4 group animate-fade-in shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Thumbnail / Icon */}
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.name || video.filename}
                    className="w-16 h-12 rounded-lg object-cover border border-surface-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-12 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0">
                    <FileVideo className="w-5 h-5 text-surface-500" />
                  </div>
                )}

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-surface-800 truncate">
                    {video.name || video.filename || `Video ${video.id}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        video.category === VIDEO_CATEGORIES.IDLE
                          ? 'bg-warning-500/15 text-warning-500'
                          : 'bg-brand-500/15 text-brand-600'
                      }`}
                    >
                      {video.category === VIDEO_CATEGORIES.IDLE ? (
                        <Pause className="w-2.5 h-2.5" />
                      ) : (
                        <RotateCcw className="w-2.5 h-2.5" />
                      )}
                      {video.category}
                    </span>
                    {video.size && (
                      <span className="text-xs text-surface-500">
                        {formatFileSize(video.size)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reorder (Rotating only) */}
                {isRotating && filterCategory !== 'all' && (
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveVideo(rotatingIndex, -1, rotatingVideos)}
                      disabled={rotatingIndex === 0}
                      className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500
                                 hover:text-surface-800 disabled:opacity-30 disabled:cursor-not-allowed
                                 transition-colors cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveVideo(rotatingIndex, 1, rotatingVideos)}
                      disabled={rotatingIndex === rotatingVideos.length - 1}
                      className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500
                                 hover:text-surface-800 disabled:opacity-30 disabled:cursor-not-allowed
                                 transition-colors cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(video)}
                  className="p-2 rounded-lg hover:bg-danger-600/15 text-surface-500
                             hover:text-danger-400 transition-colors cursor-pointer shrink-0
                             opacity-0 group-hover:opacity-100"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Upload Panel ── */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-xs animate-fade-in"
            onClick={() => !uploading && resetUploadForm()}
          />
          <div className="relative w-full max-w-md bg-white border border-surface-200 rounded-2xl shadow-2xl shadow-black/15 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
              <h3 className="text-lg font-semibold text-surface-900">Upload Video</h3>
              {!uploading && (
                <button
                  onClick={resetUploadForm}
                  className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500
                             hover:text-surface-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="p-6 space-y-5">
              {/* Drop Zone */}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    selectedFile
                      ? 'border-brand-500/40 bg-brand-50'
                      : 'border-surface-300 hover:border-brand-300 hover:bg-surface-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className={`w-8 h-8 mx-auto mb-3 ${selectedFile ? 'text-brand-600' : 'text-surface-500'}`} />
                {selectedFile ? (
                  <>
                    <p className="text-sm font-medium text-surface-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-surface-700">
                      Click to select a video file
                    </p>
                    <p className="text-xs text-surface-500 mt-1">
                      MP4, MOV, AVI, WebM • Max 500MB
                    </p>
                  </>
                )}
              </div>

              {/* Category Selector */}
              <Select
                label="Video Category"
                options={[
                  { value: VIDEO_CATEGORIES.IDLE, label: 'Idle Video' },
                  { value: VIDEO_CATEGORIES.ROTATING, label: 'Rotating Video' },
                ]}
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                tone="light"
              />

              {/* Category Info */}
              <div className="p-3 rounded-xl bg-surface-50 border border-surface-200">
                <p className="text-xs text-surface-600 leading-relaxed">
                  {uploadCategory === VIDEO_CATEGORIES.IDLE ? (
                    <>
                      <span className="font-semibold text-amber-600">Idle videos</span>{' '}
                      play automatically when the totem is inactive.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-brand-600">Rotating videos</span>{' '}
                      play continuously in a fixed loop. You can reorder them after upload.
                    </>
                  )}
                </p>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <ProgressBar
                  progress={uploadProgress}
                  label="Uploading video..."
                />
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-white! text-surface-700! border-surface-300! hover:bg-surface-50! hover:border-surface-400! shadow-none!"
                  onClick={resetUploadForm}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={!selectedFile}
                  icon={Upload}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Video?"
        message={`Permanently delete "${deleteTarget?.name || deleteTarget?.filename || 'this video'}" from this totem?`}
        confirmText="Delete"
      />
    </div>
  );
};

export default VideoSection;

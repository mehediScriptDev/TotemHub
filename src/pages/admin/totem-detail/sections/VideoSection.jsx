import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload, Trash2, ChevronUp, ChevronDown, Video as VideoIcon,
  Film, Pause, RotateCcw, X, FileVideo, Plus, Monitor, Play, Layers,
  CloudLightning, Globe, Activity
} from 'lucide-react';
import { Button, Spinner, EmptyState, Select, ConfirmDialog, ProgressBar } from '../../../../Components/ui';
import { videoService } from '../../../../services/videoService';
import { VIDEO_CATEGORIES } from '../../../../config/constants';
import toast from 'react-hot-toast';

const VideoSection = ({ totemId, isActive = true }) => {
  const getErrorMessage = (error, fallback) => {
    if (error?.message) return error.message;
    const payload = error?.response?.data;
    if (typeof payload === 'string' && payload.includes('Target class [admin]')) return 'SYSTEM BINDING FAILURE: [ADMIN]';
    return payload?.message || fallback;
  };

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(isActive);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState(VIDEO_CATEGORIES.ROTATING);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchVideos = useCallback(async () => {
    if (!isActive) return;
    try {
      setLoading(true);
      const data = await videoService.getTotemVideos(totemId);
      setVideos(data?.videos || data || []);
      setHasLoadedOnce(true);
    } catch (error) {
      toast.error(getErrorMessage(error, 'MEDIA SYNC ABORTED'));
    } finally {
      setLoading(false);
    }
  }, [totemId, isActive]);

  useEffect(() => {
    if (isActive && !hasLoadedOnce) fetchVideos();
  }, [isActive, hasLoadedOnce, fetchVideos]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const result = await videoService.upload(totemId, selectedFile, uploadCategory, (progress) => {
        if (!progress?.total) return;
        setUploadProgress(Math.min(100, Math.round((progress.loaded / progress.total) * 100)));
      });
      const newVideo = result?.video || result;
      setVideos((prev) => [...prev, { ...newVideo, category: uploadCategory }]);
      toast.success('ASSET BROADCAST INITIALIZED');
      resetUploadForm();
    } catch (error) {
      toast.error(getErrorMessage(error, 'UPLINK SEQUENCE FAILED'));
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

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) { toast.error('INVALID FORMAT: DETACHED'); return; }
      if (file.size > 500 * 1024 * 1024) { toast.error('PAYLOAD EXCEEDS STUDIO LIMIT'); return; }
      setSelectedFile(file);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await videoService.delete(deleteTarget.id);
      setVideos((prev) => prev.filter((v) => v.id !== deleteTarget.id));
      toast.success('ASSET PURGED FROM GRID');
    } catch (error) {
      toast.error(getErrorMessage(error, 'DECOMMISSION FAILURE'));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const moveVideo = async (index, direction, categoryList) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categoryList.length) return;
    const newCategoryList = [...categoryList];
    [newCategoryList[index], newCategoryList[targetIndex]] = [newCategoryList[targetIndex], newCategoryList[index]];
    const otherVideos = videos.filter(v => v.category !== VIDEO_CATEGORIES.ROTATING);
    setVideos([...otherVideos, ...newCategoryList]);
    try {
      await videoService.reorder(totemId, newCategoryList.map((v) => v.id));
    } catch {
      toast.error('PRIORITY SYNC ERROR');
      fetchVideos();
    }
  };

  const idleVideos = videos.filter((v) => v.category === VIDEO_CATEGORIES.IDLE);
  const rotatingVideos = videos.filter((v) => v.category === VIDEO_CATEGORIES.ROTATING);
  const displayedVideos = filterCategory === 'all' ? videos : (filterCategory === VIDEO_CATEGORIES.IDLE ? idleVideos : rotatingVideos);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
  };

  return (
    <div className="space-y-12">
      {/* Module Header Studio Edition */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 pb-10 border-b border-slate-100">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Broadcast Control</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Configure Digital Media Streams</p>
        </div>
        <button 
          onClick={() => setUploadOpen(true)}
          className="group relative px-10 py-5 rounded-[2rem] bg-slate-900 overflow-hidden shadow-2xl shadow-slate-900/10 hover:shadow-brand-500/30 transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-4 text-white">
            <CloudLightning className="w-5 h-5 font-black" />
            <span className="text-[11px] font-black uppercase tracking-widest">Broadcast New Asset</span>
          </div>
        </button>
      </div>

      {/* Cluster Categories Studio Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { id: 'all', label: 'Global Registry', icon: Layers, count: videos.length, gradient: 'from-slate-900 to-slate-700' },
          { id: VIDEO_CATEGORIES.IDLE, label: 'Idle Protocols', icon: Pause, count: idleVideos.length, gradient: 'from-amber-500 to-orange-400' },
          { id: VIDEO_CATEGORIES.ROTATING, label: 'Sync Rotation', icon: RotateCcw, count: rotatingVideos.length, gradient: 'from-rose-500 to-accent-500' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 relative overflow-hidden group ${filterCategory === cat.id ? `bg-white border-brand-500 shadow-premium` : 'bg-white border-slate-100 hover:border-slate-300'}`}
          >
            <div className={`p-4 rounded-2xl w-fit mb-6 transition-all duration-500 shadow-lg ${filterCategory === cat.id ? `bg-gradient-to-br ${cat.gradient} text-white` : 'bg-slate-50 text-slate-400'}`}>
              <cat.icon className="w-6 h-6" />
            </div>
            <p className="text-5xl font-black text-slate-900 leading-none mb-2 tracking-tighter">{cat.count}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat.label}</p>
            {filterCategory === cat.id && <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />}
          </button>
        ))}
      </div>

      {/* Media Stream Studio View */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-8 animate-slow-fade">
          <Spinner size="lg" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse pl-2">Syncing Stream Buffer...</p>
        </div>
      ) : displayedVideos.length === 0 ? (
        <div className="py-32 flex flex-col items-center text-center space-y-10 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 group">
           <div className="w-24 h-24 rounded-[3rem] bg-white flex items-center justify-center shadow-xl border border-slate-100 transform transition-transform group-hover:rotate-12 duration-500">
             <Film className="w-10 h-10 text-slate-200" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-40">Stream buffer empty - broadcast required</p>
           <button onClick={() => setUploadOpen(true)} className="px-10 py-5 rounded-[1.5rem] bg-white border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:border-brand-500 transition-all shadow-premium">Initialize Handshake</button>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedVideos.map((video, index) => {
            const isRotating = video.category === VIDEO_CATEGORIES.ROTATING;
            const rotatingIndex = isRotating ? rotatingVideos.findIndex(v => v.id === video.id) : -1;
            return (
              <div
                key={video.id}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-6 flex items-center gap-10 hover:shadow-premium hover:border-brand-100 transition-all duration-500"
              >
                {/* Visual Preview Studio Edition */}
                <div className="relative w-36 h-24 rounded-2xl overflow-hidden border border-slate-100 bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-xl">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <FileVideo className="w-8 h-8 text-white/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div className="flex items-center gap-2">
                       <Play className="w-3.5 h-3.5 text-white" fill="currentColor" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Preview</span>
                    </div>
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-sm font-black text-slate-900 truncate uppercase tracking-tight mb-3 flex items-center gap-3">
                    {video.name || video.filename || 'Unknown Stream'}
                    <Activity className="w-3.5 h-3.5 text-success-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${video.category === VIDEO_CATEGORIES.IDLE ? 'bg-amber-500/5 text-amber-600 border-amber-100' : 'bg-rose-500/5 text-rose-600 border-rose-100'}`}>
                      {video.category === VIDEO_CATEGORIES.IDLE ? <Pause className="w-3 h-3" /> : <RotateCcw className="w-3 h-3" />}
                      {video.category}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[11px] font-black text-slate-400 uppercase tabular-nums tracking-widest">{formatFileSize(video.size)}</span>
                  </div>
                </div>

                {/* Broadcast Priority controls */}
                {isRotating && filterCategory !== 'all' && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 border-l border-slate-100 pl-8">
                    <button onClick={() => moveVideo(rotatingIndex, -1, rotatingVideos)} disabled={rotatingIndex === 0} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg disabled:opacity-10 transition-all border border-transparent hover:border-slate-100"><ChevronUp className="w-5 h-5" /></button>
                    <button onClick={() => moveVideo(rotatingIndex, 1, rotatingVideos)} disabled={rotatingIndex === rotatingVideos.length - 1} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-lg disabled:opacity-10 transition-all border border-transparent hover:border-slate-100"><ChevronDown className="w-5 h-5" /></button>
                  </div>
                )}

                {/* Purge Control */}
                <button onClick={() => setDeleteTarget(video)} className="w-12 h-12 flex items-center justify-center rounded-xl bg-danger-500/5 text-danger-500 hover:bg-danger-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Trash2 className="w-5 h-5" /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Broadcast Media Uploader */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 lg:p-12 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-3xl" onClick={() => !uploading && resetUploadForm()} />
          <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-2xl border border-white rounded-[4rem] shadow-premium p-10 lg:p-16 animate-slide-up overflow-hidden">
             {/* Background glow */}
             <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-brand-500/10 blur-[100px] rounded-full -z-10" />
             
             <div className="flex items-center justify-between mb-16 px-4">
               <div className="space-y-2">
                 <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Broadcast Uplink</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Asset Ingestion Protocol</p>
               </div>
               <button onClick={resetUploadForm} className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center border border-slate-100"><X className="w-8 h-8" /></button>
             </div>

             <div className="space-y-10 relative z-10 px-4">
               <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-4 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all duration-700 ${selectedFile ? 'border-brand-500/30 bg-brand-500/5' : 'border-slate-100 hover:border-brand-500/20 bg-slate-50/50 hover:bg-white hover:shadow-2xl'}`}
               >
                 <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
                 <div className={`w-28 h-28 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center transition-all duration-700 shadow-2xl shadow-brand-500/10 ${selectedFile ? 'bg-gradient-premium text-white animate-bounce' : 'bg-white text-slate-200 border border-slate-100'}`}><Upload className="w-12 h-12" /></div>
                 {selectedFile ? (
                   <div className="space-y-2">
                     <p className="text-xl font-black text-slate-900 uppercase tracking-tight truncate max-w-sm mx-auto">{selectedFile.name}</p>
                     <p className="text-[11px] font-black text-brand-500 uppercase tracking-widest">{formatFileSize(selectedFile.size)} READY FOR UPLINK</p>
                   </div>
                 ) : (
                    <div className="space-y-4">
                      <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">SELECT SOURCE CARRIER</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-60">MP4, MOV, WEBM • 500MB MAX PAYLOAD</p>
                    </div>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-6">
                 {[
                   { id: VIDEO_CATEGORIES.ROTATING, label: 'Broadcast Loop', icon: RotateCcw, desc: 'Sync Playlist' },
                   { id: VIDEO_CATEGORIES.IDLE, label: 'Standby Stream', icon: Pause, desc: 'Idle Protocol' }
                 ].map((c) => (
                   <button
                     key={c.id}
                     onClick={() => setUploadCategory(c.id)}
                     className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-500 ${uploadCategory === c.id ? 'bg-white border-brand-500 shadow-premium' : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:border-slate-300'}`}
                   >
                     <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all duration-500 ${uploadCategory === c.id ? 'bg-brand-500 text-white shadow-lg' : 'bg-white text-slate-200 border border-slate-100'}`}>
                        <c.icon className="w-6 h-6" />
                     </div>
                     <h5 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${uploadCategory === c.id ? 'text-slate-900' : 'text-slate-400'}`}>{c.label}</h5>
                     <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{c.desc}</p>
                   </button>
                 ))}
               </div>

               {uploading ? (
                 <div className="space-y-6 pt-4">
                   <div className="h-6 w-full bg-slate-50 rounded-full overflow-hidden p-1.5 border border-slate-100 shadow-inner">
                     <div className="h-full bg-gradient-premium rounded-full transition-all duration-700 relative" style={{ width: `${uploadProgress}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                     </div>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black text-brand-500 uppercase tracking-[0.4em]">
                     <span className="animate-pulse">Broadcasting Media Payload...</span>
                     <span>{uploadProgress}% COMPLETE</span>
                   </div>
                 </div>
               ) : (
                  <div className="flex gap-6 pt-4">
                    <button onClick={resetUploadForm} className="flex-1 py-6 rounded-[1.75rem] border-2 border-slate-100 bg-white text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:text-slate-900 transition-all duration-500">Cancel Protocol</button>
                    <button onClick={handleUpload} disabled={!selectedFile} className="flex-1 py-6 rounded-[1.75rem] bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 disabled:opacity-20 transition-all duration-500 relative overflow-hidden group/btn">
                       <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                       <span className="relative z-10">Initialize Uplink</span>
                    </button>
                  </div>
               )}
             </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="PURGE MEDIA ARCHIVE?"
        message={`This protocol will remove "${deleteTarget?.name || deleteTarget?.filename}" from the core broadcast registry. Purge is irreversible.`}
        confirmText="Confirm Purge"
      />
    </div>
  );
};

export default VideoSection;

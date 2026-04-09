import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Video, Search, ArrowLeft, RefreshCw, LayoutGrid, Monitor, Activity, Terminal, Sparkles, ChevronRight } from 'lucide-react';
import { Button, Spinner, EmptyState } from '../../../Components/ui';
import { totemService } from '../../../services/totemService';
import { toast } from 'react-hot-toast';
import VideoSection from '../totem-detail/sections/VideoSection';

const VideoManagementPage = () => {
  const navigate = useNavigate();
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTotem, setSelectedTotem] = useState(null);
  const [search, setSearch] = useState('');

  const fetchTotems = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await totemService.getAll();
      setTotems(Array.isArray(data) ? data : []);
      if (isRefresh) toast.success('STUDIO FLEET UPDATED');
    } catch (err) {
      console.error(err);
      toast.error('SYNC PROTOCOL FAILURE');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchTotems(); }, []);

  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return totems;
    return totems.filter((t) => {
      const name = (t.name || '').toLowerCase();
      const owner = ((t.user && (t.user.email || t.user.email_address)) || t.partnerEmail || '').toLowerCase();
      const storeId = (t.id_store || '').toString().toLowerCase();
      return name.includes(q) || owner.includes(q) || storeId.includes(q);
    });
  }, [search, totems]);

  // auto-select first item when list loads on larger screens
  useEffect(() => {
    if (!selectedTotem && filtered.length > 0 && window.innerWidth >= 1024) {
      setSelectedTotem(filtered[0]);
    }
  }, [filtered, selectedTotem]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-12 animate-slow-fade">
      {/* Studio Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-4">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-[2rem] bg-gradient-premium shadow-2xl shadow-brand-500/20 transform -rotate-3">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 uppercase leading-none">
              BROADCAST<span className="text-brand-500">MAX</span>
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              Real-time Sync
            </p>
            <div className="w-px h-4 bg-slate-200" />
            <p className="text-brand-500 font-black text-xs uppercase tracking-[0.3em]">
              Active Channels: {totems.length}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => fetchTotems(true)}
            disabled={refreshing || loading}
            className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-premium text-slate-900 hover:border-brand-100 transition-all duration-500 ${refreshing ? 'animate-spin opacity-50' : 'hover:scale-110 active:scale-95'}`}
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          
          <div className="h-16 w-px bg-slate-100 mx-4 hidden sm:block" />

          <button
             onClick={() => navigate('/')}
             className="px-8 py-4 rounded-[1.5rem] bg-white border border-slate-100 shadow-premium hover:border-brand-500 text-slate-900 font-black text-[11px] uppercase tracking-widest transition-all hover:-translate-y-1 duration-500 flex items-center gap-4"
          >
            <ArrowLeft className="w-5 h-5 text-brand-500" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Master-Detail Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left column: Node Selector */}
        <div className={`lg:col-span-4 space-y-6 ${selectedTotem ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-premium flex flex-col min-h-[700px]">
            <div className="relative mb-10 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="FILTER BROADCAST NODES..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[10px] font-black tracking-widest uppercase focus:bg-white focus:border-brand-500/20 outline-none transition-all placeholder:text-slate-400/50 text-slate-900 shadow-inner group-focus-within:shadow-lg"
              />
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loading && !refreshing ? (
                <div className="py-24 flex flex-col items-center gap-6 text-slate-400">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-brand-500 animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Scanning Airwaves...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-32 text-center space-y-6">
                   <div className="w-20 h-20 rounded-[2rem] bg-slate-50 mx-auto flex items-center justify-center border border-slate-100">
                     <Monitor className="w-8 h-8 text-slate-300 opacity-30" />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No nodes detected in current sector</p>
                </div>
              ) : (
                filtered.map((t, idx) => {
                  const isActive = selectedTotem && String(selectedTotem.id) === String(t.id);
                  const ownerName = t.user
                    ? (t.user.first_name ? `${t.user.first_name}${t.user.last_name ? ' ' + t.user.last_name : ''}` : (t.user.name || ''))
                    : (t.partnerEmail || '');

                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTotem(t)}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      className={`
                        w-full group relative flex items-center gap-5 p-5 rounded-[1.75rem] border-2 text-left transition-all duration-500 animate-slow-fade
                        ${isActive 
                          ? 'bg-gradient-premium border-brand-500 text-white shadow-2xl shadow-brand-500/20' 
                          : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200 shadow-sm'}
                      `}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 border-2 ${isActive ? 'bg-white/20 border-white/40 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg'}`}>
                        <Monitor className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={`text-xs font-black uppercase tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>{t.name || 'Unnamed node'}</h4>
                          {isActive && <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />}
                        </div>
                        <p className={`text-[10px] font-bold truncate uppercase tracking-widest ${isActive ? 'text-white/70' : 'text-slate-400'}`}>{ownerName || 'Direct'}</p>
                      </div>

                      <div className="text-right shrink-0 px-2">
                        <p className={`font-black tracking-tighter text-lg leading-none ${isActive ? 'text-white' : 'text-slate-900'}`}>{t.videoCount || 0}</p>
                        <p className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white/50' : 'text-slate-400'}`}>Items</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right column: Broadcast Studio Control */}
        <div className={`lg:col-span-8 ${!selectedTotem ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 lg:p-12 shadow-premium min-h-[700px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none -z-10" />
            
            {selectedTotem ? (
              <div className="space-y-12 animate-slow-fade">
                {/* Node Identity Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl relative group overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                   
                   <div className="flex items-center gap-8 relative z-10">
                    <button 
                      onClick={() => setSelectedTotem(null)}
                      className="lg:hidden w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 hover:bg-white/20"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
                      <Activity className="w-8 h-8 text-brand-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{selectedTotem.name}</h2>
                        <span className="w-2.5 h-2.5 rounded-full bg-success-500 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-white/50">
                          <Terminal className="w-4 h-4 text-brand-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">NODE: {selectedTotem.id_store || 'GEN-X'}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[10px] font-black text-success-500 uppercase tracking-widest">Broadcast Synchronized</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/totem/${selectedTotem.id}`)}
                    className="relative z-10 px-8 py-4 rounded-2xl bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all duration-500 flex items-center gap-4 group/btn"
                  >
                    <span>Terminal Hub</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Video Module Core */}
                <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100">
                   <VideoSection totemId={selectedTotem.id} isActive={true} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-48 text-center space-y-10 animate-slow-fade">
                <div className="relative group">
                  <div className="absolute -inset-10 bg-brand-500/5 blur-3xl rounded-full group-hover:bg-brand-500/10 transition-all duration-700" />
                  <div className="relative w-32 h-32 rounded-[3.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110 duration-700">
                    <Video className="w-14 h-14 text-slate-300 opacity-30" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Awaiting Instruction</h3>
                  <p className="max-w-xs mx-auto text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] leading-relaxed opacity-60">
                    Initial node synchronization required. Select a terminal from the broadcast network to activate media control protocols.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoManagementPage;

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { 
  ArrowLeft, 
  Monitor, 
  ShoppingBag, 
  Video, 
  Mail, 
  Activity, 
  Settings, 
  LayoutGrid,
  Zap,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Spinner } from '../../../Components/ui';
import { totemService } from '../../../services/totemService';
import ProductSection from './sections/ProductSection';
import VideoSection from './sections/VideoSection';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'products', label: 'INVENTORY HUB', icon: ShoppingBag, desc: 'Manage catalog sync' },
  { id: 'videos', label: 'MEDIA BROADCAST', icon: Video, desc: 'Playback sequence' },
];

const TotemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [totem, setTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const initialTabFromQuery = new URLSearchParams(location.search).get('tab');
  const initialTab = initialTabFromQuery === 'videos' ? 'videos' : 'products';
  const [activeTab, setActiveTab] = useState(initialTab);

  const fetchTotem = useCallback(async (isSync = false) => {
    try {
      if (isSync) setSyncing(true);
      else setLoading(true);
      const data = await totemService.getById(id);
      setTotem(data?.totem || data);
      if (isSync) toast.success('TERMINAL SYNCHRONIZED');
    } catch {
      toast.error('ACCESS REJECTED');
      navigate('/');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTotem();
  }, [fetchTotem]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'videos' || tab === 'products') setActiveTab(tab);
  }, [location.search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8">
        <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-brand-500 animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse pl-2">Syncing Terminal Node</p>
      </div>
    );
  }

  if (!totem) return null;

  return (
    <div className="max-w-screen-2xl mx-auto space-y-12 animate-slow-fade">
      {/* Dynamic Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all hover:bg-slate-50 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-[9px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             Core Synchronized
           </div>
           <button 
             onClick={() => fetchTotem(true)}
             disabled={syncing}
             className={`p-3 rounded-2xl bg-white border border-slate-100 text-slate-900 transition-all shadow-sm hover:border-brand-500 ${syncing ? 'animate-spin opacity-50' : ''}`}
           >
             <RefreshCw className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* STUDIO DEVICE CONSOLE */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-premium rounded-[3rem] blur-2xl opacity-5 group-hover:opacity-10 transition duration-1000"></div>
        <div className="relative bg-white border border-slate-100 rounded-[3rem] p-10 lg:p-14 shadow-premium">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex flex-col sm:flex-row items-center gap-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xl relative overflow-hidden group/icon transition-transform duration-700 group-hover:-rotate-3">
                   <Monitor className="w-12 h-12 text-brand-500 relative z-10 group-hover/icon:scale-110 transition-transform" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-success-500" />
                </div>
              </div>

              <div className="space-y-4 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
                    {totem.name}
                  </h1>
                  <span className="px-4 py-1.5 rounded-xl bg-slate-100 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                    SN: {id.split('-')[0].toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-brand-50 text-brand-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 tracking-tight">{totem.partnerEmail || totem.user?.email || 'unassigned@studio.io'}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-slate-100" />
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-accent-50 text-accent-600">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 tracking-tight">Main Cluster</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
               <button className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-white hover:border-brand-500 transition-all flex items-center gap-3 shadow-sm">
                 <Settings className="w-4.5 h-4.5" />
                 <span>Config</span>
               </button>
               <button className="px-8 py-4 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-3">
                 <ExternalLink className="w-4.5 h-4.5" />
                 <span>Remote view</span>
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* STUDIO PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side Navigation Tabs */}
        <div className="lg:col-span-3 space-y-4">
          <p className="px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 opacity-80">Management Modules</p>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-5 p-6 rounded-[2rem] text-left transition-all duration-500 border-2 group
                  ${isActive 
                    ? 'bg-white border-brand-500 shadow-premium' 
                    : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'}
                `}
              >
                <div className={`p-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-gradient-premium text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-white'}`}>
                  <tab.icon className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{tab.label}</h4>
                  <p className={`text-[10px] font-bold leading-none truncate opacity-60`}>{tab.desc}</p>
                </div>
                {isActive && (
                  <ChevronRight className="w-5 h-5 text-brand-500" />
                )}
              </button>
            );
          })}
          
          <div className="p-10 mt-16 bg-gradient-premium rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-brand-500/20">
             <div className="relative z-10 space-y-6">
               <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                 <ShieldCheck className="w-7 h-7 text-white" />
               </div>
               <div className="space-y-2">
                 <h5 className="text-white font-black text-xl tracking-tighter uppercase leading-tight">Terminal Status: Verified</h5>
                 <p className="text-brand-50 text-xs font-bold leading-relaxed opacity-80 uppercase tracking-widest">Global Handshake Active</p>
               </div>
               <button className="w-full py-4 rounded-2xl bg-white text-brand-600 text-[10px] font-black uppercase tracking-wider transition-all shadow-xl shadow-brand-500/10 hover:-translate-y-1">Security Audit</button>
             </div>
             <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10 rotate-12" />
          </div>
        </div>

        {/* Right Module Workspace */}
        <div className="lg:col-span-9 animate-slow-fade">
          <div className="bg-white border border-slate-100 rounded-[3rem] p-8 lg:p-12 shadow-premium min-h-[700px]">
            {activeTab === 'products' && <ProductSection totemId={id} isActive={true} />}
            {activeTab === 'videos' && <VideoSection totemId={id} isActive={true} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotemDetailPage;

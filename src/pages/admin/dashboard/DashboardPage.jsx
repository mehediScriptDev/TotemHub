import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, Grid3x3, List, RefreshCw, Layers, LayoutGrid, Filter, ArrowUpRight } from 'lucide-react';
import { totemService } from '../../../services/totemService';
import { Button, Spinner, EmptyState } from '../../../Components/ui';
import TotemCard from './component/TotemCard';
import DashboardStats from './sections/DashboardStats';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('totemViewMode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('totemViewMode', mode);
    } catch {
      console.error('Failed to persist view mode');
    }
  };

  const fetchTotems = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      const data = await totemService.getAll();
      setTotems(Array.isArray(data) ? data : []);
      if (isRefresh) toast.success('TERMINALS SYNCHRONIZED');
    } catch (err) {
      toast.error('SYNC PROTOCOL FAILURE');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchTotems(); }, [fetchTotems]);

  const filteredTotems = totems.filter((t) =>
    (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.user?.email || t.partnerEmail || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTotems.length / itemsPerPage));
  const paginatedTotems = filteredTotems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto space-y-12 animate-slow-fade pb-20">
      {/* Studio Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-2xl shadow-brand-500/30 transform -rotate-6">
                <LayoutGrid className="w-7 h-7 text-white" />
             </div>
             <div className="space-y-1">
               <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-none">
                 STUDIO<span className="text-brand-500">MAX</span>
               </h1>
               <div className="flex items-center gap-4">
                 <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Operational Dashboard</p>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                 <p className="text-brand-500 font-black text-xs uppercase tracking-[0.3em]">{totems.length} Devices Online</p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => fetchTotems(true)}
            disabled={refreshing || loading}
            className={`p-3 rounded-3xl bg-white border border-slate-100 shadow-premium hover:border-brand-500 text-slate-900 transition-all duration-500 ${refreshing ? 'animate-spin opacity-50' : 'hover:scale-110 active:scale-95'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <div className="h-14 w-px bg-slate-100 mx-4 hidden xl:block" />

          <button
             onClick={() => navigate('/totem/new')}
             className="group relative px-8 py-3 rounded-4xl bg-slate-900 overflow-hidden shadow-2xl shadow-slate-900/10 hover:shadow-brand-500/30 transition-all duration-500 hover:-translate-y-2 active:translate-y-0"
          >
            <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4">
              <Plus className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Add Terminal</span>
            </div>
          </button>
        </div>
      </div>

      <DashboardStats totems={totems} />

      {/* Control Station Bar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-center bg-white border border-slate-100 p-5 rounded-2xl shadow-premium">
        <div className="xl:col-span-6 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          <input
            type="text"
            placeholder="FILTER TERMINALS BY IDENTITY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-5 py-2.5 bg-slate-50 border border-slate-100 rounded-3xl text-[10px] font-black tracking-widest uppercase focus:bg-white focus:border-brand-500/30 focus:shadow-sm outline-none transition-all placeholder:text-slate-400/50 text-slate-900"
          />
        </div>

        <div className="xl:col-span-3 flex items-center justify-center gap-3">
           <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status: <span className="text-success-600">Stable</span></span>
           </div>
        </div>

        <div className="xl:col-span-3 flex items-center justify-end gap-4">
          <div className="flex bg-slate-50 rounded-[1.25rem] p-1 border border-slate-100">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2.5 rounded-xl transition-all duration-500 ${viewMode === 'grid' ? 'bg-white shadow-lg text-brand-500' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2.5 rounded-xl transition-all duration-500 ${viewMode === 'list' ? 'bg-white shadow-lg text-brand-500' : 'text-slate-400 hover:text-slate-900'}`}
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio View Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-slow-fade">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-brand-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-4 h-4 bg-brand-500 rounded-full animate-pulse shadow-lg shadow-brand-500/40" />
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse pl-2">Syncing Studio Core</p>
        </div>
      ) : filteredTotems.length > 0 ? (
        <div className="space-y-12">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
              {paginatedTotems.map((totem, idx) => (
                <div key={totem.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slow-fade">
                  <TotemCard totem={totem} onDeleted={fetchTotems} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedTotems.map((totem, idx) => (
                <div key={totem.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-slow-fade">
                  <TotemCard totem={totem} onDeleted={fetchTotems} viewMode={viewMode} />
                </div>
              ))}
            </div>
          )}

          {/* Large Studio Pagination */}
          {filteredTotems.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-16 border-t border-slate-100">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="text-slate-900 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">Index {currentPage} / {totalPages}</span>
                <span>Fleet Records: {filteredTotems.length}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 h-auto rounded-2xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-900 hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <div className="flex gap-2 mx-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-[9px] font-black transition-all duration-500 ${p === currentPage ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2.5 h-auto rounded-2xl border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-900 hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 lg:p-24 flex flex-col items-center justify-center text-center space-y-10 shadow-premium animate-slow-fade">
          <div className="relative group">
            <div className="absolute -inset-10 bg-brand-500/5 blur-3xl rounded-full group-hover:bg-brand-500/10 transition-all duration-700" />
            <div className="relative w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-2xl shadow-slate-900/5 transform transition-transform group-hover:rotate-12 duration-500">
              <Monitor className="w-12 h-12 text-slate-300 opacity-50" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              {searchQuery ? 'RECORD NOT FOUND' : 'STUDIO FLEET EMPTY'}
            </h3>
            <p className="max-w-md text-slate-400 font-bold uppercase tracking-[0.2em] text-xs leading-loose opacity-60">
              {searchQuery ? `Protocol failed to resolve identity matching "${searchQuery}". Check sequence and retry.` : 'Initialize the studio network by deploying your first terminal node to the cloud.'}
            </p>
          </div>
          {!searchQuery && (
             <button
               onClick={() => navigate('/totem/new')}
               className="bg-slate-900 hover:bg-slate-800 px-12 py-3.5 h-auto rounded-4xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-slate-900/10 transition-all hover:-translate-y-2 flex items-center gap-4"
             >
               Deploy Source
               <ArrowUpRight className="w-5 h-5" />
             </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

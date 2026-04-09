import React from 'react';
import { useNavigate } from 'react-router';
import { Home, AlertTriangle, Terminal } from 'lucide-react';
import { Button } from '../../Components/ui';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Distortion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-danger-500/10 blur-[120px] rounded-full animate-pulse" />
      
      <div className="text-center relative z-10 animate-slow-fade">
        <div className="mb-8 relative inline-block">
          <div className="absolute -inset-10 bg-danger-500/10 blur-3xl rounded-full" />
          <h1 className="text-[150px] sm:text-[200px] font-black tracking-tighter text-white opacity-5 select-none leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-[2rem] bg-surface-100 border border-surface-200 flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform duration-500">
              <AlertTriangle className="w-12 h-12 text-danger-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger-500/10 border border-danger-500/20">
            <Terminal className="w-3 h-3 text-danger-500" />
            <span className="text-[10px] font-black text-danger-400 uppercase tracking-[0.2em]">Route Disconnected</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Protocol Violation</h2>
          <p className="text-surface-500 font-bold uppercase tracking-widest text-xs max-w-sm mx-auto leading-loose opacity-60 px-6">
            The requested sector does not exist in the current grid navigation or has been purged from the master index.
          </p>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="group relative px-12 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[11px] uppercase tracking-[0.3em] transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-brand-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10 flex items-center gap-4">
            <Home className="w-4 h-4" />
            <span>Return to Core</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default NotFound;

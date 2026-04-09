import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Monitor, Lock, User, ArrowRight, Eye, EyeOff, Terminal, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('AUTHENTICATION SUCCESSFUL');
      navigate('/');
    } catch (err) {
      toast.error('ACCESS DENIED: PROTOCOL REJECTED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF1] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Studio Studio Backdrop */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 animate-pulse" />
      
      {/* Decorative Brand Elements */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none select-none overflow-hidden flex flex-wrap gap-20 p-20">
         {Array.from({ length: 12 }).map((_, i) => (
           <h2 key={i} className="text-[12rem] font-black text-slate-900 leading-none">STUDIOMAX</h2>
         ))}
      </div>

      <div className="w-full max-w-xl relative group">
        {/* Glow behind card */}
        <div className="absolute -inset-10 bg-brand-500/5 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-white/90 backdrop-blur-3xl border border-white p-12 lg:p-20 rounded-[4rem] shadow-premium overflow-hidden">
          {/* Internal branding */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="relative mb-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-700">
              <div className="absolute -inset-6 bg-brand-500/10 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center shadow-2xl ring-8 ring-slate-50">
                <Monitor className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none flex items-center justify-center gap-2">
                STUDIO<span className="text-brand-500">MAX</span>
                <Sparkles className="w-4 h-4 text-accent-500" />
              </h1>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Terminal Access</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">System Identity</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-6 flex items-center">
                  <User className="w-6 h-6 text-slate-300 group-focus-within/field:text-brand-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@studiomax.io"
                  required
                  className="w-full h-20 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold outline-none focus:bg-white focus:border-brand-500/30 focus:shadow-xl transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Access Protocol</label>
                <button type="button" className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:text-brand-400 transition-colors">Emergency Reset</button>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-6 flex items-center">
                  <Lock className="w-6 h-6 text-slate-300 group-focus-within/field:text-brand-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-20 pl-16 pr-16 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold outline-none focus:bg-white focus:border-brand-500/30 focus:shadow-xl transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-6 flex items-center text-slate-300 hover:text-slate-900 transition-all"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-20 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl shadow-slate-900/10 disabled:opacity-30 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700" />
                {loading ? (
                   <div className="w-8 h-8 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10">Initial Sync</span>
                    <ArrowRight className="w-6 h-6 relative z-10 group-hover/btn:translate-x-2 transition-transform shadow-sm" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
             <div className="flex items-center gap-3 text-slate-400">
               <ShieldCheck className="w-5 h-5 text-success-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Encrypted Handshake Protocol Active</span>
             </div>
             <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.5em] opacity-50">V2.4.0 STUDIO EDITION</p>
          </div>
        </div>
        
        <p className="mt-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
          This system is restricted to authorized studio personnel only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

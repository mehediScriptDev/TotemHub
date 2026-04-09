import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Search, User, Layout, Loader2, Monitor, ShieldCheck, Cpu, Sparkles, Send } from 'lucide-react';
import { totemService } from '../../../services/totemService';
import { toast } from 'react-hot-toast';

const CreateTotemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [partnerUser, setPartnerUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    partnerEmail: '',
  });

  const trimmedName = formData.name.trim();
  const normalizedEmail = formData.partnerEmail.trim().toLowerCase();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const isCreateEnabled = Boolean(partnerUser) && trimmedName.length > 0 && !loading;

  const disabledReason = useMemo(() => {
    if (!trimmedName) return 'Node Label Required';
    if (!isEmailValid) return 'Enter Partner Uplink';
    if (!partnerUser) return 'Verify Identity First';
    return '';
  }, [trimmedName, isEmailValid, partnerUser]);

  const handleSearchPartner = async () => {
    if (!isEmailValid) {
      toast.error('INVALID UPLINK PROTOCOL');
      return;
    }

    try {
      setSearching(true);
      setPartnerUser(null);
      const users = await totemService.searchUserByEmail(normalizedEmail);
      
      if (users && users.length > 0) {
        const exactMatch = users.find((user) => {
          const userEmail = (user.email || user.email_address || '').toLowerCase();
          return userEmail === normalizedEmail;
        });

        if (!exactMatch) {
          toast.error('NODE IDENTITY MISMATCH');
          return;
        }

        setPartnerUser(exactMatch);
        toast.success(`IDENTITY VERIFIED: ${exactMatch.name || exactMatch.email}`);
      } else {
        toast.error('IDENTITY RECORD NOT FOUND');
      }
    } catch {
      toast.error('DATABASE SYNCHRONIZATION ERROR');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partnerUser) return;

    try {
      setLoading(true);
      await totemService.create({
        id_store: partnerUser.id,
        name: trimmedName,
      });

      toast.success('TERMINAL DEPLOYMENT INITIALIZED');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      toast.error('PROVISIONING HANDSHAKE FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-slow-fade pb-20">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 mb-16">
        <div className="flex items-center gap-10">
          <button
            onClick={() => navigate('/')}
            className="w-20 h-20 flex items-center justify-center rounded-[2rem] bg-white border border-slate-100 text-slate-400 hover:text-brand-500 hover:border-brand-500 transition-all duration-500 group shadow-premium"
          >
            <ArrowLeft className="w-8 h-8 group-hover:-translate-x-2 transition-transform" />
          </button>
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase mb-1">Deployment</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Initialize Terminal Provisioning Sequence</p>
          </div>
        </div>
        
        <div className="px-8 py-4 rounded-[1.5rem] bg-white border border-slate-100 flex items-center gap-6 shadow-premium">
           <div className="p-3 rounded-2xl bg-brand-50 transition-colors group-hover:bg-brand-100"><Cpu className="w-7 h-7 text-brand-500" /></div>
           <div className="space-y-0.5">
             <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-tight">Handshake Mode</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Priority Direct Link</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 lg:p-20 shadow-premium relative overflow-hidden group">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
          
          <form onSubmit={handleSubmit} className="space-y-16 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Node ID Field */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-brand-500 shadow-sm"><Layout className="w-5 h-5" /></div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Identification Label</label>
                </div>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="E.G. TERMINAL-72-BETA"
                  required
                  className="w-full h-24 px-10 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black text-xl tracking-widest placeholder:text-slate-200 focus:bg-white focus:border-brand-500/20 focus:shadow-2xl outline-none transition-all duration-500"
                />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] pl-4 opacity-60 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent-500" />
                  Global Broadcast Node Identity
                </p>
              </div>

              {/* Partner verification field */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-50 text-accent-600 shadow-sm"><User className="w-5 h-5" /></div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Partner Uplink Protocol</label>
                </div>
                <div className="relative group/search">
                  <input
                    value={formData.partnerEmail}
                    onChange={(e) => {
                      setFormData({ ...formData, partnerEmail: e.target.value });
                      setPartnerUser(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchPartner())}
                    placeholder="UPLINK@ACCOUNT.COM"
                    required
                    className={`w-full h-24 px-10 pr-40 bg-slate-50 border rounded-[2rem] text-slate-900 font-black text-xl tracking-widest placeholder:text-slate-200 outline-none transition-all duration-500 ${partnerUser ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-100 focus:bg-white focus:border-brand-500/20 focus:shadow-2xl'}`}
                  />
                  <button
                    type="button"
                    onClick={handleSearchPartner}
                    disabled={searching || !isEmailValid}
                    className={`absolute right-4 top-4 bottom-4 px-10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${partnerUser ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-brand-600 shadow-xl shadow-slate-900/10'}`}
                  >
                    {searching ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (partnerUser ? 'Identity Verified' : 'Verify Uplink')}
                  </button>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  {partnerUser ? (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Master record located: {partnerUser.name || partnerUser.email}</span>
                    </>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] opacity-40">Cross-reference with secure studio registry</span>
                  )}
                </div>
              </div>
            </div>

            {/* Strategy Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-slate-50/50 p-8 lg:p-12 rounded-[3rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-700">
              <div className="md:col-span-3 lg:col-span-2 flex justify-center">
                 <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center border border-slate-100 shadow-2xl relative">
                    <Monitor className="w-10 h-10 text-brand-500" />
                    <div className="absolute top-0 right-0 w-3 h-3 bg-brand-500 rounded-full animate-ping" />
                 </div>
              </div>
              <div className="md:col-span-9 lg:col-span-10 space-y-4">
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Deployment Strategy: Automated Provisions</h4>
                 <p className="text-sm text-slate-500 font-bold leading-relaxed uppercase tracking-widest opacity-70">
                   Initializing direct link to global broadcast network. System will automatically propagate media assets and catalog items upon successful handshake. Provisioning may take up to 300ms following protocol confirmation.
                 </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-8 pt-12 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-16 py-6 h-auto rounded-[2rem] border border-slate-100 bg-white text-slate-400 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-slate-50 hover:text-slate-900 transition-all duration-500"
              >
                Abort Sequence
              </button>

              <div className="relative w-full sm:w-auto overflow-visible group/btn">
                <button
                  type="submit"
                  disabled={!isCreateEnabled}
                  className="w-full sm:w-[400px] h-24 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[0.5em] rounded-[2.5rem] shadow-2xl shadow-slate-900/10 disabled:opacity-30 transition-all duration-500 group/inner relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-premium opacity-0 group-hover/inner:opacity-100 transition-opacity duration-700" />
                  {loading ? (
                     <Loader2 className="w-8 h-8 animate-spin relative z-10 mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center gap-6 relative z-10">
                      <span>Sync Core Link</span>
                      <Send className="w-6 h-6 group-hover/inner:translate-x-2' group-hover/inner:-translate-y-2 transition-transform duration-500" />
                    </div>
                  )}
                </button>

                {!isCreateEnabled && !loading && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap shadow-2xl border border-white/5">
                    {disabledReason}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45 -translate-y-2" />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTotemPage;

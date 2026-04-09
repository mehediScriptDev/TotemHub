import React from 'react';
import { useNavigate } from 'react-router';
import { 
  Trash2, 
  ChevronRight, 
  Video, 
  ShoppingBag,
  Monitor,
  MoreVertical,
  Activity,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../../../../Components/ui';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { totemService } from '../../../../services/totemService';
import { toast } from 'react-hot-toast';

const TotemCard = ({ totem, onDeleted, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  const confirmDelete = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Remove Terminal?',
      text: `Confirm permanent removal of "${totem.name}" from the studio network.`,
      icon: 'warning',
      background: '#ffffff',
      color: '#0f172a',
      showCancelButton: true,
      confirmButtonText: 'Yes, Decommission',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#f1f5f9',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-premium',
        confirmButton: 'rounded-xl font-black uppercase text-[10px] tracking-widest px-8 py-3',
        cancelButton: 'rounded-xl font-black uppercase text-[10px] tracking-widest px-8 py-3 text-slate-500'
      },
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await totemService.delete(totem.id);
        } catch (err) {
          Swal.showValidationMessage(`Protocol Error: ${err?.message || 'Access Denied'}`);
          throw err;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });

    if (result.isConfirmed) {
      toast.success('DECOMMISSION SUCCESSFUL');
      onDeleted?.();
    }
  };

  const getOwner = () => {
    const user = totem.user || null;
    const name = user ? (user.first_name ? `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}` : (user.name || '')) : '';
    const email = (user && (user.email || user.email_address)) || totem.partnerEmail || '';
    const initial = (name ? name.charAt(0) : (totem.name ? totem.name.charAt(0) : 'P')).toUpperCase();
    return { name, email, initial };
  };

  const { name: ownerName, email: ownerEmail, initial: ownerInitial } = getOwner();

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => navigate(`/totem/${totem.id}`)}
        className="group relative bg-white border border-slate-100 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-8 hover:shadow-premium hover:border-brand-100 transition-all duration-500 cursor-pointer mb-4"
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:shadow-lg group-hover:bg-white">
            <Monitor className="w-7 h-7 text-brand-500" />
          </div>
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-slate-900 truncate tracking-tight uppercase leading-none">{totem.name || 'Unnamed Device'}</h3>
              <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">NODE ID: {totem.id_store || 'GEN-842'}</p>
          </div>
        </div>

        <div className="flex items-center gap-12 px-10 border-l border-slate-100 hidden lg:flex">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Media Queue</p>
            <div className="flex items-center gap-2">
               <Video className="w-3.5 h-3.5 text-indigo-500" />
               <p className="text-lg font-black text-slate-900 leading-none">{totem.videoCount || 0}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Catalog</p>
            <div className="flex items-center gap-2">
               <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
               <p className="text-lg font-black text-slate-900 leading-none">{totem.productCount || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white text-[10px] font-black border-4 border-white shadow-xl">
              {ownerInitial}
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 leading-tight uppercase truncate max-w-[120px]">{ownerName || 'Direct Partner'}</p>
              <p className="text-[9px] text-slate-400 font-bold truncate max-w-[120px]">{ownerEmail}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={confirmDelete}
            className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-danger-500 hover:bg-danger-50 transition-all"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="p-4 rounded-2xl bg-slate-900 text-white group-hover:bg-brand-500 transition-all shadow-xl shadow-slate-900/10 group-hover:shadow-brand-500/30">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => navigate(`/totem/${totem.id}`)}
      className="group card-premium overflow-hidden cursor-pointer relative bg-white border-slate-100 shadow-premium"
    >
      <div className="p-8 flex flex-col h-full">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-10">
          <div className="w-16 h-16 rounded-[1.75rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-xl group-hover:bg-white group-hover:border-brand-100 transition-all duration-500">
            <Monitor className="w-7 h-7 text-brand-500" />
          </div>
          <div className="flex gap-2">
            <button 
               onClick={confirmDelete}
               className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-danger-50 hover:border-danger-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <MoreVertical className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-success-500/5 border border-success-500/10 text-[9px] font-black text-success-600 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3 h-3 fill-success-500" />
              Operational
            </span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none group-hover:text-brand-500 transition-colors uppercase">
            {totem.name || 'Unnamed Terminal'}
          </h3>
          <div className="flex items-center gap-2.5">
             <div className="p-1 px-2 rounded-lg bg-slate-100 flex items-center gap-2">
               <Terminal className="w-3.5 h-3.5 text-slate-400" />
               <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{totem.id_store || 'SN-X42'}</span>
             </div>
             <div className="flex items-center gap-1.5 px-2">
               <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
               <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Secured</span>
             </div>
          </div>
        </div>

        {/* Studio Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500"><Video className="w-4 h-4" /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Media</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{totem.videoCount || 0}</p>
          </div>
          <div className="bg-slate-50/50 p-5 rounded-[1.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all duration-500">
            <div className="flex items-center gap-3 text-slate-400 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500"><ShoppingBag className="w-4 h-4" /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Assets</span>
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tighter tabular-nums">{totem.productCount || 0}</p>
          </div>
        </div>

        {/* Studio Footer Area */}
        <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center text-white text-xs font-black ring-4 ring-brand-50 shadow-xl shadow-brand-500/20 uppercase">
               {ownerInitial}
             </div>
             <div className="min-w-0">
               <p className="text-[11px] font-black text-slate-900 truncate uppercase leading-none mb-1">{ownerName || 'System Admin'}</p>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Primary Access</p>
             </div>
          </div>
          
          <div className="w-12 h-12 rounded-2xl bg-slate-900 group-hover:bg-brand-500 text-white flex items-center justify-center transition-all shadow-xl shadow-slate-900/20 group-hover:shadow-brand-500/40">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotemCard;

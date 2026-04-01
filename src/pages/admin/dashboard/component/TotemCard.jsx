import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Trash2, 
  ChevronRight, 
  Video, 
  ShoppingBag, 
  Activity, 
  ExternalLink,
  Layers,
  MapPin
} from 'lucide-react';
import { Button, ConfirmDialog } from '../../../../Components/ui';
import { totemService } from '../../../../services/totemService';
import { toast } from 'react-hot-toast';

const TotemCard = ({ totem, onDeleted }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await totemService.delete(totem.id);
      toast.success('Totem deleted');
      onDeleted?.();
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="card-premium group relative animate-in overflow-hidden shadow-sm hover:shadow-md border border-surface-200">
      {/* Accent Header */}
      <div className="h-1.5 w-full bg-brand-500/20 group-hover:bg-brand-500 transition-all" />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <h3 className="font-black text-lg text-surface-900 group-hover:text-brand-600 transition-colors leading-tight">
              {totem.name || 'Unnamed Totem'}
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              <p className="text-[10px] text-surface-400 font-black tracking-widest uppercase flex items-center gap-1.5">
                STORE ID: {totem.id_store}
              </p>
              {totem.user?.business_type && (
                <span className="text-[9px] px-2 py-0.5 bg-brand-50 text-brand-600 font-black rounded-md uppercase tracking-tighter border border-brand-100">
                  {totem.user.business_type}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Totem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface-50 p-3 rounded-xl border border-surface-200/50">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <Video className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Media</span>
            </div>
            <p className="text-xl font-black text-surface-900 leading-none">
              {(totem.videoCount !== undefined) ? totem.videoCount : '—'}
            </p>
          </div>
          <div className="bg-surface-50 p-3 rounded-xl border border-surface-200/50">
            <div className="flex items-center gap-2 text-surface-400 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Items</span>
            </div>
            <p className="text-xl font-black text-surface-900 leading-none">
              {(totem.productCount !== undefined) ? totem.productCount : '—'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-[10px] font-black text-surface-500 shrink-0 border border-white shadow-sm uppercase">
              {totem.user?.first_name?.charAt(0) || 'P'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-surface-900 truncate uppercase tracking-tight">
                {totem.user?.first_name} {totem.user?.last_name}
              </p>
              <p className="text-[9px] font-bold text-surface-400 truncate tracking-tighter">
                {totem.user?.email}
              </p>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-brand-600 hover:bg-brand-50 !px-2 group"
            onClick={() => navigate(`/totem/${totem.id}`)}
          >
            Manage <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Totem"
        description={`Permanently remove "${totem.name}"? This action is irreversible.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        variant="danger"
      />
    </div>
  );
};

export default TotemCard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Trash2, 
  ChevronRight, 
  Video, 
  ShoppingBag
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
    <div className="group relative animate-in overflow-hidden rounded-2xl bg-white border border-surface-200 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_16px_rgba(15,23,42,0.08)] transition-all">
      {/* Accent Header */}
      <div className="h-1.5 w-full bg-brand-100 group-hover:bg-brand-500/20 transition-all" />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-5">
          <div className="space-y-1">
            <h3 className="font-bold text-2xl text-surface-900 group-hover:text-surface-800 transition-colors leading-tight">
              {totem.name || 'Unnamed Totem'}
            </h3>
            <p className="text-sm text-surface-600 font-medium">
              Store ID: {totem.id_store}
            </p>
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

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-surface-100 p-3 rounded-xl border border-surface-200">
            <div className="flex items-center gap-2 text-surface-500 mb-1">
              <Video className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold">Media</span>
            </div>
            <p className="text-lg font-bold text-surface-800 leading-none">
              {(totem.videoCount !== undefined) ? totem.videoCount : '—'}
            </p>
          </div>
          <div className="bg-surface-100 p-3 rounded-xl border border-surface-200">
            <div className="flex items-center gap-2 text-surface-500 mb-1">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold">Items</span>
            </div>
            <p className="text-lg font-bold text-surface-800 leading-none">
              {(totem.productCount !== undefined) ? totem.productCount : '—'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-surface-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-[10px] font-bold text-surface-600 shrink-0 border border-white shadow-sm uppercase">
              {totem.user?.first_name?.charAt(0) || 'P'}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-surface-800 truncate tracking-tight">
                {totem.user?.first_name} {totem.user?.last_name}
              </p>
              <p className="text-[9px] font-medium text-surface-500 truncate tracking-tight">
                {totem.user?.email}
              </p>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-brand-600 hover:bg-brand-50 px-2! font-semibold"
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
        message={`Permanently remove "${totem.name}"? This action is irreversible.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
};

export default TotemCard;

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

const TotemCard = ({ totem, onDeleted, viewMode = 'grid' }) => {
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

  if (viewMode === 'list') {
    return (
      <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.08)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] hover:border-surface-300 transition-all duration-200">
        {/* Accent left border on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-600 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Primary Info: Icon + Totem Details */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200/60 flex items-center justify-center shrink-0 group-hover:shadow-md group-hover:shadow-brand-500/10 transition-all">
              <ShoppingBag className="w-7 h-7 text-brand-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base text-surface-900 group-hover:text-surface-800 transition-colors truncate leading-snug">
                {totem.name || 'Unnamed Totem'}
              </h3>
              <p className="text-xs text-surface-500 font-medium mt-1 truncate">
                Store ID: <span className="text-surface-600 font-semibold">{totem.id_store}</span>
              </p>
            </div>
          </div>

          {/* Secondary Info: Stats (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center">
                <Video className="w-5 h-5 text-surface-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Videos</p>
                <p className="text-base font-bold text-surface-900">
                  {(totem.videoCount !== undefined) ? totem.videoCount : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-50 border border-surface-200 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-surface-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Products</p>
                <p className="text-base font-bold text-surface-900">
                  {(totem.productCount !== undefined) ? totem.productCount : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Tertiary Info: User (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 px-2 border-l border-surface-200/60">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-brand-500/20 uppercase">
              {totem.user?.first_name?.charAt(0) || 'P'}
            </div>
            <div className="min-w-0 hidden lg:block">
              <p className="text-sm font-semibold text-surface-900 truncate leading-tight">
                {totem.user?.first_name} {totem.user?.last_name}
              </p>
              <p className="text-xs text-surface-500 truncate leading-tight">
                {totem.user?.email}
              </p>
            </div>
          </div>

          {/* Actions: Right Side */}
          <div className="flex items-center gap-2 shrink-0 sm:border-l sm:border-surface-200/60 sm:pl-3">
            <Button
              size="sm"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4! font-semibold shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 transition-all"
              onClick={() => navigate(`/totem/${totem.id}`)}
            >
              <ChevronRight className="w-4 h-4" />
              Manage
            </Button>
            
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2.5 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all hover:shadow-sm"
              title="Delete Totem"
              aria-label="Delete totem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile: Stats Below (mobile view) */}
        <div className="lg:hidden px-6 pb-4 pt-2 border-t border-surface-100 flex gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Video className="w-4 h-4 text-surface-500" />
            <span className="text-xs font-semibold text-surface-500">Videos:</span>
            <span className="text-sm font-bold text-surface-800">{totem.videoCount || 0}</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-surface-500" />
            <span className="text-xs font-semibold text-surface-500">Products:</span>
            <span className="text-sm font-bold text-surface-800">{totem.productCount || 0}</span>
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
  }

  // Grid view (default)
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-surface-200 shadow-[0_1px_2px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_16px_rgba(15,23,42,0.08)] transition-all">
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

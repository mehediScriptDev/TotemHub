import React from 'react';
import { useNavigate } from 'react-router';
import { Monitor, Trash2, ExternalLink, Mail } from 'lucide-react';

/**
 * Individual totem card displayed on the Dashboard grid.
 */
const TotemCard = ({ totem, onDelete, index }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group glass-card rounded-2xl p-5 hover:border-brand-500/30
                 transition-all duration-300 cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => navigate(`/totem/${totem.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/10 border border-brand-500/20 flex items-center justify-center">
          <Monitor className="w-5 h-5 text-brand-400" />
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(totem);
            }}
            title="Delete Totem"
            className="p-2 rounded-lg hover:bg-danger-600/15 text-surface-500
                       hover:text-danger-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="p-2 rounded-lg hover:bg-surface-700 text-surface-500 hover:text-surface-200 transition-all">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-surface-100 mb-1 truncate group-hover:text-brand-300 transition-colors">
        {totem.name}
      </h3>

      {/* Partner Email */}
      <div className="flex items-center gap-1.5 text-surface-500 mb-4">
        <Mail className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs truncate">{totem.partnerEmail}</span>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 pt-3 border-t border-surface-700/50">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-dot" />
          <span className="text-xs text-surface-400">Active</span>
        </div>
        {totem.videoCount !== undefined && (
          <span className="text-xs text-surface-500">
            {totem.videoCount} video{totem.videoCount !== 1 ? 's' : ''}
          </span>
        )}
        {totem.productCount !== undefined && (
          <span className="text-xs text-surface-500">
            {totem.productCount} product{totem.productCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default TotemCard;

import React from 'react';
import { Monitor, Video, ShoppingBag, Activity } from 'lucide-react';

/**
 * Dashboard stats section: displays summary metrics at the top.
 */
const STAT_CARDS = [
  {
    key: 'totalTotems',
    label: 'Total Totems',
    icon: Monitor,
    color: 'from-brand-500/15 to-brand-700/5',
    iconColor: 'text-brand-400',
    borderColor: 'border-brand-500/20',
  },
  {
    key: 'activeDevices',
    label: 'Active Devices',
    icon: Activity,
    color: 'from-success-500/15 to-success-600/5',
    iconColor: 'text-success-500',
    borderColor: 'border-success-500/20',
  },
  {
    key: 'totalVideos',
    label: 'Total Videos',
    icon: Video,
    color: 'from-warning-500/15 to-warning-600/5',
    iconColor: 'text-warning-500',
    borderColor: 'border-warning-500/20',
  },
  {
    key: 'totalProducts',
    label: 'Total Products',
    icon: ShoppingBag,
    color: 'from-brand-300/15 to-brand-400/5',
    iconColor: 'text-brand-300',
    borderColor: 'border-brand-300/20',
  },
];

const DashboardStats = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {STAT_CARDS.map((card, i) => (
        <div
          key={card.key}
          className={`glass-card rounded-2xl p-4 lg:p-5 animate-fade-in`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color}
                          border ${card.borderColor} flex items-center justify-center`}
            >
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          <p className="text-2xl lg:text-3xl font-bold text-surface-100 mb-0.5">
            {stats[card.key] ?? 0}
          </p>
          <p className="text-xs text-surface-500 font-medium">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;

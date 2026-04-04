import React from 'react';
import { Layers, Activity, Video, ShoppingBag } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white px-5 py-4 lg:py-6 rounded-2xl border border-surface-200 shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all flex items-center justify-between group">
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-surface-500 leading-none group-hover:text-surface-700 transition-colors">
        {label}
      </p>
      <p className="text-4xl font-black text-surface-900 leading-none tabular-nums">
        {value}
      </p>
    </div>
    <div className="w-12 h-12 rounded-xl border border-surface-200 bg-surface-50 flex items-center justify-center group-hover:border-brand-100 transition-colors">
      <Icon className="w-6 h-6 text-surface-900" strokeWidth={1.8} />
    </div>
  </div>
);

const DashboardStats = ({ totems = [] }) => {
  const stats = [
    {
      label: 'Total Totems',
      value: totems.length,
      icon: Layers,
    },
    {
      label: 'Active Partners',
      value: new Set(totems.map((t) => t.user?.email || t.partnerEmail).filter(Boolean)).size,
      icon: Activity,
    },
    {
      label: 'Total Videos',
      value: totems.reduce((acc, t) => acc + (t.videoCount || 0), 0),
      icon: Video,
    },
    {
      label: 'Showcase Items',
      value: totems.reduce((acc, t) => acc + (t.productCount || 0), 0),
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;

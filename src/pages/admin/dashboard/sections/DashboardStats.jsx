import React from 'react';
import { Layers, Activity, Video, ShoppingBag } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition-all animate-in flex items-center justify-between group">
    <div className="space-y-1">
      <p className="text-[10px] font-black text-surface-500 uppercase tracking-widest leading-none group-hover:text-surface-800 transition-colors">
        {label}
      </p>
      <p className="text-3xl font-black text-surface-800 leading-none tabular-nums">
        {value}
      </p>
    </div>
    <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/5`}>
      <Icon className="w-6 h-6 " />
    </div>
  </div>
);

const DashboardStats = ({ totems = [] }) => {
  const stats = [
    {
      label: 'Total Totems',
      value: totems.length,
      icon: Layers,
      colorClass: 'bg-brand-500 text-brand-600',
    },
    {
      label: 'Active Partners',
      value: new Set(totems.map((t) => t.user?.email || t.partnerEmail).filter(Boolean)).size,
      icon: Activity,
      colorClass: 'bg-green-500 text-green-600',
    },
    {
      label: 'Total Videos',
      value: totems.reduce((acc, t) => acc + (t.videoCount || 0), 0),
      icon: Video,
      colorClass: 'bg-amber-500 text-amber-600',
    },
    {
      label: 'Showcase Items',
      value: totems.reduce((acc, t) => acc + (t.productCount || 0), 0),
      icon: ShoppingBag,
      colorClass: 'bg-indigo-500 text-indigo-600',
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

import React from 'react';
import { Activity, Video, ShoppingBag, Terminal, Monitor, ArrowUpRight, TrendingUp } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="relative group card-premium p-6 flex flex-col justify-between h-full bg-white border-slate-100 hover:border-brand-100 shadow-premium">
    <div className="flex items-start justify-between mb-6">
      <div className={`p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:shadow-lg transition-all duration-500`}>
        <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-500/10 text-success-600 text-[8px] font-black uppercase tracking-widest">
          <TrendingUp className="w-3 h-3" />
          <span>{trend}%</span>
        </div>
      )}
    </div>
    
    <div>
      <h3 className="text-4xl font-black text-slate-900 mb-2 tabular-nums tracking-tighter">
        {value}
      </h3>
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
          {label}
        </p>
        <ArrowUpRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>

    {/* Subtle design element */}
    <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-premium opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-full" />
  </div>
);

const DashboardStats = ({ totems = [] }) => {
  const stats = [
    {
      label: 'Active Terminals',
      value: totems.length,
      icon: Monitor,
      color: 'text-brand-500',
      trend: 12
    },
    {
      label: 'Partner Network',
      value: new Set(totems.map((t) => t.user?.email || t.partnerEmail).filter(Boolean)).size,
      icon: Activity,
      color: 'text-accent-500',
    },
    {
      label: 'Media Assets',
      value: totems.reduce((acc, t) => acc + (t.videoCount || 0), 0),
      icon: Video,
      color: 'text-indigo-500',
      trend: 8
    },
    {
      label: 'Catalog Items',
      value: totems.reduce((acc, t) => acc + (t.productCount || 0), 0),
      icon: ShoppingBag,
      color: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>
  );
};

export default DashboardStats;

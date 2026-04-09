import React from 'react';
import { Link } from 'react-router';
import { LogOut, LayoutDashboard, PlusCircle, Video, Settings, Monitor, Sparkles, ChevronRight } from 'lucide-react';

const SidebarLayout = ({
  isSidebarOpen,
  onClose,
  navItems,
  pathname,
  user,
  onLogout,
}) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-md lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] transition-all duration-500 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo Section */}
          <div className="p-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-brand-500/20 ring-4 ring-brand-50">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none flex items-center gap-1">
                TOTEM<span className="text-brand-500">MAX</span>
                <Sparkles className="w-3 h-3 text-accent-500" />
              </h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] mt-1.5 uppercase">Studio Edition</p>
            </div>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto pt-4">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Navigation</p>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                    ${isActive
                      ? 'bg-slate-50 text-slate-900 shadow-sm border border-slate-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-premium text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-bold tracking-tight text-sm ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <ChevronRight className="ml-auto w-4 h-4 text-slate-400" />
                  )}
                </Link>
              );
            })}

            <div className="pt-10 px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Management</p>
            </div>
            <Link
              to="/settings"
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all group"
            >
              <div className="p-2 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                <Settings className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight text-sm">Settings</span>
            </Link>
          </nav>

          {/* User Profile Section */}
          <div className="p-8 bg-slate-50/50 mt-auto">
            <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xs border border-slate-200 uppercase">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 font-bold truncate">Cloud Verified</p>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="group flex items-center justify-center gap-3 w-full px-4 py-4 rounded-2xl bg-slate-100 hover:bg-danger-500 text-slate-500 hover:text-white transition-all duration-500 font-black text-[10px] uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              <span>Secure Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarLayout;

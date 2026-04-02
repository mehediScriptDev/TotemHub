import React from 'react';
import { Link } from 'react-router';
import { LogOut, Zap } from 'lucide-react';

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
          className="fixed inset-0 z-40 bg-surface-900/10 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-surface-900 border-r border-surface-800 shadow-sm transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center gap-3 border-b border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">TotemHub</h1>
              <p className="text-[10px] font-bold text-surface-500 tracking-widest leading-none mt-1 uppercase">Management</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                    ${isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-surface-500 hover:bg-surface-800 hover:text-white'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-surface-400 group-hover:text-surface-600'}`} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-brand-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-surface-800 space-y-4">
            <div className="flex items-center gap-3 px-3 py-3 bg-surface-800 rounded-xl border border-surface-800">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-black text-sm border-2 border-surface-900 shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-white truncate">Senior Admin</p>
                <p className="text-[12px] text-surface-500 font-bold truncate tracking-tight">{user?.email || 'admin@totem.com'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group font-bold tracking-tight"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarLayout;

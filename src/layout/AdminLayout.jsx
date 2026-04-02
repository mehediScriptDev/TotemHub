import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Zap,
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ScrollToTop from '../Components/utility/ScrollToTop';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Create Totem', path: '/totem/new', icon: PlusCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-surface-50">
      <ScrollToTop />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-surface-900/10 backdrop-blur-sm lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-surface-900 border-r border-surface-800 shadow-sm transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-y-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-8 flex items-center gap-3 border-b border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none uppercase">TotemHub</h1>
              <p className="text-[10px] font-bold text-surface-500 tracking-widest leading-none mt-1 uppercase">Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative
                    ${isActive 
                      ? 'bg-brand-500 text-white' 
                      : 'text-surface-500 hover:bg-surface-800 hover:text-white'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-surface-400 group-hover:text-surface-600'}`} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-brand-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-6 border-t border-surface-800 space-y-4">
            <div className="flex items-center gap-3 px-3 py-3 bg-surface-800 rounded-xl border border-surface-800">
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-black text-sm border-2 border-surface-900 shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-white truncate">Senior Admin</p>
                <p className="text-[10px] text-surface-500 font-bold truncate tracking-tight">{user?.email || 'admin@totem.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all group font-bold tracking-tight"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-surface-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-surface-600" />
            </button>

            <nav className="hidden sm:flex items-center gap-2 text-[10px] font-black text-surface-500 uppercase tracking-widest">
              <Link to="/" className="hover:text-brand-600 transition-colors">TotemHub</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-surface-800">{location.pathname === '/' ? 'Dashboard' : 'Management'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-surface-500 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="p-2 text-surface-500 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-4 lg:p-10">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;

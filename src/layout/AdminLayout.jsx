import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  ChevronRight, 
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ScrollToTop from '../Components/utility/ScrollToTop';
import SidebarLayout from './SidebarLayout';

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

      <SidebarLayout
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
        pathname={location.pathname}
        user={user}
        onLogout={handleLogout}
      />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-72">
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

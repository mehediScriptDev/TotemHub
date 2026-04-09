import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Menu, 
  Search,
  ChevronRight, 
  Bell,
  Settings,
  Video,
  Globe,
  ExternalLink
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
    { label: 'Deployment', path: '/totem/new', icon: PlusCircle },
    { label: 'Media Library', path: '/videos', icon: Video },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF1] text-slate-900 overflow-hidden">
      <ScrollToTop />

      {/* Modern Background Decorations */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-brand-500/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <SidebarLayout
        isSidebarOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
        pathname={location.pathname}
        user={user}
        onLogout={handleLogout}
      />

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen lg:pl-72 relative">
        
        {/* Topbar */}
        <header className="h-24 bg-white/80 backdrop-blur-2xl border-b border-slate-100 flex items-center justify-between px-8 sm:px-12 sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <button 
              className="lg:hidden p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-900" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-2.5 w-96 group focus-within:bg-white focus-within:shadow-lg focus-within:border-brand-500/20 transition-all duration-300">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-brand-500" />
              <input 
                type="text" 
                placeholder="Search archives..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder:text-slate-400 font-medium" 
              />
            </div>

            <nav className="hidden xl:flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Link to="/" className="hover:text-brand-500 transition-colors">OS</Link>
              <ChevronRight className="w-3 h-3 opacity-30" />
              <span className="text-slate-900">
                {location.pathname === '/' ? 'Overview' : 
                 location.pathname.includes('/totem/') ? 'Terminal' : 
                 location.pathname === '/videos' ? 'Assets' : 'System'}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-[10px] font-black tracking-widest uppercase">
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              Sync Active
            </div>

            <div className="h-10 w-px bg-slate-100 mx-2" />

            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-brand-500 hover:bg-slate-50 rounded-2xl transition-all relative group">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-brand-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform shadow-lg shadow-brand-500/40"></span>
              </button>
              
              <a 
                href="https://totemmax.io" 
                target="_blank" 
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 ml-4 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-xl shadow-slate-900/10"
              >
                <span>Live View</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-8 sm:p-12 lg:p-16 overflow-x-hidden page-transition">
          <Outlet />
        </section>

        {/* Footer info (Premium Studio) */}
        <footer className="px-12 py-8 border-t border-slate-100 text-[10px] font-black text-slate-400 tracking-widest uppercase flex flex-col sm:flex-row justify-between items-center gap-6 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-900">T</div>
             <span>© 2024 TOTEMMAX STUDIO PLATFORM</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-brand-500 cursor-pointer transition-colors border-b border-transparent hover:border-brand-500">Resource Hub</span>
            <span className="hover:text-brand-500 cursor-pointer transition-colors border-b border-transparent hover:border-brand-500">Cloud Status</span>
            <span className="text-slate-200">|</span>
            <span className="text-slate-900 tracking-normal font-bold lowercase">v2.4.0-stable</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default AdminLayout;

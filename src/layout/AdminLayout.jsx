import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  Monitor,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Dashboard', path: '/' }];

    const crumbs = [{ label: 'Dashboard', path: '/' }];
    let accumulated = '';
    paths.forEach((segment) => {
      accumulated += `/${segment}`;
      const label = segment === 'totem'
        ? 'Totems'
        : segment === 'new'
        ? 'Create New'
        : segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, path: accumulated });
    });
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        ref={sidebarRef}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-surface-900 border-r border-surface-800
          flex flex-col transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-800 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-surface-100 leading-tight">
              Totem<span className="text-brand-400">Hub</span>
            </h1>
            <p className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">
              Management
            </p>
          </div>
          {/* Close btn (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-lg hover:bg-surface-800 text-surface-400
                       lg:hidden transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-surface-500 uppercase tracking-widest">
            Main
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200 group
                 ${
                   isActive
                     ? 'bg-brand-600/15 text-brand-400 shadow-sm'
                     : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
                 }
                `
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="px-3 py-3 border-t border-surface-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-800/40">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-200 truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[11px] text-surface-500 truncate">
                {user?.email || 'admin@totemhub.io'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-500
                         hover:text-danger-400 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-surface-900/80 backdrop-blur-md border-b border-surface-800 flex items-center px-4 lg:px-6 gap-4 shrink-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-surface-800 text-surface-400
                       lg:hidden transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.path}>
                {i > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-surface-600 shrink-0" />
                )}
                <span
                  className={`whitespace-nowrap ${
                    i === breadcrumbs.length - 1
                      ? 'text-surface-200 font-medium'
                      : 'text-surface-500'
                  }`}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

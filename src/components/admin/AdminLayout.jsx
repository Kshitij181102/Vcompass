import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, Newspaper,
  CalendarDays, BookOpen, LogOut, Menu, X, Shield, Clock
} from 'lucide-react';
import apis from '../../utils/apis';

const links = [
  { to: '/admin',               label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/applications',  label: 'Applications', icon: Clock },
  { to: '/admin/users',         label: 'Users',        icon: Users },
  { to: '/admin/mentors',       label: 'Mentors',      icon: GraduationCap },
  { to: '/admin/news',          label: 'News',         icon: Newspaper },
  { to: '/admin/events',        label: 'Events',       icon: CalendarDays },
  { to: '/admin/bookings',      label: 'Bookings',     icon: BookOpen },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await fetch(apis().logoutUser, { method: 'POST', credentials: 'include' }); } catch {}
    sessionStorage.clear();
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-gray-900 ${mobile ? '' : 'w-64'}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">V-Compass</p>
          <p className="text-gray-400 text-xs">Admin Panel</p>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
               ${isActive ? 'bg-amber-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-64">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold text-sm">Admin Panel</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

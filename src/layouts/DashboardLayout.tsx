import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Organizations', path: ROUTES.ORGANIZATIONS },
    { label: 'Vehicles', path: ROUTES.VEHICLES },
    { label: 'Drivers', path: ROUTES.DRIVERS },
    { label: 'Trips', path: ROUTES.TRIPS },
    { label: 'Bookings', path: ROUTES.BOOKINGS },
    { label: 'Expenses', path: ROUTES.EXPENSES },
    { label: 'Maintenance', path: ROUTES.MAINTENANCE },
    { label: 'Loans', path: ROUTES.LOANS },
    { label: 'Documents', path: ROUTES.DOCUMENTS },
    { label: 'Reports', path: ROUTES.REPORTS },
    { label: 'Settings', path: ROUTES.SETTINGS },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-wider text-white">TRAMS</h2>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <p className="font-semibold text-white">{user?.name || 'User'}</p>
            <p className="text-slate-400">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-xs text-rose-400 hover:text-rose-300"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-800">Overview</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

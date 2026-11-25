import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const DriverLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="font-bold text-lg">TRAMS Driver Portal</div>
        <div className="flex items-center gap-3 text-sm">
          <span>{user?.name}</span>
          <button
            onClick={logout}
            className="bg-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-800"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DriverLayout;

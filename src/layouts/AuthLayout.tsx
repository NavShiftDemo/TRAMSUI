import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TRAMS</h1>
          <p className="text-sm text-slate-500">Transport Asset Management System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

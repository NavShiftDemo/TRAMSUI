import React from 'react';
import { Truck } from 'lucide-react';
import { APP_NAME, ROUTES } from '@/constants';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto sm:self-start flex items-center gap-3 sm:gap-6">
      <div className="flex items-center gap-2">
        <Truck className="w-8 h-8 p-1.5 text-gray-900" aria-hidden />
        <span className="text-gray-900 font-semibold text-base">{APP_NAME}</span>
      </div>
      <div className="hidden sm:flex items-center gap-5 text-sm text-gray-700">
        {['Dashboard', 'Features', 'About', 'Contact'].map((l) => (
          <a
            key={l}
            href={l === 'Dashboard' ? ROUTES.dashboard : `#${l.toLowerCase()}`}
            className="hover:text-black transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
      <a
        href={ROUTES.register}
        className="ml-auto sm:ml-0 bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors"
      >
        Create Account
      </a>
    </nav>
  );
};

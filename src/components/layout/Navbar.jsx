import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function Navbar() {
  const { user, logout } = useAppContext();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold tracking-tight text-indigo-600">SlotSync</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 block text-right">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize block text-right">
                    {user.role} {user.role === 'cr' ? `· ${user.programme}` : ''}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold overflow-hidden border border-indigo-200">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!login(username)) {
      setError('Invalid role/user. Try "admin" or "cr".');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          SlotSync
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Real-Time Classroom and Laboratory Slot Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username (Role)
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter 'admin' or 'cr'"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-medium bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Sign in
              </button>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="font-semibold mb-1">Available Mock Logins:</p>
              <ul className="space-y-1">
                <li>Username: <span className="font-mono bg-white px-1 border rounded">admin</span> (Admin Role)</li>
                <li>Username: <span className="font-mono bg-white px-1 border rounded">cr</span> (Class Rep Role)</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

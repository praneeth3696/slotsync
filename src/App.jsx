import React from 'react';
import { useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CRDashboard from './pages/CRDashboard';
import Navbar from './components/layout/Navbar';

function App() {
  const { user } = useAppContext();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0 animate-in fade-in duration-300">
          {user.role === 'admin' ? <AdminDashboard /> : <CRDashboard />}
        </div>
      </main>
    </div>
  );
}

export default App;

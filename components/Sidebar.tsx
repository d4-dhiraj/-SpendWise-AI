
import React, { useState } from 'react';
import { signOut } from '../services/firebaseService';

interface SidebarProps {
  user?: any;
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Auth state listener in App.tsx will handle the redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-20 transition-all duration-300 hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-wallet text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            SpendWise AI
          </h1>
        </div>

        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 rounded-xl font-semibold">
            <i className="fas fa-chart-line w-5"></i>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
            <i className="fas fa-receipt w-5"></i>
            Transactions
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
            <i className="fas fa-tags w-5"></i>
            Categories
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-medium">
            <i className="fas fa-cog w-5"></i>
            Settings
          </a>
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
          <img 
            src={user?.photoURL || "https://picsum.photos/seed/student/40/40"} 
            alt="User" 
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.displayName || "Student"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{user?.email || "Free Tier"}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all text-sm"
        >
          <i className={`fas fa-sign-out-alt ${isLoggingOut ? 'animate-pulse' : ''}`}></i>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

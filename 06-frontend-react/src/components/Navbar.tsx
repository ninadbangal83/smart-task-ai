import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { Server, Shield, LogOut, Cpu, HardDrive } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    serverUrl, 
    authStrategy, 
    serverHealth, 
    isConnecting,
    setServerUrl, 
    setAuthStrategy, 
    logout,
    checkServerHealth
  } = useAuthStore();

  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 10000); // Poll health every 10 seconds
    return () => clearInterval(interval);
  }, [serverUrl]);

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-50 via-slate-100 to-indigo-400">
              SmartTask AI
            </span>
            <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
              Universal Orchestrator
            </div>
          </div>
        </div>

        {/* Configurations Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Server Port Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setServerUrl('http://localhost:3000')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                serverUrl === 'http://localhost:3000'
                  ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HardDrive size={13} />
              Native (3000)
            </button>
            <button
              onClick={() => setServerUrl('http://localhost:3001')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                serverUrl === 'http://localhost:3001'
                  ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server size={13} />
              Express (3001)
            </button>
          </div>

          {/* Auth Strategy Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setAuthStrategy('JWT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                authStrategy === 'JWT'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-slate-50 shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield size={13} />
              JWT Auth
            </button>
            <button
              onClick={() => setAuthStrategy('SESSION')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                authStrategy === 'SESSION'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-slate-50 shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield size={13} />
              Session Auth
            </button>
          </div>

          {/* Health Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
            serverHealth
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <span className={`h-2 w-2 rounded-full ${
              serverHealth ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}></span>
            {isConnecting ? 'Syncing...' : serverHealth ? 'Server UP' : 'Offline'}
          </div>
        </div>

        {/* User profile & Logout */}
        {user && (
          <div className="flex items-center gap-4 pl-4 border-t md:border-t-0 md:border-l border-slate-800 w-full md:w-auto justify-between md:justify-start">
            <div className="text-left">
              <div className="text-sm font-bold text-slate-100">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-mono font-medium capitalize">
                Role: <span className="text-indigo-400">{user.role}</span>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

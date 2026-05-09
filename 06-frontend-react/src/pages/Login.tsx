import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { apiClient } from '../api/client';
import { Lock, Mail, User, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginSuccess, serverUrl, authStrategy, serverHealth, checkServerHealth } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  
  // Inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkServerHealth();
  }, [serverUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        // Register Call
        const response = await apiClient.post('/api/auth/register', {
          name,
          email,
          password,
          role,
        });
        
        // Success payload formats
        const { user, token } = response.data;
        loginSuccess(user, token);
      } else {
        // Login Call
        const response = await apiClient.post('/api/auth/login', {
          email,
          password,
        });

        const { user, token } = response.data;
        loginSuccess(user, token);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Make sure your server is online.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          {/* Icon Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl mb-4 shadow-inner relative group">
              <Cpu size={32} className="group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles size={14} className="absolute -top-1 -right-1 text-amber-400 animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-slate-50 tracking-tight">
              {isRegister ? 'Register Account' : 'Authenticate Identity'}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {isRegister ? 'Join the Multi-Variant Orchestration Core' : 'Sign in to access your universal dashboard'}
            </p>
          </div>

          {/* Offline Warning Banner */}
          {!serverHealth && (
            <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs text-left">
              <ShieldAlert size={16} className="shrink-0 mt-0.5 animate-bounce" />
              <div>
                <span className="font-bold block text-rose-300">Backend Server Offline</span>
                The frontend is set to use <code className="bg-rose-500/5 px-1 rounded text-rose-300">{serverUrl}</code> but no online listener was detected. Please launch the backend server first.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {isRegister && (
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input
                    type="text"
                    required
                    placeholder="Master Coder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 pl-1">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  required
                  placeholder="admin@smarttask.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 pl-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 pl-1">
                  Access Role
                </label>
                <div className="flex gap-2.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
                      role === 'user' ? 'bg-slate-800 text-slate-50' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    User Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all ${
                      role === 'admin' ? 'bg-slate-800 text-slate-50' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Admin Account
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-2.5 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-indigo-900/10 cursor-pointer"
            >
              {isLoading ? 'Decrypting Cryptography...' : isRegister ? 'Register Identity' : 'Authorize Identity'}
            </button>
          </form>

          {/* Bottom toggle */}
          <div className="mt-6 text-center text-xs">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

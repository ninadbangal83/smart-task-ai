import React from 'react';
import { useAuthStore } from '../stores/auth.store';
import { Database, MessageSquare, ShieldCheck, Activity } from 'lucide-react';

export const ServerStatusAlert: React.FC = () => {
  const { serverUrl, authStrategy, serverHealth } = useAuthStore();

  if (!serverHealth) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center gap-3 max-w-4xl mx-auto shadow-lg shadow-rose-950/10">
        <Activity className="animate-pulse shrink-0" size={20} />
        <div className="text-sm text-left">
          <span className="font-bold block text-rose-300">Backend Connection Error</span>
          Failed to establish link with the server at <code className="text-rose-400 bg-rose-500/5 px-1.5 py-0.5 rounded text-xs font-mono">{serverUrl}</code>. Ensure the backend server is running in its terminal.
        </div>
      </div>
    );
  }

  // Determine active port info
  let serverName = 'Express Server';
  if (serverUrl.includes('3000')) {
    serverName = 'Native Node.js Server';
  } else if (serverUrl.includes('3002')) {
    serverName = 'NestJS Enterprise Server';
  } else if (serverUrl.includes('3003')) {
    serverName = 'Java Spring Boot Enterprise Server';
  }

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 max-w-4xl mx-auto backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/60">
        <div className="text-left">
          <span className="text-xs text-indigo-400 font-mono font-bold tracking-wider uppercase">Active Pipeline</span>
          <h2 className="text-lg font-bold text-slate-100">{serverName}</h2>
        </div>
        <code className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          {serverUrl}
        </code>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        {/* DB Type */}
        <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Database size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Database</div>
            <div className="text-xs font-bold text-slate-200">MongoDB</div>
          </div>
        </div>

        {/* Broker Type */}
        <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Broker</div>
            <div className="text-xs font-bold text-slate-200">RabbitMQ</div>
          </div>
        </div>

        {/* Auth Mode */}
        <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Strategy</div>
            <div className="text-xs font-bold text-slate-200">{authStrategy} Strategy</div>
          </div>
        </div>

        {/* Sync Latency */}
        <div className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Activity size={16} className="animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Latency</div>
            <div className="text-xs font-bold text-emerald-400">⚡ Perfect</div>
          </div>
        </div>
      </div>
    </div>
  );
};

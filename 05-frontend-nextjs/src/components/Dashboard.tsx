"use client";

import React, { useEffect } from 'react';
import { useTaskStore } from '@/stores/task.store';
import { useAuthStore } from '@/stores/auth.store';
import { ServerStatusAlert } from '@/components/ServerStatusAlert';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { Search, SlidersHorizontal, ListChecks, CheckSquare, Clock, LayoutGrid, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    tasks, 
    isLoading, 
    error, 
    filter, 
    searchQuery, 
    fetchTasks, 
    setFilter, 
    setSearchQuery 
  } = useTaskStore();
  
  const { serverUrl, authStrategy } = useAuthStore();

  useEffect(() => {
    fetchTasks();
  }, [serverUrl, authStrategy]);

  // Client-side search and status filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && task.status === 'pending') ||
      (filter === 'completed' && task.status === 'completed');

    return matchesSearch && matchesFilter;
  });

  // Calculate live task metrics
  const totalCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Server Telemetry Alert */}
      <ServerStatusAlert />

      {/* 2. Live Task Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-colors">
          <div className="text-left space-y-1 z-10">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Tasks</span>
            <div className="text-2xl font-black text-slate-100">{totalCount}</div>
            <span className="text-[10px] text-indigo-400 font-semibold font-mono">Tasks Registered</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl z-10">
            <LayoutGrid size={22} />
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-colors">
          <div className="text-left space-y-1 z-10">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Pending Tasks</span>
            <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
            <span className="text-[10px] text-amber-500 font-semibold font-mono">Awaiting Action</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl z-10">
            <Clock size={22} />
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        {/* Completed Tasks Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-colors">
          <div className="text-left space-y-1 z-10">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Completed</span>
            <div className="text-2xl font-black text-emerald-400">{completedCount}</div>
            <span className="text-[10px] text-emerald-500 font-semibold font-mono">Task Success</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl z-10">
            <CheckSquare size={22} />
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        {/* Completion Progress Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-slate-700/60 transition-colors">
          <div className="text-left space-y-2 z-10 w-full pr-12">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Completion Rate</span>
            <div className="text-2xl font-black text-purple-400">{completionPercentage}%</div>
            
            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl absolute right-5 top-5 z-10">
            <ListChecks size={22} />
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-slate-800/40">
        {/* Left Side: Tasks Feed (LG:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Controls: Filter Toggles & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search orchestrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Filter Categories */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs w-full sm:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-slate-800 text-slate-100 shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal size={12} />
                All
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'pending'
                    ? 'bg-slate-800 text-amber-400 shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock size={12} />
                Pending
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
                  filter === 'completed'
                    ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckSquare size={12} />
                Completed
              </button>
            </div>
          </div>

          {/* Server Error Message Block */}
          {error && (
            <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-left">
              ⚠️ {error}
            </div>
          )}

          {/* Tasks Grid Listing */}
          <div>
            {isLoading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={36} />
                <span className="text-sm font-semibold animate-pulse">Synchronizing Orchestration Logs...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="border border-dashed border-slate-800 rounded-3xl p-16 text-center text-slate-400">
                <LayoutGrid className="mx-auto text-slate-600 mb-4" size={40} />
                <h3 className="font-bold text-slate-300 text-sm mb-1">No tasks detected</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {searchQuery ? "No results match your search query." : "Spawn a new task above to initialize the orchestration pipeline."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Task Creator Panel (LG:col-span-4) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="text-left space-y-1 pl-1">
            <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wide">Create Task Node</h2>
            <p className="text-[11px] text-slate-500 leading-relaxed">Spawn a new task worker node into the cluster queue.</p>
          </div>
          <TaskForm />
        </div>
      </div>
    </div>
  );
};

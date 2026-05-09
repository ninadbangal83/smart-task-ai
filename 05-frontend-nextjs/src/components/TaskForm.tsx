"use client";

import React, { useState } from 'react';
import { useTaskStore } from '@/stores/task.store';
import { PlusCircle, Loader2 } from 'lucide-react';

export const TaskForm: React.FC = () => {
  const { createTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await createTask(title, description);
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm h-fit">
      <div className="flex flex-col gap-4 text-left">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Review code architecture..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 pl-1">
            Task Description (Optional)
          </label>
          <textarea
            placeholder="Review core design patterns, separate routing from services..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none"
          />
        </div>

        {error && (
          <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-900/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Spawning Orchestrator...
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              Add Orchestration Task
            </>
          )}
        </button>
      </div>
    </form>
  );
};

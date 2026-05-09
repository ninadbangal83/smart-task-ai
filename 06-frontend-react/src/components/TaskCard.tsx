import React, { useState } from 'react';
import { Task, useTaskStore } from '../stores/task.store';
import { CheckCircle2, Circle, Trash2, Edit2, X, Check, Calendar, AlertTriangle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleToggleStatus = async () => {
    const nextStatus = task.status === 'pending' ? 'completed' : 'pending';
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    try {
      await updateTask(task.id, { title: editTitle, description: editDesc });
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    // Front-end check of Domain Business Rule: Cannot delete a completed task
    if (task.status === 'completed') {
      setDeleteError('Rich Domain Guard: Cannot delete a completed task!');
      setTimeout(() => setDeleteError(null), 4000);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (err: any) {
      setDeleteError(err.message || 'Deletion rejected by Server domain guards.');
      setIsDeleting(false);
      setTimeout(() => setDeleteError(null), 4000);
    }
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`group relative bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:bg-slate-900/80 transition-all shadow-xl hover:shadow-indigo-950/5 flex flex-col justify-between min-h-[180px] overflow-hidden ${
      task.status === 'completed' ? 'opacity-80 border-slate-800/60' : ''
    }`}>
      {/* Decorative gradient highlight on hover */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all bg-gradient-to-r ${
        task.status === 'completed' 
          ? 'from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500 group-hover:to-teal-500' 
          : 'from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500 group-hover:to-purple-500'
      }`}></div>

      <div>
        {/* Header Block */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            onClick={handleToggleStatus}
            className={`shrink-0 transition-colors ${
              task.status === 'completed' ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>

          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <h3 className={`w-full text-left text-sm font-bold text-slate-100 leading-tight ${
              task.status === 'completed' ? 'line-through text-slate-400' : ''
            }`}>
              {task.title}
            </h3>
          )}

          {/* Action Tools */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 hover:bg-emerald-500/10 text-emerald-400 rounded-lg transition-colors"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 rounded-lg transition-colors"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-indigo-500/10 text-indigo-400 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`p-1.5 rounded-lg transition-colors ${
                    task.status === 'completed' 
                      ? 'text-slate-600 cursor-not-allowed' 
                      : 'hover:bg-rose-500/10 text-rose-400'
                  }`}
                  title={task.status === 'completed' ? "Completed tasks cannot be deleted" : "Delete"}
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description Block */}
        <div className="text-left mb-4">
          {isEditing ? (
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none mt-1"
            />
          ) : (
            <p className={`text-xs text-slate-400 font-medium leading-relaxed ${
              task.status === 'completed' ? 'line-through text-slate-500' : ''
            }`}>
              {task.description || 'No description provided.'}
            </p>
          )}
        </div>
      </div>

      {/* Footer Block */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/40 text-[10px] text-slate-500 font-mono">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} />
          {formattedDate}
        </div>
        <div className={`px-2 py-0.5 rounded font-bold uppercase ${
          task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
        }`}>
          {task.status}
        </div>
      </div>

      {/* Domain Exception Alert Layer */}
      {deleteError && (
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm p-4 flex flex-col items-center justify-center text-center animate-fade-in">
          <AlertTriangle className="text-rose-400 mb-2 animate-bounce" size={24} />
          <span className="text-xs font-bold text-rose-400 block mb-1">Domain Exception Guard</span>
          <p className="text-[10px] text-slate-300 max-w-[200px] leading-relaxed">
            {deleteError}
          </p>
        </div>
      )}
    </div>
  );
};

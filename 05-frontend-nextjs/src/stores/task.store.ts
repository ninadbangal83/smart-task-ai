import { create } from 'zustand';
import { apiClient } from '@/api/client';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
  searchQuery: string;

  fetchTasks: () => Promise<void>;
  createTask: (title: string, description?: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  setSearchQuery: (query: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  searchQuery: '',

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<Task[]>('/api/tasks');
      // Sort tasks: newest first
      const sorted = (response.data || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      set({ tasks: sorted, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tasks', isLoading: false });
    }
  },

  createTask: async (title, description) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<Task>('/api/tasks', { title, description });
      const currentTasks = get().tasks;
      set({ tasks: [response.data, ...currentTasks], isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to create task', isLoading: false });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await apiClient.put<Task>(`/api/tasks/${id}`, data);
      const updatedTasks = get().tasks.map((t) => (t.id === id ? response.data : t));
      set({ tasks: updatedTasks });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update task' });
      throw err;
    }
  },

  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/api/tasks/${id}`);
      const filteredTasks = get().tasks.filter((t) => t.id !== id);
      set({ tasks: filteredTasks });
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete task' });
      throw err;
    }
  },

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (query) => set({ searchQuery: query })
}));

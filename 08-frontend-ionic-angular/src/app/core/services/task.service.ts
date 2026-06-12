import { Injectable, signal, computed } from '@angular/core';
import { ApiClientService } from './api-client.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _filter = signal<'all' | 'pending' | 'completed'>('all');
  private readonly _searchQuery = signal<string>('');

  // Expose read-only signals
  readonly tasks = this._tasks.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  // Computed state for filtered tasks
  readonly filteredTasks = computed(() => {
    const allTasks = this._tasks();
    const activeFilter = this._filter();
    const query = this._searchQuery().toLowerCase().trim();

    let result = allTasks;

    // Filter by status
    if (activeFilter === 'pending') {
      result = result.filter(t => t.status === 'pending');
    } else if (activeFilter === 'completed') {
      result = result.filter(t => t.status === 'completed');
    }

    // Filter by search query
    if (query) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(query) || 
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    return result;
  });

  // Computed state for analytics
  readonly stats = computed(() => {
    const allTasks = this._tasks();
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const progress = total > 0 ? completed / total : 0;

    return { total, completed, pending, progress };
  });

  constructor(private apiClient: ApiClientService) {}

  async fetchTasks(): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await this.apiClient.get<Task[]>('/api/tasks');
      // Sort tasks: newest first
      const sorted = (response || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      this._tasks.set(sorted);
    } catch (err: any) {
      this._error.set(err.message || 'Failed to fetch tasks');
    } finally {
      this._isLoading.set(false);
    }
  }

  async createTask(title: string, description?: string): Promise<void> {
    this._isLoading.set(true);
    this._error.set(null);
    try {
      const response = await this.apiClient.post<Task>('/api/tasks', { title, description });
      const currentTasks = this._tasks();
      this._tasks.set([response, ...currentTasks]);
    } catch (err: any) {
      this._error.set(err.message || 'Failed to create task');
      throw err;
    } finally {
      this._isLoading.set(false);
    }
  }

  async updateTask(id: string, data: Partial<Task>): Promise<void> {
    try {
      const response = await this.apiClient.put<Task>(`/api/tasks/${id}`, data);
      const updatedTasks = this._tasks().map((t) => (t.id === id ? response : t));
      this._tasks.set(updatedTasks);
    } catch (err: any) {
      this._error.set(err.message || 'Failed to update task');
      throw err;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/api/tasks/${id}`);
      const filteredTasks = this._tasks().filter((t) => t.id !== id);
      this._tasks.set(filteredTasks);
    } catch (err: any) {
      this._error.set(err.message || 'Failed to delete task');
      throw err;
    }
  }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this._filter.set(filter);
  }

  setSearchQuery(query: string) {
    this._searchQuery.set(query);
  }

  clearTasks() {
    this._tasks.set([]);
  }
}

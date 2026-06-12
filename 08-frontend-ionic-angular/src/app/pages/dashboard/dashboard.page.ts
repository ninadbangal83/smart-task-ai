import { Component, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  constructor(
    public authService: AuthService,
    public taskService: TaskService
  ) {
    // Automatically refetch tasks when server config or authentication state changes
    effect(() => {
      // Access signals to register them as dependencies
      const url = this.authService.serverUrl();
      const strategy = this.authService.authStrategy();
      const isAuthenticated = this.authService.isAuthenticated();

      if (isAuthenticated) {
        this.taskService.fetchTasks();
      } else {
        this.taskService.clearTasks();
      }
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.taskService.setFilter(filter);
  }

  onSearch(event: any) {
    const query = event.target.value || '';
    this.taskService.setSearchQuery(query);
  }
}

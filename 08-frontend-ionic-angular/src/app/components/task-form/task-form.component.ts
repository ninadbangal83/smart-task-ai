import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false,
})
export class TaskFormComponent {
  title: string = '';
  description: string = '';
  isSubmitting: boolean = false;
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.title.trim()) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    try {
      await this.taskService.createTask(this.title.trim(), this.description.trim() || undefined);
      this.title = '';
      this.description = '';
    } catch (err: any) {
      this.errorMessage = err.message || 'Failed to spawn task node';
    } finally {
      this.isSubmitting = false;
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: false,
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  isEditing: boolean = false;
  editTitle: string = '';
  editDesc: string = '';
  isDeleting: boolean = false;
  deleteError: string | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.editTitle = this.task.title;
    this.editDesc = this.task.description || '';
  }

  get formattedDate(): string {
    return new Date(this.task.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async handleToggleStatus() {
    const nextStatus = this.task.status === 'pending' ? 'completed' : 'pending';
    try {
      await this.taskService.updateTask(this.task.id, { status: nextStatus });
    } catch (err: any) {
      console.error(err);
    }
  }

  async handleSave() {
    if (!this.editTitle.trim()) return;
    try {
      await this.taskService.updateTask(this.task.id, {
        title: this.editTitle.trim(),
        description: this.editDesc.trim() || undefined
      });
      this.isEditing = false;
    } catch (err: any) {
      console.error(err);
    }
  }

  async handleDelete() {
    // Front-end check of Domain Business Rule: Cannot delete a completed task
    if (this.task.status === 'completed') {
      this.showDeleteError('Rich Domain Guard: Cannot delete a completed task!');
      return;
    }

    this.isDeleting = true;
    try {
      await this.taskService.deleteTask(this.task.id);
    } catch (err: any) {
      this.showDeleteError(err.message || 'Deletion rejected by Server domain guards.');
      this.isDeleting = false;
    }
  }

  private showDeleteError(msg: string) {
    this.deleteError = msg;
    setTimeout(() => {
      this.deleteError = null;
    }, 4000);
  }
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskDto = Pick<Task, 'title' | 'description'>;

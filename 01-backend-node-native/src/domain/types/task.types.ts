export interface Task {
  id: string;
  userId: string; // Added this!
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskDto = Pick<Task, 'title' | 'description'>;

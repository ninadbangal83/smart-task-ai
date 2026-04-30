import pkg from 'pg';
import { config } from '@config/app.config';
const { Pool } = pkg;
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { Task, CreateTaskDto } from '@domain-types/task.types';

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export class PostgresTaskRepository implements ITaskRepository {
  private pool: pkg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.POSTGRES_URI
    });
  }

  async create(data: CreateTaskDto & { userId: string }): Promise<Task> {
    const query = 'INSERT INTO tasks(title, description, status, user_id) VALUES($1, $2, $3, $4) RETURNING *';
    const values = [data.title, data.description, 'pending', data.userId];
    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0] as TaskRow);
  }

  async findById(id: string, userId?: string): Promise<Task | null> {
    const sql = userId 
      ? 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2' 
      : 'SELECT * FROM tasks WHERE id = $1';
    const params = userId ? [id, userId] : [id];
    const { rows } = await this.pool.query(sql, params);
    return rows[0] ? this.mapToEntity(rows[0] as TaskRow) : null;
  }

  async findAll(userId?: string): Promise<Task[]> {
    const sql = userId ? 'SELECT * FROM tasks WHERE user_id = $1' : 'SELECT * FROM tasks';
    const params = userId ? [userId] : [];
    const { rows } = await this.pool.query(sql, params);
    return (rows as TaskRow[]).map(row => this.mapToEntity(row));
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const res = await this.pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), status = COALESCE($2, status) WHERE id = $3 RETURNING *',
      [data.title, data.status, id]
    );
    return this.mapToEntity(res.rows[0] as TaskRow);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }

  private mapToEntity(row: TaskRow): Task {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      status: row.status as Task['status'],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

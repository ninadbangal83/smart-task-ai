import pkg from 'pg';
const { Pool } = pkg;
import { ITaskRepository } from '@domain/repositories/itask.repository';
import { Task, CreateTaskDto } from '@domain-types/task.types';

export class PostgresTaskRepository implements ITaskRepository {
  private pool: pkg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URI
    });
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const query = 'INSERT INTO tasks(title, description, status) VALUES($1, $2, $3) RETURNING *';
    const values = [data.title, data.description, 'pending'];
    const res = await this.pool.query(query, values);
    return res.rows[0];
  }

  async findById(id: string): Promise<Task | null> {
    const res = await this.pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findAll(): Promise<Task[]> {
    const res = await this.pool.query('SELECT * FROM tasks');
    return res.rows;
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const res = await this.pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), status = COALESCE($2, status) WHERE id = $3 RETURNING *',
      [data.title, data.status, id]
    );
    return res.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  }
}

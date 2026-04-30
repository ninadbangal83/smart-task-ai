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

  async findById(id: string, userId?: string): Promise<Task | null> {
    const sql = userId 
      ? 'SELECT * FROM tasks WHERE id = $1 AND userId = $2' 
      : 'SELECT * FROM tasks WHERE id = $1';
    const params = userId ? [id, userId] : [id];
    const { rows } = await this.pool.query(sql, params);
    return rows[0] || null;
  }

  async findAll(userId?: string): Promise<Task[]> {
    const sql = userId ? 'SELECT * FROM tasks WHERE userId = $1' : 'SELECT * FROM tasks';
    const params = userId ? [userId] : [];
    const { rows } = await this.pool.query(sql, params);
    return rows;
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

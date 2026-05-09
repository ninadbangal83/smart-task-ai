import pkg from 'pg';
const { Pool } = pkg;
import { IUserRepository } from '@domain/repositories/iuser.repository';
import { User, CreateUserDto, UserRole } from '@domain-types/user.types';
import { config } from '@config/app.config';

interface UserRow {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  created_at: Date;
}

export class PostgresUserRepository implements IUserRepository {
  private pool: pkg.Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.POSTGRES_URI
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const query = `
      INSERT INTO users (id, email, password, name, role) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    const id = Math.random().toString(36).substr(2, 9);
    const values = [id, data.email, data.password, data.name, data.role || 'user'];
    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0] as UserRow);
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const res = await this.pool.query(query, [email]);
    return res.rows[0] ? this.mapToEntity(res.rows[0] as UserRow) : null;
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const res = await this.pool.query(query, [id]);
    return res.rows[0] ? this.mapToEntity(res.rows[0] as UserRow) : null;
  }

  async findAll(): Promise<User[]> {
    const res = await this.pool.query('SELECT * FROM users');
    return (res.rows as UserRow[]).map(row => this.mapToEntity(row));
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const query = `UPDATE users SET ${fields} WHERE id = $1 RETURNING *`;
    const res = await this.pool.query(query, [id, ...Object.values(data)]);
    return this.mapToEntity(res.rows[0] as UserRow);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  private mapToEntity(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role as UserRole,
      createdAt: row.created_at,
    };
  }
}

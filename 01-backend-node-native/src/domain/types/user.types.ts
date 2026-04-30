export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
}

export type CreateUserDto = Partial<User> & { email: string; password?: string };

export type LoginDto = { email: string; password: string };

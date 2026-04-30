export interface User {
  id: string;
  email: string;
  password?: string; // Optional because we don't return it in API
  name: string;
  createdAt: Date;
}

export type CreateUserDto = Pick<User, 'email' | 'name' | 'password'>;
